# StudioFlowIQ iOS and Android

A React Native / Expo mobile client connected to https://studioflowiq.com. Public support and store contact: **hello@studioflowiq.com**. Proposed app identifiers: `com.studioflowiq.app` (availability is not yet checked in developer accounts).

## Implemented

- Native branded member and staff entry screens, teal / purple accents, safe-area layout and bottom navigation.
- Existing live member/studio workflows inside an HTTPS WebView, preserving the existing backend session cookies and role permissions. Native role selection grants no permissions.
- Paste private invitation links; only the exact production origin and member/login paths are accepted. Invitation values are not persisted by the native shell or logged.
- Native local reminder notifications, permission handling, upcoming reminders and cancellation. These are user-created reminders, not automatic reservation notifications.
- Support email action, network failure/retry view, Android back navigation, iOS back/forward gestures, haptic selection feedback.
- External navigation restricted to known checkout provider hosts. Unrecognized external redirects are blocked until reviewed.

## Run and validate

Use Node supported by the selected Expo SDK.

```sh
npm ci
npm run typecheck
npm test
npm run bundle
npx expo start
```

Build native projects / development binaries:

```sh
npx expo prebuild
npx expo run:ios
npx expo run:android
```

iOS local builds require macOS/Xcode. Android local builds require the Android SDK. `ios/` and `android/` are generated and ignored. This checkout contains source and bundle configuration; it is not a signed IPA/AAB.

## Cloud builds

Sign in to an Expo account owned by the business and connect this project using EAS. Enrollment email/contact preference: hello@studioflowiq.com. `eas.json` intentionally omits account IDs and credentials. Confirm the package IDs before the first store build; they are difficult to change after publication.

```sh
npx eas-cli login
npx eas-cli init
npx eas-cli build --profile preview --platform android
npx eas-cli build --profile production --platform all
```

Store submission must follow device verification and completion of store-required disclosures. No developer accounts, EAS project, signing credentials, binaries or store listings have been created externally by this code change.

## Remaining release work

1. Enroll Apple Developer and Google Play Console accounts. Use hello@studioflowiq.com for business contact; Google requires a Google Account and Apple requires an Apple Account with two-factor authentication. Confirm the legal entity, organization eligibility, D-U-N-S where applicable and owner identity directly with the stores.
2. Supply a real privacy policy and account-deletion workflow/URL, review data collection and retention, and complete App Privacy / Google Data Safety from the actual behavior. Do not submit the draft metadata with null fields.
3. Validate invitations, member session persistence, staff sign-in/roles, sign-out, stale sessions, uploads, downloaded reports and payment callbacks on physical iOS and Android devices. Browser-based camera/photo upload and download flows may need native bridge work. Third-party checkout should return cleanly to the app.
4. Test permission denial, local reminders, canceled reminders, notification taps, offline behavior, accessibility, large text and tablets. Automated push messages and Apple HealthKit are not implemented in this client.
5. Finalize native integration and store-review utility; the current client embeds existing workflows. App Store approval is not guaranteed by this architecture.
6. Prepare final 1024px store icon exports from approved brand source, actual-device screenshots and reviewer demo accounts. The current app uses the existing 512px assets for development.
7. Produce signed preview and production builds, test via TestFlight / Google internal testing, then submit for review.

## Sources checked during implementation

- https://docs.expo.dev/versions/latest/sdk/webview/
- https://docs.expo.dev/versions/latest/sdk/notifications/
- https://docs.expo.dev/build/eas-json/
- https://developer.apple.com/programs/enroll/
- https://developer.apple.com/app-store/review/guidelines/
- https://support.google.com/googleplay/android-developer/answer/13628312

## Staff iOS / TestFlight (October 14, 2026)

Apple app record: StudioFlowIQ Staff, app ID `6822838578`, bundle ID `com.studioflowiq.staff`, Apple team `UCLH3R22ZQ`. The separate staff build uses the purple staff icon, staff workspace entry, and staff invitation links. Backend authorization remains authoritative. The existing combined app remains the default configuration.

After signing in to the business-owned Expo account, initialize the STAFF project with the variant set:

```sh
EXPO_PUBLIC_APP_VARIANT=staff npx eas-cli init
EXPO_PUBLIC_APP_VARIANT=staff npx eas-cli build --platform ios --profile staff-testflight
EXPO_PUBLIC_APP_VARIANT=staff npx eas-cli submit --platform ios --profile staff-testflight --latest
```

Do not reuse the staff EAS project ID for a future member app. Do not paste Apple/Expo passwords, keys or tokens into chat or commit them. Signing and cloud account setup must be completed securely before a signed build can run. This profile uploads only to the existing Apple app record; upload is not App Store release.

Cloud account created and linked: Expo username `studioflowiq`, organization `studioflowiq-team`, Staff project ID `c5bdf421-e26b-4283-803e-7eac8e24ac33`. Cloud source upload requires explicit user approval after automatic review blocked the first attempt. No signed iOS build or TestFlight upload has been verified.

