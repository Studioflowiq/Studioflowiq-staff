# StudioFlowIQ — native implementation and release status

Updated 19 October 2026. Member and Staff release decisions remain independent.

## Decision

**Members: NO-GO for App Store review. Staff: NO-GO for App Store review.** Native core screens and API integrations are implemented for the workflows listed below; full feature parity and physical-device acceptance remain outstanding. No real charge, refund, subscription cancellation or account deletion was performed by this development run. No App Store review submission is authorized.

## Implemented in source

Both apps now use React Native screens for their core workflows, with a shared charcoal/teal design system, automatic Dark Mode, native modal sheets, accessible controls, haptics, larger touch targets, reduced-motion handling, keyboard dismissal, and lifecycle refresh. The previous full-portal WebView has been removed. A narrowly scoped WebView remains for Square's secure card fields.

Members: secure private-link access, profile/address/emergency-contact/date-of-birth editing, photo capture/upload, native schedules and class details, booking/cancellation/waitlist status, reservation history, class-credit summary, native QR pass, memberships/classes/retail shopping, billing history, renewal cancellation requests, opt-in booking/waitlist push registration, studio announcements, support correspondence, and account-deletion requests.

Staff: secure password sign-in/setup/recovery, role-filtered native schedule and roster, member names/check-in/no-show/cancellation/presence management, member lookup/profile editing/photo capture, native QR scanning, class creation/editing with native date/time selection, instructor/catalog/membership management, retail/membership checkout including sample and free-class flows, payment refund controls, reports, staff shifts/time punches, commission tracking/settings, staff invitations/reset/disable, studio announcements and support correspondence with immutable studio identification.

Backend: native bearer sessions reuse the existing opaque session database and tenant/role enforcement; no client-selected role grants access. Member tickets are isolated by authenticated member identity. Member checkout derives pricing and receiving account from server records and uses idempotent checkout IDs. Refunds enforce owner/manager permission and verify the original processor payment, merchant and available amount. Subscription cancellation is restricted to the member's own recurring purchase. Password recovery uses generic responses, rate limits and expiring single-use links. Deletion requests are queued and create support tickets; submitting the request does not itself erase records or cancel billing.

Push: opt-in Expo token registration and member booking/waitlist notification dispatch are implemented. Provider acceptance is tracked separately from delivery. Push-enabled distribution provisioning was verified; no APNs sending key is bound in Expo and physical-device delivery remains unverified. App data refreshes on foreground and every 30 seconds while active; this is polling, not a realtime socket. Staff operational push coverage is not complete.

Release assets: distinct existing bundle/Expo/App Store identities retained; 1024×1024 opaque icons with SVG masters; camera/photo permission purpose text; secure device credential storage; support/privacy pages and store metadata drafts. No tracking permission or microphone access is requested. iPhone layout is the supported target.

## Executed checks

- Native TypeScript and native API/domain/URL/identity unit tests executed in both checkouts.
- iOS Hermes exports executed for both variants. A Hermes export is not a signed IPA or device test.
- Shared backend TypeScript and regression tests executed, including actual route handlers with local SQL fixtures and mocked external providers.
- Security tests verify every staff role retains its server tenant/role, malformed/expired/disabled sessions fail, wrong origins fail, member ticket isolation, catalog-priced checkout, retry idempotency, refund permissions/limits, and ownership of renewal cancellation.
- The previous roster checkout hook mock was fixed; the covered roster checkout tests now execute successfully.
- Config introspection confirms secure storage/camera plugins and APNs entitlement generation. Both signed candidates now have matching push-enabled provisioning.
- No production database records were changed by tests. Production provider requests were not exercised.

## Workflow acceptance evidence

PASS below is limited to the executed scope in the evidence column. No device journey is inferred from source presence.

