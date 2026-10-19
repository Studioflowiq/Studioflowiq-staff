# StudioFlowIQ native release audit — 19 October 2026

This is an initial source audit and corrective patch, not a completed transformation or release certification. No App Store submission, signed binary upload, real payment or production-data mutation was performed.

## Independent release decisions

| App | Decision | Reason |
|---|---|---|
| Members | NO-GO | Core workflows remain a WebView; sandbox payment journeys, accessibility and physical-device acceptance unverified. |
| Staff | NO-GO | Core operations remain a WebView; all-role device journeys, sandbox checkout and release configuration unverified. |

## Source reviewed

Mobile repository: Studioflowiq/Studioflowiq-staff. Staff base: bca1f02062ed70265e1f5de3c08ee0321c2dda19 (`main`); Members base: 4eb6dbed669cbaa9dd722a54cdcc146c855ed854 (`member-app`). Shared studio/backend source inspected at 3043de3875130fbaf14aeba52ae347edcf49c267. The AV8 branch was not modified.

## Implemented corrections

- Keep the studio WebView mounted when switching native tabs, preserving navigation and unfinished form state while the app remains alive. Process death and session expiry still require device testing.
- Provide explicit accessible Back and Reload controls, with a 44-point minimum control height.
- Dismiss the keyboard when changing tabs and dragging native scroll content; invitation Return submits the invitation.
- Clear stale connection errors on navigation; offer recovery after WebKit process termination. HTTP error overlays are limited to the tracked document URL rather than payment subframes.
- Bring the Staff branch up to the Member branch's Square-frame allowlist. Only exact HTTPS Square hosts in subframes qualify; they cannot become top-level destinations.
- Reject credential-bearing checkout links and test hostile hostnames and protocols.
- Supply the missing TypeScript declaration for the payment-frame helper in both apps.

These are source corrections. Their interactive behavior has not been accepted on an iPhone.

## Findings and priorities

| Priority | Finding | Evidence / required closure |
|---|---|---|
| P0 release gate | No end-to-end sandbox payment proof | Need Square sandbox seller/location, tokenization, declines, duplicate submission/retry, renewal and refund reconciliation. Mock tests cannot establish processor behavior. |
| P0 release gate | No real-device acceptance | Need an iPhone running each signed candidate, reviewer-role fixtures and recordings of scenarios A–E. No attached iPhone or macOS/Xcode runtime is present. |
| P1 | Core native transformation incomplete | Both `App.tsx` files render booking, payments and staff operations via `react-native-webview`. Native entry/reminder screens do not satisfy the requested native core. |
| P1 | Automatic booking/waitlist push missing in native source | Native code schedules user-created local reminders; no remote push-token registration or reservation-driven delivery was found there. Backend email notifications are a separate channel. |
| P1 | Dark Mode incomplete | Native config forces light appearance and shell styles use fixed light colors. VoiceOver/Dynamic Type/contrast have not been device-tested. |
| P1 | Store preparation incomplete | Tracked shared metadata uses the generic bundle ID and has null privacy policy, account-deletion, legal entity and reviewer credentials. Current App Store Connect values were not inspected. |
| P1 | Account recovery/deletion acceptance unresolved | Staff setup/reset is invitation-based; ordinary member access uses private links. No complete user account-deletion journey was found in reviewed routes; deleteProgress deletes workout data only. Implement with retention and identity checks, then test. |
| P1 | Icons are development resolution | Both mobile icon PNGs inspected are 512×512; regenerate store-quality assets from approved brand masters. Staff PNG uses RGBA; inspect alpha before final export. |
| P1 | Checkout return and file/camera flows unverified | Checkout links open externally; allowed provider callback, cancellation and return to the app need real-device tests. Native QR scanning/camera bridge is not established by permission strings. |
| P2 | Shell polish remains | Native icon tab bar, dynamic appearance, reduced motion, native sheets/selectors and screen-specific navigation remain work. No performance numbers have been measured. |

## Workflow evidence matrix

PASS means only the named executed scope, never the full mobile journey.

| Workflow / check | Status | Evidence or limit |
|---|---|---|
| Mobile URL validation, Square subframe policy | PASS | Staff 3 tests; Member 5 tests including distinct app identities. |
| Mobile TypeScript | PASS | `tsc --noEmit` executed in both checkouts. |
| Staff authentication / role-device journeys | NOT TESTED | Source reviewed; local backend fixtures are not authenticated iPhone sessions. |
| Member profile, membership, QR, billing journeys | NOT TESTED | No authenticated device session. |
| Square card storage, scopes and recurring billing | NOT TESTED | No sandbox provider transaction executed. Staff frame fix is not proof of a scope repair. |
| Booking, waitlist, reports and support backend regressions | See test evidence | Execute tests against checked-out routes with local database/provider fixtures; no production data changed. |
| Core premium native experience | FAIL | Core UI remains web-based. |
| Dark Mode requirement | FAIL | Fixed light shell configuration. |
| VoiceOver, Dynamic Type, haptics, camera, reminders | NOT TESTED | Requires device execution. |
| Cold/warm start, memory, offline/background behavior | NOT TESTED | No instrumented iOS runtime. |
| Signed IPA, signing validity, TestFlight installation | NOT TESTED | Hermes export is not a signed native build. |
| Live API authorization isolation | NOT TESTED | Requests from this environment returned text/plain 403; that is insufficient to attribute the response to application authorization. |

## Native implementation sequence

Retain React Native/Expo and existing app identifiers. Replace the core portal routes progressively with native screens backed by the existing API contracts; do not duplicate records or weaken server authorization. Member `GET/POST /api/member` already exposes state/profile/book/cancel with member bearer authorization. Staff `getStudioUser` currently relies on secure cookies and server tenant/permission resolution; native authentication must preserve that enforcement through a deliberate authenticated session contract. Do not grant a role based on an app variant or a client-selected studio ID.

Build member schedule → booking/detail → reservations → profile/QR first; staff schedule → roster/check-in → member lookup → support first. Keep financial screens gated to the verified processor path until native tokenization and reconciliation are tested. Add native secure session handling, recovery, lifecycle refresh, controlled deep links and server-linked push registration. Then implement the remaining POS, reporting and staff-management flows. This patch does not implement that migration.

## App Review checks

Apple's current guidelines were read on 19 October 2026: https://developer.apple.com/app-store/review/guidelines/ . Guideline 4.2 calls for utility/UI beyond a repackaged website; the current architecture carries review risk. Guideline 3.1.3(e) covers physical goods and in-person services consumed outside the app; do not assume the same Square checkout rule applies to software subscriptions or digital classes. Review digital/enterprise offerings separately against applicable storefront rules. Account creation triggers in-app account-deletion requirements under 5.1.1(v). Complete truthful privacy disclosures and reviewer access from actual behavior before submission.

## Outstanding access and acceptance

Needed to complete this audit: Square sandbox configuration, nonproduction fixtures for member/Owner/Manager/Coach/Front Desk and two studios, current Expo/App Store Connect build access, and a physical iPhone execution path. Credentials must be supplied through secure account tooling, not committed or embedded in the apps. Separate Member and Staff release approvals remain required after acceptance. No approval is requested for this initial patch.

## Executed results for Staff

Final iOS Hermes export: PASS (663 modules; JavaScript export only). Native TypeScript: PASS. Shared backend run: 90 tests, 89 passed and 1 test file failed to compile because its React hook mock omits useRef (`tests/roster-checkout-ui.test.mjs`). This is a test-harness failure and the covered checkout UI remains unverified; it is not counted as a passing test. Square sharing/OAuth/refund fixture tests passed; no actual Square API payment was made.
