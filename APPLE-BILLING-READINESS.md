# Apple billing candidate — not a launch certification

The native app now uses expo-iap 6.1.1 / StoreKit for Member and Pro monthly subscriptions. The existing web-card page is intercepted inside the main app and replaced with native Apple membership controls. An Apple transaction is finished only after the AV8 server verifies it. Restore, background purchase replay, prices returned by Apple, account binding, actual paid-period dates and Apple subscription management are included.

Product IDs:
- com.av8fly.app.member.monthly ($7.99 US monthly)
- com.av8fly.app.pro.monthly ($9.99 US monthly)

The corresponding hosted server requires AV8_APPLE_KEY_ID, AV8_APPLE_ISSUER_ID and AV8_APPLE_PRIVATE_KEY, held as server secrets only. Never put the .p8 key, passwords or signing keys in this repository, Expo public config, app code or chat. Server verification calls Apple's authenticated subscription-status API; client JWS/tier assertions are never accepted as entitlement proof. The server checks app, group, product, account token, environment, status and expiry. Apple status is refreshed at most 60 seconds after the previous check, and verification errors deny new paid access. Push subscription notifications are not configured yet.

AV8_APPLE_SANDBOX_EMAILS is an explicit list of permitted test AV8 account emails. AV8_APPLE_LIVE must remain unset/false until real Apple billing acceptance passes. Sandbox must never grant arbitrary production-user access. Purchases stay disabled until the backend is ready; this avoids charging without working server verification.

Remaining: configure a dedicated Apple In-App Purchase API key securely; confirm products' storefront availability and review metadata; run TestFlight purchase, restore, cancellation, expiry, upgrade/downgrade and account-switch tests. Confirm production monitoring, app-wide privacy disclosures and account deletion. No device or purchase acceptance is certified by a successful JavaScript export.

Visual changes: Help & Support added to the native menu; drawer safe-area provider corrected. Welcome/member wording is supplied by the hosted app and updated there. Existing user screenshots showing the old Plus name or menu overlap must not be used as final proof of the corrected app.
