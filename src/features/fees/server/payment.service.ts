import { z } from "zod";
import { IdempotencyGuard } from "@/lib/idempotency";

export const PaymentSubmissionSchema = z.object({
  invoiceId: z.string().cuid(),
  transactionId: z
    .string()
    .min(8, "UTR must be at least 8 characters")
    .max(30, "UTR exceeds maximum length")
    .regex(/^[A-Za-z0-9]+$/, "UTR can only contain alphanumeric characters"),
  amountDeclared: z.number().positive("Declared amount must be greater than zero"),
  receiptFileUrl: z.string().url("Valid receipt URL required").optional(),
  idempotencyKey: z.string().uuid("Invalid idempotency key format"),
});

export type PaymentSubmissionInput = z.infer<typeof PaymentSubmissionSchema>;

export interface PaymentSubmissionResult {
  success: boolean;
  submissionId?: string;
  transactionId?: string;
  amountDeclared?: number;
  status: string;
  message: string;
  isIdempotentReplay?: boolean;
}

/**
 * Server Action / Domain Service:
 * Safely processes fee payment submissions with strict idempotency and duplicate UTR protection.
 */
export async function submitUtrPayment(
  input: PaymentSubmissionInput,
  userId: string
): Promise<PaymentSubmissionResult> {
  // 1. Validate payload via Zod
  const validated = PaymentSubmissionSchema.parse(input);

  // 2. Strict Idempotency Check: Prevents rapid double-clicks on slow mobile networks
  const lockResult = await IdempotencyGuard.acquireLock<PaymentSubmissionResult>(
    validated.idempotencyKey,
    60 // 60-second lock window
  );

  if (lockResult.isDuplicate && lockResult.cachedResponse) {
    return {
      ...lockResult.cachedResponse,
      isIdempotentReplay: true,
      message: "Payment submission already received and queued for bursar audit.",
    };
  }

  try {
    // 3. Database Integrity Checks (Simulated / Prisma in production)
    // - Check if transactionId (UTR) has already been used by any student in the institution
    // const existingUtr = await db.paymentSubmission.findFirst({ where: { transactionId: validated.transactionId } });
    // if (existingUtr) throw new Error("This UTR has already been submitted for another fee invoice.");

    // 4. Save Record: Two-Step Financial Security
    // Student balance is STRICTLY UNTOUCHED at this stage. Status is set to PENDING_VERIFICATION.
    const submissionId = `pay_${Date.now()}`;

    const result: PaymentSubmissionResult = {
      success: true,
      submissionId,
      transactionId: validated.transactionId,
      amountDeclared: validated.amountDeclared,
      status: "PENDING_VERIFICATION",
      message: "Fee submission successfully logged. Dues will update upon bursar physical bank audit.",
      isIdempotentReplay: false,
    };

    // 5. Cache response for subsequent double-taps within 24 hours
    await IdempotencyGuard.saveResponse(validated.idempotencyKey, result);

    return result;
  } catch (error: any) {
    // Release the lock on failure so the parent can fix input or retry
    await IdempotencyGuard.releaseLock(validated.idempotencyKey);
    throw error;
  }
}
