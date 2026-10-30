# VayHaven mobile apps

## Current update — October 23, 2026

Native version **1.0.1 is prepared in source, not yet uploaded to TestFlight**. See [the complete platform/app parity review](../docs/three-app-parity.md) for scope, validation and release limits. All three apps still share the live workspace, including the new Channex Guest Inbox; new native attachment/link handling, save/share, invitation intent, foreground refresh and keyboard/recovery improvements require signed replacement builds. The previous build-3 checkpoint below remains historical.

Run `npm ci`, `npm run typecheck`, `npm test`, then `npm run bundle:all`. The last command creates separate clean-cache iOS/Android exports and verifies each app's exact icon and identity. Switching variants without clearing Metro's cache was observed to reuse the previous app's bundle; do not rely on a generic successful export alone.

Expo CLI currently reports **Not logged in** in the update environment. No new signing credential, EAS build, Apple upload or TestFlight assignment has been created for 1.0.1. Resume with the existing three profiles and `--clear-cache` after sign-in; preserve the existing app IDs and remote signing credentials. Push notifications remain unconfigured; local reminders are separate from incoming-message alerts.

Three separate Expo apps share the VayHaven backend at https://vayhaven.com. Each has its own app identity, opaque 1024px icon and native accent color.

| App | Bundle identifier | Color | Entry | App Store Connect ID | EAS project ID |
| --- | --- | --- | --- | --- | --- |
| Management | com.vayhaven.management | Navy #07348f | /?app=manager | 6823149422 | a37f4684-12e6-4eb2-857b-d91a04e1a5e6 |
| Guest | com.vayhaven.guest | Teal #157e82 | /?app=guest | 6823152178 | 8be41244-d0e4-4cd6-87ab-3d609388596d |
| Vendor | com.vayhaven.vendor | Orange #c45b16 | /?app=vendor&portal=vendor | 6823986250 | b50c4a69-2685-4c1c-a9ba-12299f53eaa5 |

Expo owner: studioflowiq-team. Apple team: UCLH3R22ZQ. Existing distribution certificate expires October 14, 2027. Signing secrets are held by Expo and are not committed. All builds below are version 1.0.0 (3).

## Release checkpoint — October 17, 2026

All three signed EAS builds finished, and all three EAS submissions to App Store Connect finished without error.

| App | Build ID | Submission ID |
| --- | --- | --- |
| Vendor | bee96075-9eff-4220-ba03-10ad5e43e57c | 8a9d68a3-6c54-4bfd-869b-7236a8b364f8 |
| Management | 08528d89-8a24-470c-b0f7-67e3720d3313 | 5769d0fe-59c0-4d1f-bf58-34005e544cbc |
| Guest | cb894c2f-434c-49d9-b368-657ed9d3a31d | 842e6f04-0fd7-4acf-8fb3-6ca02f8040e6 |

Apple verification: Vendor build 3 is processed, assigned to VayHaven Vendor Internal Testing (1fe64a3b-7185-45fd-bfac-f1437096c30a), with one invite. Tester hello@studioflowiq.com is Adam Christiansen (Account Holder/Admin); Apple displays Invited. Management and Guest build 3 both finished Apple processing and were assigned to their existing VayHaven Internal Testing groups. All three build-3 updates are available for internal TestFlight testing. No public App Store release was requested.

The user explicitly approved Full Access for the new Vendor app record, reuse of the existing upload credential, inviting their own tester account, the Management/Guest rebuilds and uploads, and specifically the Management/Guest App Store Connect submissions for TestFlight internal testing. Earlier automatic-review blocks are superseded only for those explicitly approved actions. The existing upload key was assigned to Vendor through the standard EAS credentials CLI flow, after the custom credential-link script was blocked. No new upload key was created.

Vendor provisioning profile developer-portal ID: N2XA9C75W9. Apple processed Vendor build ID: 5fc608e9-da52-4410-be79-8e277575263c. Original build 2 release source was 0ed41f4928aba4bdd3323377fcb6af9f006251cc; build 3 source is b3374e3eca9b4c7a23c9ab8496e5cab9e3c0e72a. Later documentation commits do not change the uploaded binaries.

## App behavior

The backend enforces company and role permissions. Guest and Vendor apps open their respective account entry; Vendor invitation/recovery landings preserve vendor intent. Portal choice cannot grant permissions. Vendors use assigned jobs, status updates, photos, invoices and messaging from the existing portal. Native home, portal, reminders and help tabs preserve portal session/navigation state. Private invitations stay in memory, with same-origin activation links. External checkout/signature links use an HTTPS host allowlist.

Reminders are local notifications; APNs is not configured. Reservation data is not stored offline. Camera/photo workflows, file transfers, payments, login persistence and other native behavior still require physical-device testing.

## Validation

Mobile TypeScript, all four native link/identity tests, Vendor/Management/Guest iOS and Android bundle exports, and the web production build passed. New icons derive from the existing VayHaven vector favicon geometry.

```sh
npm ci
npm run typecheck
npm test
EXPO_PUBLIC_APP_VARIANT=vendor npm run bundle
EXPO_PUBLIC_APP_VARIANT=management npm run bundle
EXPO_PUBLIC_APP_VARIANT=guest npm run bundle
```

## Future builds

Use each app's matching profile. Version numbers increment remotely. All profiles target separate registered app identities. Credentials are remote; do not put them in source or documentation.

```sh
EXPO_PUBLIC_APP_VARIANT=vendor npx eas-cli build --platform ios --profile vendor-testflight
EXPO_PUBLIC_APP_VARIANT=vendor npx eas-cli submit --platform ios --profile vendor-testflight
EXPO_PUBLIC_APP_VARIANT=management npx eas-cli build --platform ios --profile management-testflight
EXPO_PUBLIC_APP_VARIANT=management npx eas-cli submit --platform ios --profile management-testflight
EXPO_PUBLIC_APP_VARIANT=guest npx eas-cli build --platform ios --profile guest-testflight
EXPO_PUBLIC_APP_VARIANT=guest npx eas-cli submit --platform ios --profile guest-testflight
```

## Web workspace refresh — October 22, 2026

Management, Guest and Vendor WebViews all load the live VayHaven origin, so the portfolio/rate/queue/block additions are served by the website with existing role permissions. These web-only changes do not require a new native binary. Tap the active native Workspace / My stay / My jobs tab to reload the currently open WebView once.

The website now checks `/api/app-release` without caching on focus, foreground visibility, reconnection and every minute while visible. A changed release offers a “Refresh workspace” action; it never automatically reloads an active edit. Navigation through the service worker uses `no-store`; no authenticated data is cached offline. Change `lib/app-release.ts` for future web releases. Vendor is recognized as a native entry alongside Management and Guest.

No new EAS build, App Store Connect upload or TestFlight activation was performed for this web refresh release. The phone cannot be refreshed remotely. Physical-device acceptance remains required for native camera, downloads, payment redirects and notification behavior.
