# Regular-service TestFlight checkpoint — 19 October 2026

This checkpoint supersedes older statements that the photo, refund-sync and Square subscription payload fixes exist only in sandbox.

## Production backend
Source 43dcd5e77be439ebcc8cb6726073a547e3152b42; version 98; deployment appgdep_6ad6891f1e148191827cf84d2b2da0a6 succeeded. Changed only authenticated member photo saving, Square modern subscription variation pricing, refund synchronization and corresponding tests. Preserved runtime revision 7, audience, payment credentials, role defaults and existing data. No QA bootstrap routes, fictional fixtures or sandbox-only provider guards were copied to production.

Validation: all 36 backend check groups passed, including website TypeScript, and production framework build passed. Provider behavior in those regression tests is mocked. Read-only production HTTPS checks passed: /api/auth 200 authenticated:false; /api/studio 401; /api/member 401. No production account, charge, refund, renewal, email or deletion was executed as a test. Earlier actual sandbox provider payment/refund evidence remains limited to sandbox.

## Native source
Staff abd90a0bd6172f757498b55112385a216c11644f; Members dcf7e6d423ed1000ec0ed09a394bdae852a1b9ba. New owner tools described in owner-native-completion.md. Both variants passed TypeScript and 23/23 native unit tests. Existing permissions and studio isolation remain unchanged. These checks do not prove native tap-through or device usability.

Regular-service builds requested using existing staff-testflight/member-testflight profiles (not sandbox profiles), with automatic EAS Submit to TestFlight:
- Staff 1.0.0 (11): beb8f4b0-a36b-4a9a-8945-f44acecca825
- Members 1.0.0 (10): 81b20f9c-77ee-4b26-a969-d04b8423d6c6
Both signing builds were in progress at this report checkpoint. Upload completion, Apple processing and existing tester-group assignment must be verified separately. Do not claim phone availability from a build request.

These candidates use normal studio service sign-in; sandbox credentials and invitations must not be reused. Production payment configuration was not changed. A regular-interface build does not establish live payment readiness.

## Remaining public-launch gates
Physical-device photo and full journeys, all-role screen acceptance, production provider authorization/configuration and subscription lifecycle, APNs key/delivery, device accessibility/performance/recordings, account deletion processing/retention, security dependency disposition and complete App Store disclosures/review assets remain outstanding. Native owner-tool coverage is expanded, not complete portal parity; see owner-native-completion.md limitations. No App Store review submission or public release was performed.

Independent recommendations: Member NO-GO for public launch; Staff NO-GO for public launch. These are TestFlight review candidates only.


## Distribution update
Both signing builds SUCCEEDED. Staff submission 449ea35a-08e4-4656-8915-b666476b32a1 and Members submission e52d9f54-fbce-40df-8d52-036fc79836f6 both confirmed IPA file upload completion and remained in Apple PROCESSING at the final check. Existing tester-group assignment is NOT VERIFIED. Apple rejected the secure sign-in attempt with 'Check the account information you entered and try again.' Manual sign-in is required to continue group assignment. Do not claim either candidate is available on an iPhone yet.
