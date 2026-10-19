# StudioFlowIQ — native implementation and release status

Updated 19 October 2026. Member and Staff release decisions remain independent.

## Decision

**Members: NO-GO for App Store review. Staff: NO-GO for App Store review.** Native core implementation is complete for the workflows listed below, but this is not physical-device acceptance. No real charge, refund, subscription cancellation or account deletion was performed by this development run. No App Store review submission is authorized.

## Implemented in source

Both apps now use React Native screens for their core workflows, with a shared charcoal/teal design system, automatic Dark Mode, native modal sheets, accessible controls, haptics, larger touch targets, reduced-motion handling, keyboard dismissal, and lifecycle refresh. The previous full-portal WebView has been removed. A narrowly scoped WebView remains for Square's secure card fields.

Members: secure private-link access, profile/address/emergency-contact/date-of-birth editing, photo capture/upload, native schedules and class details, booking/cancellation/waitlist status, reservation history, class-credit summary, native QR pass, memberships/classes/retail shopping, billing history, renewal cancellation requests, opt-in booking/waitlist push registration, studio announcements, support correspondence, and account-deletion requests.

Staff: secure password sign-in/setup/recovery, role-filtered native schedule and roster, member names/check-in/no-show/cancellation/presence management, member lookup/profile editing/photo capture, native QR scanning, class creation/editing with native date/time selection, instructor/catalog/membership management, retail/membership checkout including sample and free-class flows, payment refund controls, reports, staff shifts/time punches, commission tracking/settings, staff invitations/reset/disable, studio announcements and support correspondence with immutable studio identification.

Backend: native bearer sessions reuse the existing opaque session database and tenant/role enforcement; no client-selected role grants access. Member tickets are isolated by authenticated member identity. Member checkout derives pricing and receiving account from server records and uses idempotent checkout IDs. Refunds enforce owner/manager permission and verify the original processor payment, merchant and available amount. Subscription cancellation is restricted to the member's own recurring purchase. Password recovery uses generic responses, rate limits and expiring single-use links. Deletion requests are queued and create support tickets; submitting the request does not itself erase records or cancel billing.

Push: opt-in Expo token registration and member booking/waitlist notification dispatch are implemented. Provider acceptance is tracked separately from delivery. No APNs credentials or physical-device delivery were verified in this run. App data refreshes on foreground and every 30 seconds while active; this is polling, not a realtime socket. Staff operational push coverage is not complete.

Release assets: distinct existing bundle/Expo/App Store identities retained; 1024×1024 opaque icons with SVG masters; camera/photo permission purpose text; secure device credential storage; support/privacy pages and store metadata drafts. No tracking permission or microphone access is requested. iPhone layout is the supported target.

## Executed checks

- Native TypeScript and native API/domain/URL/identity unit tests executed in both checkouts.
- iOS Hermes exports executed for both variants. A Hermes export is not a signed IPA or device test.
- Shared backend TypeScript and regression tests executed, including actual route handlers with local SQL fixtures and mocked external providers.
- Security tests verify every staff role retains its server tenant/role, malformed/expired/disabled sessions fail, wrong origins fail, member ticket isolation, catalog-priced checkout, retry idempotency, refund permissions/limits, and ownership of renewal cancellation.
- The previous roster checkout hook mock was fixed; the covered roster checkout tests now execute successfully.
- Config introspection confirms secure storage/camera plugins and APNs entitlement generation. Store builds need matching push-enabled provisioning.
- No production database records were changed by tests. Production provider requests were not exercised.

## Required acceptance before GO

| Priority | Requirement | Status |
|---|---|---|
| P0 release gate | New signed builds install and run on an iPhone | NOT TESTED |
| P0 release gate | Square sandbox tokenization, purchase/decline/retry/refund/renewal reconciliation | NOT TESTED; mocked-provider checks do not establish this |
| P0 release gate | Complete scenarios A–E on Member and all Staff roles across two studios | NOT TESTED on devices |
| P1 | APNs credential/provisioning and actual push delivery including disabled permissions | NOT TESTED |
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

## Cloud build verification — final checkpoint

Backend version 96 was successfully deployed from source 8d4f2fe433465c715468c26479359f419e474884.

- Staff candidate: 1.0.0 (5), source a61669cce75112c0c6f19080217d743d42167117, build https://expo.dev/accounts/studioflowiq-team/projects/studioflowiq-staff/builds/95396642-3417-4cfc-8752-c19d511518ee .
- Member candidate: 1.0.0 (3), source e46bc42ece019b6a85889b2cad47c71147324b41, build https://expo.dev/accounts/studioflowiq-team/projects/studioflowiq-membersstudioflowiq-members/builds/8935fac4-efe3-4563-8395-a2f605ae5756 .

Both cloud builds installed dependencies, prebuilt native projects, installed CocoaPods and bundled JavaScript, then FAILED at Xcode signing. Each existing TestFlight provisioning profile lacks Push Notifications capability and the aps-environment entitlement. Neither produced a new signed IPA or TestFlight upload. Auto-submit was disabled.

Remediation: authenticate to the existing Apple Developer team, enable/verify Push Notifications on the existing identifiers, regenerate the corresponding distribution provisioning profiles with the existing certificates, update the existing Expo credential bindings, then rebuild these source commits. APNs sending credentials and physical-device delivery also need verification. Do not remove the entitlement merely to mask the missing push configuration.

Apple sign-in was attempted through secure browser authentication, but an authenticated Developer account page could not be verified. Manual sign-in is required to continue this credential repair.

