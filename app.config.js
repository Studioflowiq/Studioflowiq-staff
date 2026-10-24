module.exports = ({ config }) => {
  if (process.env.EXPO_PUBLIC_APP_VARIANT === 'member') return {
    ...config,
    name: 'StudioFlowIQ Members',
    slug: 'studioflowiq-membersstudioflowiq-members',
    owner: 'studioflowiq-team',
    scheme: 'studioflowiq-members',
    plugins: [...(config.plugins || [])],
    ios: { ...config.ios, bundleIdentifier: 'com.studioflowiq.members', infoPlist: { ...config.ios.infoPlist, NSCameraUsageDescription: 'Take a photo for your member profile.', NSPhotoLibraryUsageDescription: 'Choose a photo for your member profile.' } },
    android: { ...config.android, package: 'com.studioflowiq.members' },
    extra: { ...config.extra, appVariant: 'member', eas: { projectId: 'bf5fc323-f8ac-4a1f-a208-a7652a012ba9' } },
  };
  if (process.env.EXPO_PUBLIC_APP_VARIANT !== 'staff') return config;
  return {
    ...config,
    name: 'StudioFlowIQ Staff',
    slug: 'studioflowiq-staff',
    owner: 'studioflowiq-team',
    icon: './assets/staff-icon.png',
    scheme: 'studioflowiq-staff',
    plugins: [...(config.plugins || [])],
    ios: { ...config.ios, bundleIdentifier: 'com.studioflowiq.staff' },
    android: { ...config.android, package: 'com.studioflowiq.staff', adaptiveIcon: { ...config.android.adaptiveIcon, foregroundImage: './assets/staff-icon.png' } },
    extra: { ...config.extra, appVariant: 'staff', eas: { projectId: 'c5bdf421-e26b-4283-803e-7eac8e24ac33' } },
  };
};
