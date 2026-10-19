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
- Config introspection confirms secure storage/camera plugins and APNs entitlement generation. Store builds need matching push-enabled provisioning.
- No production database records were changed by tests. Production provider requests were not exercised.

## Workflow acceptance evidence

PASS below is limited to the executed scope in the evidence column. No device journey is inferred from source presence.

| Workflow | Members | Staff | Evidence / limit |
|---|---|---|---|
| Auth, expiry and tenant/role isolation | NOT TESTED end to end | NOT TESTED end to end | Local backend security-handler tests PASS for Owner, Manager, Coach and Front Desk; native API tests PASS |
| Onboarding/profile/photo editing | NOT TESTED | NOT TESTED | Requires signed app on iPhone and authorized test accounts |
| Schedule, booking and cancellation | NOT TESTED | NOT TESTED | Native date/time/domain mapping unit tests PASS; real cross-app mutation not executed |
| Capacity, balances, waitlist promotion | NOT TESTED | NOT TESTED | No device/staging promotion scenario executed |
| QR generation/scanning/check-in | NOT TESTED | NOT TESTED | QR parser unit tests PASS; camera/device journey outstanding |
| Payment card tokenization, purchase, decline, retry | NOT TESTED | NOT TESTED | Server price/idempotency local-handler tests PASS with provider mocks; Square sandbox not executed |
| Refunds and recurring cancellation | NOT TESTED | NOT TESTED | Local ownership/role/amount tests PASS; provider reconciliation outstanding |
| Retail POS and reporting | NOT TESTED | NOT TESTED | No processor-backed POS transaction executed |
| Support correspondence across apps/studios | NOT TESTED | NOT TESTED | Local member ticket isolation tests PASS; real user exchange outstanding |
| Push receipt, denied permission, foreground/background | NOT TESTED | NOT TESTED | Registration/dispatch implemented; no APNs sending key bound and no device receipt |
| Account deletion | NOT TESTED | NOT TESTED | Request queue implemented; actual processing/retention acceptance outstanding |
| Offline, slow network, accessibility and performance | NOT TESTED | NOT TESTED | Physical-device measurements and recordings unavailable |

## Required acceptance before GO

| Priority | Requirement | Status |
|---|---|---|
| P0 release gate | New signed builds install and run on an iPhone | NOT TESTED |
| P0 release gate | Square sandbox tokenization, purchase/decline/retry/refund/renewal reconciliation | NOT TESTED; mocked-provider checks do not establish this |
| P0 release gate | Complete scenarios A–E on Member and all Staff roles across two studios | NOT TESTED on devices |
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

Updated candidate sources: Staff 190d59ade60bae62671eef84e9f4aff0cc14c417; Members 64e36a5d3be0ebe3e0b05d8f22c0c9a59761a025. Their new cloud builds are ee900f8e-86a2-462e-936e-0cd57a5d59b9 and 28d64a29-7bff-446c-ba57-b0014da2ac68 respectively. Staff cloud Expo Doctor now passes 21/21 checks. Final signed-build outcomes are recorded after completion.


### Performance evidence boundary

No cold/warm launch duration, frame-rate, memory/leak, crash-rate, cellular-latency or battery baseline was measured. API timeouts, lifecycle refresh, private-screen overlays and native controls were implemented, but no quantified performance improvement is claimed. Native back gestures, transition quality, Dynamic Type, VoiceOver and visual quality remain device acceptance items.
