# Checkout and member photo corrections — 19 October 2026

## Implemented
- Sandbox backend source 9781ab3d5c12c244a688f5441d6580123155f2ac, deployment version 5 succeeded. Removed obsolete recurring_price_money from Square SUBSCRIPTION_PLAN_VARIATION, keeping modern STATIC pricing.
- New authenticated member photo action updates only the current member photo independently of other personal fields.
- Native profile photo selection now saves immediately, confirms persistence, disables duplicate interaction and displays errors.
- Members source 0c5052c4d0eb3d584c3f78adc4a965c67ac8dc00; Staff source 8ba995b962718c5ce92158a0d08d21c31a097d5a contains the equivalent shared Member editor correction.

## Executed evidence
- Payment and member backend tests PASS; backend TypeScript and framework build PASS.
- Native TypeScript and 15/15 unit checks PASS in each native checkout.
- Deployed authenticated photo write HTTP 200 and subsequent read HTTP 200 matched submitted test data. Synthetic API image removed afterward. This does not verify physical iPhone image selection, encoding or display.
- Actual Square sandbox $99 monthly link setup HTTP 200, recurring true; checkout member_19e5faae-0912-4ddc-8af6-55c817da6c34.
- Square sandbox panel Test Payment reported successful completion, payment.updated/order.updated events.
- Member billing and staff payment/order records independently read back Paid, $99. Provider payment uaiUOkrt32RxSAgjTq8njxL6BOQZY.
- Subscription ID remains null in member billing after this simulation. Recurring subscription activation and subsequent renewals are NOT VERIFIED.
- Members iOS build d65b88d6-aaa0-4f89-9a8c-3c69237a8f7a, version 1.0.0 (9), SUCCEEDED. Submission 054761b5-84c3-444a-b799-12724cf64e62 is processing at this checkpoint. Do not infer tester availability from build success.

## Screenshots explained
- Staff screen is Owner dashboard, Sandbox Studio A, in the new native interface.
- Square Checkout API Sandbox Testing Panel is the provider's simulation UI.
- Fictional studio/member/class labels identify isolated test fixtures.
- Branded app-switcher cover hides private content when app is inactive.

## Remaining
Physical iPhone picker/photo persistence retest, full device journeys, recurring lifecycle, APNs, accessibility/performance, and previously documented parity/security/compliance gaps remain open. Failed checkout-key replay recovery remains open. Both apps remain NO-GO for public App Store launch. No production data, real charge or App Store review submission was performed.
