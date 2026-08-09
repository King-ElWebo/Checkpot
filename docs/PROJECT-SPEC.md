# Project Specification

Status: `AWAITING_CUSTOMER_DISCOVERY`

This repository is still the reusable master. For a customer project, copy the structure from `PROJECT-SPEC.template.md`, fill it with confirmed customer information, and set the status to `APPROVED_FOR_DESIGN` before Open Design begins.

## Blocking before design

- Customer discovery has not been completed.
- Required routes are not approved.
- Brand and design direction are not approved.
- Customer-specific content and functionality are not defined.
- Page-level SEO and section-level motion decisions are not approved.
- Deployment, external-service, and Neon provisioning decisions are not recorded.

The technical baseline is already fixed to Neon PostgreSQL with Drizzle ORM. Customer discovery does not select another primary database unless an explicit migration away from the template baseline is approved.