| Workflow | Members | Staff | Evidence / limit |
|---|---|---|---|
| Auth, expiry and tenant/role isolation | NOT TESTED end to end | NOT TESTED end to end | Hosted login and role/tenant checks PASS for all four roles across two studios; native device sign-in NOT TESTED |
| Onboarding/profile/photo editing | NOT TESTED | NOT TESTED | Requires signed app on iPhone and authorized test accounts |
| Schedule, booking and cancellation | NOT TESTED | NOT TESTED | Hosted API booking/cancellation and cross-client data consistency PASS; native device interactions NOT TESTED |
| Capacity, balances, waitlist promotion | NOT TESTED | NOT TESTED | Hosted API waitlist promotion and class-pack reservation hold/release PASS; native device and purchased-credit journeys NOT TESTED |
| QR generation/scanning/check-in | NOT TESTED | NOT TESTED | QR parser unit tests PASS; camera/device journey outstanding |
| Payment card tokenization, purchase, decline, retry | NOT TESTED | NOT TESTED | Local server price/idempotency tests PASS with provider mocks; direct Square sandbox payment/card tests PASS (see checkpoint); app tokenization/journey NOT TESTED |
| Refunds and recurring cancellation | NOT TESTED | NOT TESTED | Local ownership/role/amount tests PASS; direct Square sandbox refund/payment reconciliation PASS; app/backend webhook reconciliation and recurring cancellation NOT TESTED |
| Retail POS and reporting | NOT TESTED | NOT TESTED | No processor-backed POS transaction executed |
| Support correspondence across apps/studios | NOT TESTED | NOT TESTED | Hosted member creation, manager response and member thread visibility PASS; cross-member/studio denial PASS; native interaction NOT TESTED |
| Push receipt, denied permission, foreground/background | NOT TESTED | NOT TESTED | Registration/dispatch implemented; no APNs sending key bound and no device receipt |
| Account deletion | NOT TESTED | NOT TESTED | Request queue implemented; actual processing/retention acceptance outstanding |
| Offline, slow network, accessibility and performance | NOT TESTED | NOT TESTED | Physical-device measurements and recordings unavailable |

## Required acceptance before GO

| Priority | Requirement | Status |
|---|---|---|
| P0 release gate | New signed builds install and run on an iPhone | NOT TESTED |
| P0 release gate | Square sandbox tokenization, purchase/decline/retry/refund/renewal reconciliation | NOT TESTED; mocked-provider checks do not establish this |
| P0 release gate | Complete scenarios A–E on Member and all Staff roles across two studios | NOT TESTED on devices |
| P1 | Dependency advisory remediation/reachability review | FAIL: 16 high and 7 moderate propagated package findings; evidence attached |
| P1 | APNs sending credential and actual push delivery including disabled permissions | NOT CONFIGURED / NOT TESTED; provisioning repaired |
| P1 | VoiceOver, 200% Dynamic Type, small/large iPhone layouts, photo/camera denial and back gestures | NOT TESTED on devices |
| P1 | Cold/warm launch, memory, crash, slow/offline network and background recovery measurements | NOT TESTED on devices |
| P1 | Account-deletion processing/retention operations and privacy disclosures reviewed for actual release | REQUEST FLOW IMPLEMENTED; operational/legal acceptance outstanding |
| P1 | Staff operational push alerts, detailed staff permission editing and full commission-rule parity | PARTIAL; existing server enforcement remains authoritative |
| P1 | Final App Store metadata/privacy labels, legal entity, review credentials and real-device screenshots/recordings | DRAFT / OUTSTANDING |

## Validation limits

The runtime is Linux and has no connected iPhone/Xcode simulator. No physical-device screenshot or screen recording can be supplied truthfully. Public API requests from the shell received text/plain 403 responses that cannot be attributed confidently to application authentication. Current source checks therefore use local fixtures, and signed cloud builds must be inspected independently.

## Submission boundary

Do not submit either app for Apple review until its own signed candidate, sandbox/provider journeys, device recordings and App Store disclosures are accepted. Keep Member and Staff release approvals separate. Privacy/support URLs are https://studioflowiq.com/privacy and https://studioflowiq.com/support once the backend deployment succeeds. App Review reference: https://developer.apple.com/app-store/review/guidelines/ .

