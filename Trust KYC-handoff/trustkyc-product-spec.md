# TrustKYC — Product Specification

## AI-Powered Customer Onboarding & KYC Document Management Platform

**Version 2.1** | March 2026 | CONFIDENTIAL

---

# 1. Overview

**TrustKYC** is an AI-powered customer onboarding and KYC document management platform designed for financial institutions and document-heavy organizations.

The platform centralizes customer records, document storage, and onboarding workflows while providing intelligent search capabilities across customer data and documents.

TrustKYC solves three major operational problems:

1. Customer onboarding workflow tracking and management
2. KYC document storage and retrieval
3. Missing or expired document detection

The system ensures organizations never request the same customer document twice and can instantly identify onboarding bottlenecks.

---

# 2. Core Objectives

- Digitize and customize customer onboarding workflows
- Centralize customer documents with intelligent search
- Detect missing or expired KYC documents automatically
- Provide AI-powered search across customer records and documents
- Improve operational efficiency and compliance readiness
- Enable flexible workflow configuration per organization and account type
- Support customizable role-based access control tailored to each organization
- Generate signed workflow completion reports for audit and compliance

---

# 3. Target Customers

Primary markets:

- Banks
- Microfinance institutions
- Insurance companies
- Fintech companies
- Real estate agencies
- Immigration and visa processing firms

These industries manage large volumes of customer documents and require strict compliance workflows.

---

# 4. Roles & Permissions

TrustKYC features a customizable role system that allows organizations to define roles tailored to their operational structure. Roles are organized under a fixed Admin role and three configurable role categories, each with a defined set of available permissions.

## 4.1 Role Architecture

The role system has two layers:

> **Admin (fixed, system-level) → Role Categories → Custom Roles → Permissions**

**Admin** is a fixed system role that cannot be modified or deleted. Every organization must have at least one Admin. Admins have full access to all platform features including user management, workflow configuration, role creation, and system settings.

All other roles are created by the Admin under one of three role categories. Each category defines a pool of available permissions, and the Admin selects which permissions to grant when creating a role.

## 4.2 Role Categories

### Operational Roles

Day-to-day onboarding and customer management roles. Permissions in this category cover customer creation, document handling, and workflow stage progression.

**Available permissions:**

- Create and edit customer profiles
- Upload and manage documents
- Move customers forward in workflow stages
- Move customers backward in workflow stages
- View customer records and documents
- View workflow status and stage details

**Default role shipped:**
**Agent** — Create customers, upload documents, move customers forward. Cannot move backward or skip stages.

### Compliance & Audit Roles

Review, approval, and monitoring roles. Permissions in this category cover document review, stage approvals, audit log access, and compliance reporting.

**Available permissions:**

- Review and validate KYC documents
- Approve or reject customers at workflow stages
- Flag customer records for investigation
- Move customers forward in workflow stages
- Move customers backward in workflow stages (with reason)
- View audit and activity logs
- Generate compliance reports

**Default role shipped:**
**Compliance Officer** — Review documents, approve/reject onboarding, move customers forward or backward, view audit logs.

### Supervisory Roles

Management and oversight roles. Permissions in this category sit between Operational and Admin, covering team oversight, transition overrides, and analytics access without system configuration rights.

**Available permissions:**

- View team activity and workload
- Override stage transitions
- Reassign customers between team members
- Skip workflow stages
- Access dashboard analytics
- View audit and activity logs

**Default role shipped:**
**Team Lead** — View team activity, override transitions, reassign customers, access analytics.

## 4.3 Creating Custom Roles

Admins create custom roles through the following process:

- Select a role category (Operational, Compliance & Audit, or Supervisory)
- Name the role (e.g., "KYC Analyst," "Branch Officer," "Senior Reviewer")
- Select permissions from the category's available permission pool
- Save and assign the role to users

Roles can only draw permissions from their own category. An Operational role cannot be granted compliance approval permissions, and vice versa. This enforces separation of duties by design.

## 4.4 User Signature Management

Users who are assigned to roles that validate workflow stages must have a signature image on file. This signature is used in the Workflow Completion Report (see Section 6.6) to produce a signed audit document when onboarding is complete.

### Signature Upload

The Admin uploads a signature image for each user during user creation or profile editing. The signature is stored with the user's profile and is automatically applied to any workflow stage they validate.

**Accepted formats:**

- PNG with transparent background (recommended for clean rendering in PDF reports)
- JPG with white background (acceptable alternative)

### Signature Requirements

- Signature image is required for any user assigned to a role that includes stage approval or validation permissions
- The system prevents assigning a user as a stage validator if no signature is on file
- Admins can update a user's signature image at any time; updated signatures apply to future validations only
- Signature images are stored securely and are not accessible outside of workflow completion reports

### Future Enhancement

