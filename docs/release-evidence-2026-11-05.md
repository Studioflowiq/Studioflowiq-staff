# AV8 FLY: release evidence, 5 November 2026

## Submission state
Latest uploaded builds observed in App Store Connect: 1.0.0 (28), beta rejected.
This document describes prepared source candidates. New signed build numbers and successful uploads have NOT yet been verified. Existing App Store rejections remain unresolved. Do not present a source export as a signed iOS build or a passed device test.

## Changes in this candidate
Align Expo 57 packages. Preserve existing native flight planning calculations, time/weather handling, PDF/GPX exports, membership scope and receiver/device bridges. No claimed accident-cause, instrument certification or newly verified payment/flight acceptance.

## Executed local verification
- TypeScript type check passed.
- iOS Hermes bundle export passed.
- Dependency versions validated against the installed Expo SDK metadata in offline mode; the online compatibility service was unavailable during some runs.
- Existing automated test suite: 29 passed, zero failures. These are code/contract tests, not end-to-end device or production-provider acceptance.

## Build/upload controls
Cloud candidates use the existing Apple app and Expo project identifiers and increment remote build numbers. Build/upload workflows are separate per app. Release checks run through the EAS post-install hook. New build execution is pending authorization for usage-based build charges after included credits were exhausted.

## Evidence still required
- Successful cloud compile/sign and upload, with exact source commit, build ID, Apple build number and timestamps.
- Installation, cold launch, sign-in/recovery and core role-specific flows on a physical iPhone/iPad where supported.
- Payment-provider sandbox purchase, decline, retry and refund/reconciliation checks where applicable. No live charges were executed.
- Accessibility, camera/photo permission denial, offline/reconnect, background/foreground and account/tenant isolation acceptance.
- Dated tester feedback tied to a failure, fix and successful retest on the candidate build.
- Updated screenshots/recordings from the actual candidate and accurate store privacy/review credentials.

## Apple reviewer handoff
Explain the concrete problem, intended audience and distinct workflows for this app. Disclose shared first-party code/assets and third-party SDKs; role-specific variants are related products and must not be described as entirely unrelated codebases. Provide only observed testing evidence. SDK patch alignment alone does not establish compliance with Apple's design/spam guidelines. A new TestFlight upload does not mean App Store approval.