### Final local check counts

Native unit tests: 12/12 in each variant checkout. Shared backend regression run: 101/101 passed. Both native TypeScript checks and the shared backend TypeScript check passed. iOS Hermes exports passed for both variants; the final cart-idempotency UI adjustment was re-exported after its change. These results do not replace the device/provider acceptance gates above.

## Cloud build verification — initial attempts and remediation

Backend version 96 was successfully deployed from source 8d4f2fe433465c715468c26479359f419e474884.

- Staff candidate: 1.0.0 (5), source a61669cce75112c0c6f19080217d743d42167117, build https://expo.dev/accounts/studioflowiq-team/projects/studioflowiq-staff/builds/95396642-3417-4cfc-8752-c19d511518ee .
- Member candidate: 1.0.0 (3), source e46bc42ece019b6a85889b2cad47c71147324b41, build https://expo.dev/accounts/studioflowiq-team/projects/studioflowiq-membersstudioflowiq-members/builds/8935fac4-efe3-4563-8395-a2f605ae5756 .

Both cloud builds installed dependencies, prebuilt native projects, installed CocoaPods and bundled JavaScript, then FAILED at Xcode signing. At that point, each existing TestFlight provisioning profile lacked Push Notifications capability and the aps-environment entitlement; the subsequent repair is recorded below. Neither produced a new signed IPA or TestFlight upload. Auto-submit was disabled.

Remediation: authenticate to the existing Apple Developer team, enable/verify Push Notifications on the existing identifiers, regenerate the corresponding distribution provisioning profiles with the existing certificates, update the existing Expo credential bindings, then rebuild these source commits. APNs sending credentials and physical-device delivery also need verification. Do not remove the entitlement merely to mask the missing push configuration.

### Provisioning repair checkpoint

Apple Developer portal authentication was verified on team UCLH3R22ZQ. Push Notifications was enabled on the existing Staff and Members identifiers. Both existing App Store profiles were regenerated with existing distribution certificate 23NS2566R3, without creating or revoking certificates. CMS verification succeeded, and each profile includes aps-environment=production and its correct application identifier.

- Staff profile UUID: bc8440a4-717e-417c-bf38-3bc0b17fe166; uploaded and visibly saved in existing Expo bundle configuration.
- Members profile UUID: 807f94ef-fa2b-4041-be07-bdbf086deab1; uploaded and visibly saved in existing Expo bundle configuration.
- Staff rebuild: 1.0.0 (6), build 5d90dc89-bfa5-4511-9163-e1607caa4eb3, exact source a61669cce75112c0c6f19080217d743d42167117.
- Members rebuild: build a651072c-8eb5-44cc-af9a-900a06d3cafc, exact source e46bc42ece019b6a85889b2cad47c71147324b41.
- Automatic EAS Submit remains OFF. Neither app has been submitted for Apple review.

Expo credential pages showed no APNs push sending key configured for either app. Provisioning supports push; end-to-end delivery is still NOT TESTED and is not established by a successful build.


### Dependency compatibility correction

The first successful signed Staff 1.0.0 (6) and Members 1.0.0 (4) archives proved the provisioning repair. Expo Doctor still reported 20/21 checks because Expo 57.0.27, expo-notifications 57.0.22 and TypeScript 5.9.3 differed from its supported versions. These were updated to Expo 57.0.30, expo-notifications 57.0.23 and TypeScript 6.0.3 with the lockfile refreshed. Both variant TypeScript checks and 12/12 tests passed again, and both new iOS Hermes exports passed (816 modules, 2 MB). Local `expo install --check` reported dependencies up to date.