*Drawn signature capture: users sign directly in the application via a signature pad at the point of stage approval, replacing the uploaded image approach.*

## 4.5 Default Roles Summary

| Category | Default Role | Included Permissions |
|---|---|---|
| System | Admin | Full access (fixed, non-configurable) |
| Operational | Agent | Create customers, upload docs, forward transitions, view records |
| Compliance | Compliance Officer | Review docs, approve/reject, forward/backward transitions, audit logs |
| Supervisory | Team Lead | Team activity, override transitions, reassign, analytics, audit logs |

## 4.6 Design Principles

- Flat permissions model for v1 — no role inheritance or hierarchy within categories
- Default roles ship out of the box so organizations can start immediately
- Permissions are explicit — each role has exactly the permissions selected by the Admin
- Category boundaries enforce separation of duties without complex policy rules
- Signature images uploaded per user enable signed completion reports without per-approval capture flows
- Future: Role hierarchy and permission inheritance within categories

---

# 5. Customer Management

## 5.1 Customer Profile Fields

| Field | Description |
|---|---|
| First Name | Customer first name |
| Last Name | Customer last name |
| Date of Birth | Customer date of birth |
| Phone Number | Primary contact number |
| Email | Email address |
| Address | Physical address |
| Nationality | Customer nationality |
| Account Type | Type of account being opened |
| Onboarding Stage | Current stage in the assigned workflow |
| Created At | Record creation timestamp |
| Updated At | Last update timestamp |

## 5.2 Profile Sections

- Customer Info
- Document Archive
- Workflow Progress
- Activity History

---

# 6. Workflow Engine

TrustKYC features a configurable workflow engine that allows organizations to define custom onboarding workflows. This is a core feature that ensures the platform adapts to each organization's unique processes rather than forcing a one-size-fits-all approach.

## 6.1 Workflow Builder

Admins can create, edit, and manage onboarding workflows through a dedicated workflow builder interface.

### Workflow Definition

Each workflow consists of:

- A unique workflow name and description
- An ordered sequence of stages
- Required documents per stage
- Role-based permissions for stage transitions (using custom roles)
- Transition rules (forward, backward, skip)
- Validation signature requirements per stage

## 6.2 Stage Configuration

Each stage within a workflow is fully configurable:

| Property | Description |
|---|---|
| Stage Name | Display name of the stage (e.g., "Documents Submitted") |
| Stage Order | Position in the workflow sequence |
| Required Documents | Documents that must be uploaded before the customer can exit this stage |
| Assigned Role | Which custom role is responsible for actions at this stage |
| Allow Forward | Whether customers can be moved to the next stage |
| Allow Backward | Whether customers can be moved to a previous stage |
| Allow Skip | Whether this stage can be skipped entirely |
| Skip Conditions | Optional conditions under which skipping is permitted |
| Auto-Advance | Whether the system automatically advances the customer when all stage requirements are met |
| Requires Signature | Whether stage validation is included in the workflow completion report with the validator's signature |

## 6.3 Stage Transitions

TrustKYC supports flexible stage transitions to accommodate real-world onboarding scenarios:

### Forward Transitions

Customers move to the next stage when all requirements for the current stage are satisfied. This is the standard progression through the workflow.

### Backward Transitions

Customers can be moved back to a previous stage when issues are discovered. For example, if a compliance officer finds a problem during review, they can send the customer back to the document submission stage. Backward transitions are logged with a reason.

### Stage Skipping

Certain stages can be configured as skippable. An admin defines which stages allow skipping and under what conditions. For example, an existing customer opening a second account may skip the initial document collection stage if their documents are already on file.

### Transition Permissions

Stage transition permissions are tied to the custom role system. When configuring a workflow stage, the Admin assigns which roles can perform each transition type. For example:

- Agents (Operational) may only move customers forward
- Compliance Officers (Compliance & Audit) may move customers forward or backward
- Team Leads (Supervisory) can override transitions and skip stages

*All transitions are recorded in the activity log with the user, their role, timestamp, source stage, target stage, and reason.*

## 6.4 Workflow-to-Account-Type Mapping

Different account types within the same organization can use different workflows. The relationship is:

> **Account Type → Workflow → Stages → Required Documents + Assigned Roles per Stage**

For example, a bank might configure:

- Savings Account → Basic Onboarding (3 stages)
- Business Account → Extended Onboarding (7 stages)
- Loan Application → Loan Workflow (5 stages with credit check)

## 6.5 Default Workflow Templates

TrustKYC ships with pre-built workflow templates to accelerate onboarding. Organizations can use them as-is or customize them.

### Template: Basic Individual Account

1. Application Received
2. Documents Submitted
3. KYC Verification
4. Account Approved

### Template: Business Account

1. Application Received
2. Business Documents Submitted
3. Beneficial Ownership Verified
4. KYC Verification
5. Compliance Review
6. Account Approved

