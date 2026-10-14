module.exports = ({ config }) => {
  if (process.env.EXPO_PUBLIC_APP_VARIANT !== 'staff') return config;
  return {
    ...config,
    name: 'StudioFlowIQ Staff',
    slug: 'studioflowiq-staff',
    owner: 'studioflowiq-team',
    icon: './assets/staff-icon.png',
    scheme: 'studioflowiq-staff',
    plugins: ['./plugins/with-local-notifications.js', ...(config.plugins || [])],
    ios: { ...config.ios, bundleIdentifier: 'com.studioflowiq.staff' },
    android: { ...config.android, package: 'com.studioflowiq.staff', adaptiveIcon: { ...config.android.adaptiveIcon, foregroundImage: './assets/staff-icon.png' } },
    extra: { ...config.extra, appVariant: 'staff', eas: { projectId: 'c5bdf421-e26b-4283-803e-7eac8e24ac33' } },
  };
};