Updated candidate sources: Staff 190d59ade60bae62671eef84e9f4aff0cc14c417; Members 64e36a5d3be0ebe3e0b05d8f22c0c9a59761a025. Their new cloud builds are ee900f8e-86a2-462e-936e-0cd57a5d59b9 and 28d64a29-7bff-446c-ba57-b0014da2ac68 respectively. Both cloud Expo Doctor runs passed 21/21 checks; both signed-build outcomes are recorded below.


### Performance evidence boundary

No cold/warm launch duration, frame-rate, memory/leak, crash-rate, cellular-latency or battery baseline was measured. API timeouts, lifecycle refresh, private-screen overlays and native controls were implemented, but no quantified performance improvement is claimed. Native back gestures, transition quality, Dynamic Type, VoiceOver and visual quality remain device acceptance items.


### App Review policy checkpoint

Apple's current App Review Guidelines were checked on 19 October 2026 (https://developer.apple.com/app-store/review/guidelines/). Sections 4.2 and 4.2.2 require useful app behavior beyond a repackaged website; implemented native screens reduce that risk, but device acceptance is still required. Section 3.1.3(e) permits non-IAP payment for physical goods and services consumed outside the app. In-person studio classes and physical retail appear to fit that category; this is an inference, and the actual release catalog must be reviewed. Digital content or group services consumed within the app require separate classification. Section 5.1.1(v) requires in-app account deletion when account creation is supported. A queued request alone does not establish completed deletion processing or compliant retention handling; this remains a submission blocker.

`npm audit --omit=dev --json` completed with exit 1: 23 affected-package findings (16 high, 7 moderate, 0 critical), propagated from three advisory roots. Full evidence is saved in `docs/native-dependency-audit.json`. Dependency-security acceptance is FAIL for both candidates pending remediation or documented reachability/risk review. The affected paths mainly involve Expo CLI, Metro and Xcode project tooling; runtime exploitability has not been established or ruled out.

| Priority | Advisory root | Finding | Disposition |
|---|---|---|---|
| P1 | braces <=3.0.3; GHSA-vfj7-8cjw-p6xm | Deeply nested patterns can exhaust the Node stack | No compatible patched release verified; build-input exposure/reachability review outstanding |
| P1 | node-forge <=1.4.0; GHSA-86w9-cpqp-85rv | RSA signature-verification validation flaw | No compatible patched release verified; signing-tool reachability review outstanding |
| P1 | uuid <11.1.1; GHSA-w5hq-g745-h8pq | Buffer bounds checks in v3/v5/v6 | Transitive Xcode dependency; compatible upgrade or usage review outstanding |

Automatic force-fixes were not applied: npm proposed incompatible Expo 44 / React Native 0.72 downgrades. The current SDK-compatible candidates remain available for controlled device testing, but this security gate remains open.


## Final signed candidate checkpoint

| App | Candidate | Source | Signed IPA | Expo Doctor | App Store recommendation |
|---|---|---|---|---|---|
| Staff | 1.0.0 (7) | 190d59ade60bae62671eef84e9f4aff0cc14c417 | PASS — cloud archive/sign/export succeeded, 4m 29s build time | PASS — 21/21 | NO-GO |
| Members | 1.0.0 (5) | 64e36a5d3be0ebe3e0b05d8f22c0c9a59761a025 | PASS — cloud archive/sign/export succeeded, 4m 26s build time | PASS — 21/21 | NO-GO |

Verified build detail pages:
- Staff: https://expo.dev/accounts/studioflowiq-team/projects/studioflowiq-staff/builds/ee900f8e-86a2-462e-936e-0cd57a5d59b9
- Members: https://expo.dev/accounts/studioflowiq-team/projects/studioflowiq-membersstudioflowiq-members/builds/28d64a29-7bff-446c-ba57-b0014da2ac68

Successful signed packaging does not establish successful app execution. Neither final candidate has been installed on a physical iPhone, uploaded to TestFlight, or submitted for Apple review by this run. Automatic submission was OFF for every new build. Documentation-only commits after the candidate sources do not change their application code.