### Template: Enhanced Due Diligence

1. Application Received
2. Documents Submitted
3. KYC Verification
4. Enhanced Due Diligence Review
5. Senior Compliance Approval
6. Account Approved

## 6.6 Workflow Completion Report

When a customer's onboarding workflow reaches its final stage and is approved, TrustKYC generates a PDF completion report. This report serves as the official signed record of the onboarding process for audit, compliance, and regulatory purposes.

### Report Generation

- Report is generated automatically when the final workflow stage is approved
- Report is only available for completed workflows — in-progress workflows cannot generate a report
- The report is stored with the customer's profile and can be downloaded or reprinted at any time
- Each report includes the organization's branding (logo and name)

### Report Contents

The PDF report contains the following sections:

1. **Header** — Organization logo, name, and report title
2. **Customer Information** — Full customer profile details (name, date of birth, nationality, account type, etc.)
3. **Document Summary** — List of all documents on file with upload date, expiration date, and status
4. **Validation Table** — One row per workflow stage that has the "Requires Signature" property enabled, showing stage name, validator name, role, employee ID, date of approval, and the validator's signature image
5. **Footer** — Report generation timestamp and unique report reference number

### Validation Table Structure

The validation table is the core of the completion report. It provides a clear audit trail of who approved each stage of the onboarding process:

| Stage | Name | Role | Emp. ID | Date | Signature |
|---|---|---|---|---|---|
| KYC Verification | Abdoulaye Fall | Rel. Manager | SN0415 | 2026-03-20 | *[signature]* |
| Compliance Review | Rokhaya Faye | Bus. Manager | SN0218 | 2026-03-21 | *[signature]* |
| Account Approved | Mame Diop | BOM | SN0256 | 2026-03-22 | *[signature]* |

*In the generated PDF, the [signature] column renders the validator's uploaded signature image, scaled to fit the table cell. PNG images with transparent backgrounds are recommended for the cleanest rendering.*

### Report Customization

- Admins control which stages appear in the validation table via the "Requires Signature" stage property
- Stages without the signature requirement (e.g., initial application entry by an agent) are excluded from the validation table
- The report template can include the organization's custom branding (logo, colors, header text)
- Future: Configurable report templates allowing organizations to add custom fields or sections

### Report Access & Storage

- Completed reports are stored as PDF files linked to the customer's profile
- Reports can be downloaded by users with appropriate permissions
- Reports are immutable once generated — if a correction is needed, a new workflow must be initiated
- Report generation is logged in the activity log for audit purposes

---

# 7. Document Management

## 7.1 Supported Documents

- Passport
- National ID
- Proof of Address
- Residence Permit
- Contracts
- Business Registration Documents
- Other (custom document types configurable by Admin)

## 7.2 Upload Methods

- Manual upload via file browser
- Drag and drop
- Future: WhatsApp document upload
- Future: Customer self-upload portal

## 7.3 Stored Metadata

| Field | Description |
|---|---|
| Document Type | Category of the document |
| Upload Date | When the document was uploaded |
| Expiration Date | When the document expires |
| Uploaded By | User who uploaded the document |
| Extracted Text (OCR) | Text content extracted from the document |
| Associated Stage | Which workflow stage this document was uploaded for |

## 7.4 Document Viewer

Users can:

- Preview documents inline
- View extracted text from OCR
- View upload history
- View expiration alerts

---

# 8. Missing Document Detection

Each workflow stage defines its required documents. TrustKYC automatically compares uploaded documents against stage requirements and flags missing items.

> ⚠ Missing: Proof of Address (required at Stage 2: Documents Submitted)
> ⚠ Passport expired — renewal required before Stage 3: KYC Verification

---

# 9. Expiration Monitoring

The system continuously monitors document expiration dates and generates alerts:

- Expired documents flagged immediately
- Documents expiring within 30 days trigger advance warnings
- Expiring documents can block stage transitions if configured

---

# 10. AI Search System

## 10.1 Natural Language Queries

Users can type natural language queries to search across customers and documents:

- "missing passports" — returns customers missing passport documents
- "customers waiting compliance" — returns customers stuck at compliance stage
- "expired IDs" — returns customers with expired ID documents
- "John Doe passport" — retrieves specific customer documents

## 10.2 Hybrid Search Architecture

### Structured Query Layer

Operational queries are converted to SQL. Example: "Show accounts stuck in compliance" becomes a database query filtering by workflow stage.

### Document Semantic Search

Document content queries use vector search. The pipeline: Document Upload → OCR Text Extraction → Text Stored in Database → Embedding Generated → Vector Search Enabled.

---

# 11. Dashboard

## 11.1 Key Metrics

