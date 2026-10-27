import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../platform/prisma.service';

@Injectable()
export class CommunicationService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Campus Circulars (Zero-SMS / In-App & Email only)
   */
  async getNotices(audience = 'ALL') {
    return [
      {
        id: 'not-01',
        title: 'Autonomous End-Semester Examination Schedule (Winter 2026)',
        category: 'EXAM',
        audience: 'ALL',
        content: 'Comprehensive timetable ratified. Hall tickets restricted strictly to >=75% attendance.',
        publishedAt: '2026-10-25 09:30 AM',
        author: 'Controller of Examinations',
        priority: 'CRITICAL',
        totalRecipients: 2480,
        acknowledgedCount: 1942,
      },
      {
        id: 'not-02',
        title: 'AICTE Smart India Hackathon Departmental Screening',
        category: 'ACADEMIC',
        audience: 'DEPT_CSE',
        content: 'Shortlisted student teams must present architectures to Review Board on Thursday.',
        publishedAt: '2026-10-24 02:15 PM',
        author: 'HOD Computer Science',
        priority: 'URGENT',
        totalRecipients: 420,
        acknowledgedCount: 388,
      },
    ];
  }

  /**
   * SLA Grievance Helpdesk
   */
  async getTickets(statusFilter = 'ALL') {
    const tickets = [
      {
        id: 'tkt-101',
        ticketNumber: 'TKT-2026-891',
        studentName: 'Sneha Patel',
        rollNo: '2023CSE042',
        category: 'ACADEMIC_EVAL',
        subject: 'Mid-Sem Distributed Systems Retotaling Request',
        priority: 'URGENT',
        slaDeadlineHours: 4,
        hoursRemaining: 1.2,
        status: 'OPEN',
        assignedTo: 'Prof. Sunita Rao',
      },
      {
        id: 'tkt-102',
        ticketNumber: 'TKT-2026-887',
        studentName: 'Zaid Al-Mansoor',
        rollNo: '2023CSE047',
        category: 'FEE_DISPUTE',
        subject: 'Hostel Mess Fee Double-Deduction Recheck',
        priority: 'HIGH',
        slaDeadlineHours: 24,
        hoursRemaining: 6.5,
        status: 'IN_PROGRESS',
        assignedTo: 'Bursar Desk',
      },
    ];

    if (statusFilter === 'ALL') return tickets;
    return tickets.filter((t) => t.status === statusFilter);
  }

  async resolveTicket(ticketId: string, resolutionRemarks: string, staffEmpId: string) {
    return {
      ticketId,
      status: 'RESOLVED',
      resolutionRemarks,
      resolvedBy: staffEmpId,
      resolvedAt: new Date().toISOString(),
      notificationDispatched: 'IN_APP_PUSH_AND_EMAIL',
    };
  }
}