Outstanding requirements: authorized non-production member/staff accounts across two studios and all four staff roles; isolated sandbox backend configuration and safe provider-webhook test access (Square Developer Console sandbox access is now verified); a connected iPhone or tester-provided executed evidence/recordings; APNs sending-key setup; deletion/retention operations and privacy-disclosure decisions; staff feature-parity completion; dependency advisory remediation or documented security disposition; final independent review and release approval for each app. No real payments, account deletions, or production membership changes were performed by the automated tests.


## Sandbox and regression checkpoint — 19 October 2026

**Members: NO-GO for App Store review. Staff: NO-GO for App Store review.** These provider checks do not change the device/workflow release decision. TestFlight distribution is authorized after the required testing passes; neither candidate was uploaded in this checkpoint.

### Regression corrections and results

The final complete `node scripts/verify-platform.mjs` run passed **36/36 check groups** (34 test files, website TypeScript, mobile invitation/navigation). This count is groups, not individual assertions. Native TypeScript and **12/12 tests in each variant** passed again. Provider calls in the regression suite remain mocked.

Eight legacy fixture files were corrected. A shared SQLite/D1 fixture adapter now lazily prepares statements, supports unbound statement execution, preserves immutable bound statements and executes batches transactionally. Runtime mocks now provide Cloudflare Workers, Next headers and Headers. Booking fixtures respect current inclusive cancellation cutoffs, billing windows and one-class-per-day rules. Sample fixtures seed fictional in-memory records instead of invoking the prohibited real-workspace demo reset. Credit and free-class cases now select the correct plan, use current catalog pricing and verify duplicate checkout rejection without adding an order. No production business logic was changed to make these tests pass.

Fixture corrections are pushed at backend source **31061ee75b39919b88ddb98989c169a3b8ca1d62**, saved as version **97** without deployment. Production remains version 96. The test-only source checkpoint does not require native rebuilds.

### Actual Square Sandbox execution

Executed through Square API Explorer using the existing StudioFlowIQ application's Default Test Account sandbox token, API version **2026-09-16**, on 19 October 2026. Requests used `connect.squareupsandbox.com`. No production token, real card, real customer information or real charge was used. This is direct provider testing, not an executed journey through either native app or the StudioFlowIQ backend. Developer Console token success does not prove studio OAuth grants contain the required scopes.

Sandbox location **L5A2NZBW9GJAM**, merchant **MLJN6QPM1FCYP**, was ACTIVE, USD and enabled for credit card processing.

| Provider check | Result | Executed evidence |
|---|---|---|
| Authenticated location lookup | PASS | HTTP 200; active USD card-processing location |
| Simulated $1 card payment | PASS | HTTP 200; payment am1Uivn16bZTkmmHfIPrsNWpxFOZY; COMPLETED/CAPTURED; amount 100 USD cents |
| Identical payment replay | PASS | HTTP 200; identical payment ID and original creation time; no second payment ID |
| Declined test card | PASS | HTTP 400; GENERIC_DECLINE; payment oLux4E4uXUUJr5FZmD0XB8MhQvVZY FAILED, approved amount 0 |
| Invalid CVV | PASS | HTTP 400; CVV_FAILURE; payment QnWf0fpriVibONda19dUGVEbxSCZY FAILED |
| Invalid expiration | PASS | HTTP 400; INVALID_EXPIRATION; payment 2y69ZnYSIfM9eoZALc8S1k2m5uWZY FAILED |
| Reused test nonce | PASS | HTTP 400; CARD_TOKEN_USED |
| Full simulated refund | PASS | HTTP 200; initially PENDING, subsequently COMPLETED; refund am1Uivn16bZTkmmHfIPrsNWpxFOZY_ElNCRY03SZsGAJGOMeEbk3uMEA8mbCAMxGmM5O7xe0G |
| Refund replay | PASS | Same refund ID; COMPLETED |
| Refund above remaining balance | PASS | HTTP 400; REFUND_AMOUNT_INVALID; requested refund exceeds available amount |
| Payment/refund provider reconciliation | PASS | GET payment HTTP 200; refunded_money 100 USD cents; matching refund ID on original payment |
| Fictional customer creation | PASS | HTTP 200; customer RWCT110MREFC7HXTQTZ52HW10C, StudioFlowIQ Sandbox QA; no real contact details |
| Simulated card storage | PASS | HTTP 200; enabled VISA ending 5858 attached to the fictional customer |
| Card creation replay | NOT TESTED | Browser request timed out after invocation; outcome not observed, no success inferred |

