const { withEntitlementsPlist } = require('expo/config-plugins');
module.exports = config => withEntitlementsPlist(config, config => {
  // Staff currently schedules reminders on-device only; no APNs entitlement is needed.
  delete config.modResults['aps-environment'];
  return config;
});