- Total customers
- Customers in onboarding (by workflow stage)
- Accounts waiting for documents
- Accounts stuck in workflow (no progress in X days)
- Expiring documents (upcoming 30 days)
- Workflow completion rates
- Average onboarding time per workflow

## 11.2 Customer List

Table view displaying: Name, Account Type, Assigned Workflow, Current Stage, Missing Documents, and Last Update.

Filters: Onboarding stage, account type, workflow, missing documents.

---

# 12. Activity Logs

All actions are recorded for compliance and audit purposes:

- User performing the action and their role
- Action type (document upload, stage transition, approval, rejection, role change, report generation, etc.)
- Customer affected
- Timestamp
- For stage transitions: source stage, target stage, direction, and reason

---

# 13. Security

- Customizable role-based access control with category-enforced separation of duties
- Encrypted document storage
- Secure signature image storage with restricted access
- Immutable workflow completion reports
- Comprehensive audit logs
- Access history tracking
- Secure file storage

**Future:**

- SOC2 compliance
- Data residency options

---

# 14. Technical Architecture

| Component | Technology |
|---|---|
| Frontend | Next.js (App Router, file-system routing, Tailwind CSS) |
| API Layer | Next.js Route Handlers + tRPC (end-to-end type safety, single codebase) |
| ORM | Drizzle ORM |
| Primary Database | PostgreSQL |
| Client State | Zustand (shared mutable state across routes) |
| Data Fetching | tRPC queries + mutations (replaces REST/GraphQL client) |
| File Storage | S3-compatible object storage (Cloudflare R2 recommended) |
| Vector Search | pgvector |
| OCR | Tesseract OCR (optional cloud OCR services) |
| PDF Generation | Server-side PDF rendering for workflow completion reports |
| Background Jobs | Inngest (OCR processing, PDF generation, expiry monitoring) |

## 14.1 Routing Structure

```
app/dashboard/
  layout.tsx                  ← shell (sidebar + header, shared across all routes)
  page.tsx                    ← /dashboard — overview & KPIs
  customers/
    page.tsx                  ← /dashboard/customers — customer list
    [id]/page.tsx             ← /dashboard/customers/:id — customer profile
  pipeline/page.tsx           ← /dashboard/pipeline — kanban + table view
  documents/page.tsx          ← /dashboard/documents — global document archive
  activity/page.tsx           ← /dashboard/activity — audit log
  workflows/
    page.tsx                  ← /dashboard/workflows — workflow list
    [id]/page.tsx             ← /dashboard/workflows/:id — workflow builder
  team/page.tsx               ← /dashboard/team — team management
  settings/page.tsx           ← /dashboard/settings
```

All routes share the sidebar and header shell via `layout.tsx`. Page transitions animate on route change via a `PageTransition` client component wrapping `children`.

---

# 15. Future Features

## 15.1 Fraud Detection

Detect suspicious identity patterns:

- Duplicate passport numbers across customers
- Same phone number used by multiple customers
- Multiple accounts sharing the same address

## 15.2 Customer Self-Upload Portal

Customers upload documents via a secure link. Documents are automatically processed through OCR and attached to their profile.

## 15.3 WhatsApp Document Integration

Customers send documents via WhatsApp. The system receives, processes, and attaches them to the customer profile automatically.

## 15.4 TrustKYC Verify

Identity verification module: ID validation, selfie verification, and document authenticity checks.

## 15.5 TrustKYC Intelligence

Compliance and fraud monitoring module: duplicate identity detection, suspicious pattern alerts, and regulatory reporting.

## 15.6 TrustKYC Portal

Customer-facing onboarding portal: document uploads, onboarding progress tracking, and notifications.

## 15.7 Role Hierarchy & Inheritance

Future enhancement to the role system: allow roles within a category to inherit permissions from other roles in the same category. For example, a "Senior KYC Analyst" could inherit all permissions from "KYC Analyst" plus additional review capabilities.

## 15.8 Drawn Signature Capture

Replace uploaded signature images with real-time signature capture. Users sign directly in the application via a signature pad at the point of stage approval. Captured signatures are timestamped and linked to the specific approval action for enhanced auditability.

## 15.9 Configurable Report Templates

Allow organizations to customize the workflow completion report layout, add custom fields, custom sections, and adjust branding beyond the default template.

---

# 16. Business Model

SaaS pricing model:

| Tier | Price | Details |
|---|---|---|
| Starter | $99/month | Up to 10 users, default roles only, basic workflows, completion reports |
| Growth | $299/month | Up to 50 users, custom roles, custom workflows, branded reports, priority support |
| Enterprise | Custom | Unlimited users, full role customization, custom report templates, advanced security, integrations, SLA |

---

# 17. Vision

TrustKYC aims to become the **customer identity infrastructure platform for African financial institutions**, simplifying KYC, onboarding, and compliance through intelligent document management, flexible workflow automation, customizable role-based access control, and AI-powered insights.
