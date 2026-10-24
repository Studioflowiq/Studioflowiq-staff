# Activation preparation — 19 October 2026

Production activation is NOT completed. No live payment settings, user permissions, accounts, or production records were changed.

## Implemented native dashboard step
The Staff home screen now exposes the existing portal overview concepts: active members, confirmed bookings/waitlist count, today's attendance and this month's recorded Paid payment revenue. Financial totals require view_payments; navigating to reports separately requires view_reports. Member counts require view_members. Scheduling totals require view_schedule. Cards and shortcuts use existing native screens and existing server permissions; no new role grants or backend rules.

Shortcuts: add member, create class, checkout, reports/reconciliation, membership plans and workspace. Member app screens are unchanged; shared source includes the Staff-only component.

Validation: both native variants passed TypeScript and 20/20 unit checks. Five additional checks cover permission isolation and date/status aggregation, including refunds/pending/prior-month exclusion. No native simulator or physical iPhone rendering/click-through was executed. This source is not yet distributed as a new TestFlight build.

## Portal-to-native inventory (source inspection; not workflow PASS)
| Existing portal area | Native location / gap |
| --- | --- |
| Overview | Expanded Staff Today overview in this change |
| Schedule | Schedule, class editor and roster |
| Members | Members, profile and editor |
| Memberships | Workspace membership catalog; complete billing lifecycle still unverified |
| Team | Workspace instructor catalog |
| Front desk | Roster check-in, scanner and member checkout |
| Reconciliation | Reports and roster controls; complete parity not verified |
| Staff access | Staff accounts and invitations |
| Retail | Workspace catalog and checkout |
| Commissions | Workspace commissions |
| Payments | Checkout/refunds; manual record/payment history parity needs review |
| Payments & billing | Member billing exists; full owner billing administration not verified |
| Marketing | Missing native campaign workspace |
| Reports | Native reports; full report/export parity not verified |
| Insights | Missing native insights workspace |
| Integrations | Missing native owner connection/settings workspace |
| Settings | Announcement exists; full studio settings are missing |
| Submit a ticket | Native support |

Owner, Manager, Coach and Front Desk continue to be supported. Server permissions remain the authority, including custom permissions and assigned-class limits. Do not substitute role-name shortcuts for those permissions.

## Activation blockers
1. Finish missing owner portal functionality and validate each role's actual journeys against production business rules.
2. Promote reviewed backend corrections through the supported production source/deployment process; sandbox-only fixes do not change production.
3. Verify production payment configuration and renewal/reconciliation lifecycle without unauthorized real charges. Sandbox monthly simulation has no verified subscription ID or renewals.
4. Complete device photo retest, notifications, accessibility/performance, release disclosures and remaining previously reported security/compliance issues.
5. Build and distribute production-origin candidates, verify sign-in for real studio accounts and independently approve each app for activation. Do not remove sandbox labels from a sandbox-origin binary.

Current assessment: Member NO-GO, Staff NO-GO for public launch. TestFlight source/build distribution and public App Store release are separate milestones.
