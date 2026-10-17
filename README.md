# AV8 FLY for iOS

Native Expo / React Native app, version 1.0.0. Provides AV8 FLY website access with in-app back navigation, a native offline flight-cost calculator, and persistent on-device trip notes with native sharing.

## Registered identities
- Apple bundle: com.av8fly.app
- Apple team: UCLH3R22ZQ
- Expo owner: studioflowiq-team
- Expo project: 940246bd-1415-4fbc-a4e6-c2c4511d83b9
- Expo slug: av8-flyav8fly

## Validated
- npm run typecheck
- npm test
- npm run bundle (iOS Hermes export)

## Remaining release steps
1. Complete the prepared AV8 FLY App Store Connect app record and put its Apple numeric app ID in eas.json submit.production.ios.ascAppId.
2. With user approval, connect Expo to Studioflowiq/Studioflowiq-staff, select branch av8fly-ios, and build profile production.
3. Reuse authorized Apple distribution credentials or configure app-specific provisioning for com.av8fly.app. Do not commit signing keys or API keys.
4. Run an iOS store build and submit to App Store Connect. Verify processing completes before enabling internal TestFlight testing.
5. Test on a physical iPhone, including website login, back navigation, uploads, offline recovery, notes persistence and native sharing.
6. Complete App Store screenshots, privacy disclosures, age rating, support and privacy links, review information and required availability settings before requesting public App Store review.

App Store publication and TestFlight activation have not occurred. The generated JavaScript bundle is not a signed .ipa. Labor-saving server changes delivered by the AV8 website remain subject to Apple policies.
