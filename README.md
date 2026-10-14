# MYSchool ERP — Master Technical Specification & Architecture

> **Institutional Multi-Branch School Management Platform for JSS School**  
> *Digitizes, automates, and connects all daily academic and administrative operations across all campuses and wings.*

---

## 🏛️ Executive Summary

**MYSchool ERP** is an enterprise-grade full-stack platform architected specifically for multi-campus institutional school networks (JSS School: Main Campus, North Campus, East Campus) operating Primary, Middle, Secondary, and Senior Secondary wings.

The architecture eliminates common institutional bottlenecks:
* **High-Speed 8:30 AM Attendance Roll-Call:** Absorbs peak classroom spikes using single-payload array writes (`createMany`) committing 40 students in ~10ms via Supabase Supavisor connection pooling (Port 6543).
* **Two-Step Manual Fee Verification:** Enforces immutable audit integrity by queuing bank transaction IDs (UTR) under `PENDING_VERIFICATION` without balance drops until physical bank statement reconciliation by campus management.
* **Statutory Student Exit Barrier:** Hard programmatic lock requiring typed admission ID confirmation and 4 verified exit certificates (Transfer Certificate, Character Certificate, Migration Certificate, No-Dues Clearance) before allowing permanent deletion.
* **Zero-Timeout Batch PDF Generation:** Headless Inngest workers compile 2,000+ admit cards and fee receipts off-thread into private Supabase Storage, issuing 24-hour pre-signed download URLs.
* **Permanent Lifetime Academic Archives:** Annual cycle promotions archive attendance to cold storage while students retain lifetime digital access to download historical transcripts.

---

## 📚 Complete Documentation Index

All core functional, technical, security, and data specifications are detailed inside the [`docs/`](docs/) directory:

| Document | File Path | Focus & Core Contents |
| :--- | :--- | :--- |
| **Product Requirements Document (PRD)** | [`docs/PRD.md`](docs/PRD.md) | Vision, downside of manual systems, 7 target personas, core feature matrix, and MVP scope. |
| **System Architecture & Data Flow** | [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Full-stack layers, Supavisor pooling (Port 6543), standard API response envelope, and failure matrix. |
| **Role-Based Access Control (RBAC)** | [`docs/SECURITY.md`](docs/SECURITY.md) | 7-role clearance hierarchy, full permissions matrix, 11:00 AM attendance time-lock state machine. |
| **Autonomous AI Directives** | [`docs/AGENTS.md`](docs/AGENTS.md) | 10 core engineering & hygiene standards, DO/AVOID rules, and pre-release gates. |
| **Relational Database Specification** | [`docs/DATABASE.md`](docs/DATABASE.md) | Supabase PostgreSQL schema, compound unique indexes, and audit log structures. |
| **Design System & Typography** | [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) | Palette tokens (Burgundy `#682038`, Ivory `#FAF7F2`), spacing scale, and UI primitives. |
| **Master Prisma Relational Schema** | [`prisma/schema.prisma`](prisma/schema.prisma) | Canonical 16-model relational schema with enums, constraints, and cascade relations. |

---

## 📄 Formatted Deliverables & Visual Viewers

* **Master Specification PDF (Printable / Client Deliverable):**  
  [`docs/MYSCHOOL_ERP_MASTER_SPECIFICATION.pdf`](docs/MYSCHOOL_ERP_MASTER_SPECIFICATION.pdf)  
  *(Self-contained 6-sheet visual dossier ready for executive handover).*
* **Interactive Documentation Studio (Web Reader):**  
  [`docs/index.html`](docs/index.html)  
  *(Tabbed VS Code-style viewer with progress trackers, search, and responsive cards).*
* **All-in-One Download ZIP:**  
  [`myschool-erp-docs.zip`](myschool-erp-docs.zip)

---

## 🛠️ Technology Stack Overview

* **Framework:** React 19 / Next.js 15+ (App Router, Server Actions, Route Handlers)
* **Authentication:** NextAuth.js (Auth.js v5) with secure Edge JWT session cookies
* **Database:** Managed Cloud PostgreSQL 16+ (Supabase)
* **Connection Pooling:** Supabase Supavisor (Port `6543` in Transaction Mode)
* **ORM:** Prisma ORM (Type-safe migrations via direct Port `5432`)
* **Asynchronous Jobs:** Inngest Headless Queue Worker
* **Document Compilation:** `@react-pdf/renderer` + `jszip`
* **Object Storage:** Supabase Storage (Private S3 Buckets with 60s HMAC pre-signed URLs)
* **Styling & Components:** Tailwind CSS + Radix UI / shadcn/ui

---

## 🚀 How to View Locally

To preview the interactive documentation studio in your browser:
```bash
# On macOS:
open docs/index.html

# Or inspect the compiled PDF dossier:
open docs/MYSCHOOL_ERP_MASTER_SPECIFICATION.pdf
```