The saved screenshot `studioflowiq-square-sandbox-refund.jpg` shows HTTP 200 and the completed refund. No secret token is included in the screenshot or this report.

### Remaining sandbox/device blockers

| Priority | Requirement | Status and next dependency |
|---|---|---|
| P0 release gate | Native apps → isolated backend → Square → webhook reconciliation | NOT TESTED. Only the production backend was available; native candidates point to studioflowiq.com. A separate non-production backend, sandbox configuration and fictional accounts across two studios are needed. Production payment configuration was not switched. |
| P0 release gate | Hosted checkout, recurring billing/renewals, failed renewal recovery, receipts and app balances | NOT TESTED with the provider. Direct payment tests do not verify hosted checkout or subscriptions. |
| P0 release gate | Scenarios A–E, all four Staff roles, member/studio isolation across devices | NOT TESTED end to end. Handler/fixture coverage is recorded separately. |
| P1 | Square Web Payments SDK native frame entry/tokenization, card update, permission and SCA failures | NOT TESTED. Passing a test nonce to Cards API is not SDK tokenization proof. |
| P1 | APNs credentials and actual delivery, iPhone accessibility/performance and recordings | NOT TESTED / outstanding; no connected iPhone is available in this environment. |

Account-deletion operations, dependency advisories, incomplete staff feature parity and App Store disclosures remain open as described above. No real financial transaction or production record mutation was performed by these tests.


## Isolated hosted QA checkpoint — 19 October 2026

A separate owner-private backend was deployed at https://studioflowiq-sandbox.fiitlyfe2021.chatgpt.site from source a7abbccda5bb7b708fda18e0ae82ee7d81052092. It has a separate D1 database and R2 storage, a new payment-encryption key, no production Square or mail credentials, and a Square transport that rejects every non-sandbox configuration. A short-lived, origin-bound, secret-protected, one-time initialization endpoint seeded two fictional studios, eight staff accounts (Owner, Manager, Coach and Front Desk in each studio) and ten fictional members. No production data was copied.

Three setup/security tests and sandbox backend TypeScript passed. The deployed private backend was exercised over HTTPS using documented Sites service access without embedding that credential in either native app. **39 hosted API checks passed, zero failed**; the exact results are in `docs/hosted-sandbox-evidence.json`. These are service-layer checks, not interactions executed on an iPhone.

Covered: all eight staff logins; role/tenant preservation for all roles; member studio/profile reads and persistent edits; booking, full-class waitlisting, duplicate rejection, cancellation and FIFO promotion; manager check-in visible in the member data; expired member, cross-studio and wrong-origin denials; Coach/Front Desk refund denials; support creation, persistent correspondence, manager reply visible on the same member ticket and cross-member/studio isolation; logout revocation. The class-pack available balance was 8 before reservation, 7 while reserved and 8 after early cancellation. This verifies reservation holds and release, not a purchased pack or attended-class deduction.

Both native variants now have explicit sandbox TestFlight build profiles. They permit only the known production and sandbox origins, reject invitations for the other environment, store sandbox sessions under a separate SecureStore key, and show a visible sandbox label. Each variant passed TypeScript, **14/14 unit tests**, and an iOS Hermes export after these changes.