### Release setup checkpoint — October 14, 2026

- Apple Distribution certificate created (portal certificate ID `23NS2566R3`, expires October 14, 2027).
- App Store provisioning profile `StudioFlowIQ Staff TestFlight` created for `com.studioflowiq.staff` (portal profile ID `KNXAG2X4G4`).
- App Store Connect API access approved by account holder. App Manager key `StudioFlowIQ Staff EAS` created (`JBA8GB8T8H`, issuer `7e812e22-3148-4f5e-83d7-911ecdf7edfd`). Private key is not downloaded yet; its one-time download remains available in Apple.
- Staff entitlement introspection passes with no APNs entitlement: only local reminders are implemented. Certificate/profile match verified locally.
- Signing secrets are kept outside source control in checkout-local runtime state; never publish or commit them.
- Cloud launch remains blocked: environment denied network access to `https://api.expo.dev:443`. Earlier automatic review stopped the GCS upload; Expo official docs confirm private GCS is part of its normal build process. No signed IPA or queued cloud build was verified.
- Resume from the existing Expo Staff project and existing Apple app record. Do not create duplicate apps, projects, certificates, or API keys.

### Expo dashboard signing checkpoint

Expo web dashboard now confirms the Staff App Store distribution certificate and provisioning profile are both Valid. Remote signing credentials are available for `com.studioflowiq.staff`. The one-time download of upload key `JBA8GB8T8H` was consumed, but browser download recovery failed after a runtime timeout, so that key is NOT connected to Expo. Build setup can proceed with remote signing; submission still needs upload-key recovery or replacement. GitHub plugin installation failed for the user. Expo built-in GitHub connection is the next frontend step; no GitHub account or repo access has been verified and no source has been shared to GitHub. No build is queued.

## Members iOS checkpoint — October 14, 2026

- Expo project created: `bf5fc323-f8ac-4a1f-a208-a7652a012ba9` under `studioflowiq-team`, display name StudioFlowIQ Members. Actual project slug: `studioflowiq-membersstudioflowiq-members` (the form auto-generated the slug before text was appended; config matches this existing project to avoid duplicates).
- GitHub source: `Studioflowiq/Studioflowiq-staff`, branch `member-app`; connected to the new Members Expo project at repository root. Staff main branch was not changed.
- Variant: `EXPO_PUBLIC_APP_VARIANT=member`; profile `member-testflight`; proposed member bundle ID `com.studioflowiq.members`; teal member interface, member-only invitation entry.
- Mobile typecheck, four tests and iOS JavaScript bundle export passed. This is not a signed IPA.
- Expo build form prepared for iOS / member-app / member-testflight. No build queued: Expo reports missing iOS signing credentials for this app.
- Apple sign-in was initially declined, then requested again by the user and submitted securely. Post-sign-in screen is unverified because browser controls are currently unavailable. No Apple member app record, bundle registration or provisioning profile has been verified. Resume by inspecting the existing Apple tab; do not assume sign-in succeeded or ask for passwords/codes in chat. Never reuse the staff provisioning profile for Members.

### Apple member app record confirmed by user

Apple app ID: `6822994842`; name StudioFlowIQ Members; bundle ID `com.studioflowiq.members`; SKU `studioflowiq-members-ios`. User screenshots confirm the bundle registration and app record. Submission profile now points to this exact member Apple app. Member signing credentials still need setup; no member cloud build or TestFlight upload is queued or verified.

### Members signing and cloud build — October 15, 2026 UTC

- Apple Developer session verified; Members bundle and App Store Connect record verified live (app ID `6822994842`).
- Created `StudioFlowIQ Members TestFlight` App Store profile for `com.studioflowiq.members`, portal ID `3R83LF4265`, UUID `4fd68356-6ead-444f-ac9b-6f540e0d905d`, expires October 14, 2027. Reuses existing distribution certificate; Staff profile unchanged.
- Expo confirms valid member certificate/profile and existing submission key `JBA8GB8T8H`. Optional APNs key skipped because client supports local reminders only.
- Launched iOS build `386fb496-b38b-4e54-a964-018c6dd6fa7e` from commit `391377cbdab870d6fae2863915a04021004ebad6`, branch `member-app`, profile `member-testflight`, production environment, automatic submission using `member-testflight` enabled.
- Build passed credentials preparation, prebuild and JavaScript bundling; native compilation is in progress. No finished IPA or TestFlight upload verified yet.
- Build: https://expo.dev/accounts/studioflowiq-team/projects/studioflowiq-membersstudioflowiq-members/builds/386fb496-b38b-4e54-a964-018c6dd6fa7e
- Members TestFlight currently shows No Builds pending completion and Apple processing. Do not start duplicate builds; monitor this build and its automatic submission.