- Staff sandbox source: 8a8ce0ac684a7e18e3a461d799673c2608ac6f93; cloud build f8de7760-edd3-4e9c-9a08-6b9ed3800d57.
- Members sandbox source: 6c12a21a664f4c9041168c8e2cf32960397d7996; cloud build 7f6c1ac3-3722-4f57-8c59-3e29b37947ee.
- Both cloud signing builds SUCCEEDED. Staff 1.0.0 (8): 4m 18s build, 4m 28s total. Members 1.0.0 (6): 4m 7s build, 4m 45s total. Both Expo Doctor runs passed 21/21 checks. Automatic submission was OFF. Neither has been uploaded to TestFlight at this checkpoint.

The Sites service remains owner-private. Native TestFlight clients and Square webhooks cannot use the private service credential; it must never be bundled in an app. A separately approved public network audience with existing account/API authentication is required for those clients. Square sandbox configuration and webhook credentials still need to be connected to this new backend; direct Developer Console token tests do not establish OAuth scope or end-to-end reconciliation.

Scenarios A and D (purchases/retail reconciliation), provider-backed renewals and payment recovery, push receipt, native accessibility/performance, recordings and full on-device scenarios remain NOT TESTED. APNs sending credentials are still absent. Member and Staff remain independently NO-GO for App Store launch. TestFlight distribution remains pending the applicable checks and external access setup.


### Signed sandbox build evidence

Staff: https://expo.dev/accounts/studioflowiq-team/projects/studioflowiq-staff/builds/f8de7760-edd3-4e9c-9a08-6b9ed3800d57

Members: https://expo.dev/accounts/studioflowiq-team/projects/studioflowiq-membersstudioflowiq-members/builds/7f6c1ac3-3722-4f57-8c59-3e29b37947ee

The Expo environment label `production` identifies its store-signing build environment; the explicit sandbox build profiles set EXPO_PUBLIC_API_ORIGIN to the separate sandbox backend. TestFlight upload remains pending. Physical iPhone verification, native recordings and APNs delivery are NOT TESTED. The sandbox Site's audience must not be changed without explicit approval, and its private service credential must never enter the native bundle.


## Public sandbox access and payment setup checkpoint

The user explicitly approved public network reachability. Sites access changed to public, revision 2. Browser GET /api/auth returned authenticated:false, and GET /api/member required the private member link without returning member data. Curl also received those JSON responses. Account authentication and role/tenant enforcement were retained.

A separate Python public-client run was blocked before application execution by Cloudflare HTTP 403, text/plain error code 1010. Its apparent five denial passes and twelve failures are NOT valid application results; that run is classified NOT TESTED due to transport blocking. It does not invalidate the prior 39 hosted handler checks through documented private service access. Native iPhone reachability remains NOT TESTED and must be checked before marking either candidate ready. Cloudflare's explanation: https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-1xxx-errors/error-1010/ . No fingerprint changes or security-control weakening were applied.

A protected, short-lived, exact-origin sandbox payment initializer was implemented. Four local tests passed: setup authorization; missing token/production application-ID rejection before provider calls; expected merchant/location and fixture prerequisites; encrypted storage, secret-free responses and webhook reuse. The existing database trigger rejects assigning one Square merchant to unrelated studios. The initializer preserves it and configures only qa-studio-a; qa-studio-b remains unconnected for account-isolation tests. No production business rule was weakened. These initializer tests mock Square and do not prove the live provider setup.

The initializer is designed to read the existing sandbox-only Square token from secret runtime configuration, validate the previously verified Default Test Account/location, configure an app webhook with a server-encrypted signing key, and store encrypted credentials for the primary fictional studio. It does not verify OAuth scopes. Missing secrets fail closed. No production token or application secret is used.

Automatic approval review rejected extracting the live sandbox bearer token from the browser into a shared file because that extraction/transfer method was not explicitly authorized. The temporary browser-side file was removed; no token was transferred to the backend or committed to Git. Completing that protected transfer requires explicit user approval of the method or user-performed secure configuration. Payment journeys, webhook reconciliation, renewals, APNs/device checks and TestFlight upload remain pending.
