const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable .cjs extension
config.resolver.sourceExts.push('cjs');

// In SDK 52+, do NOT disable unstable_enablePackageExports as @expo/log-box relies on it.
// Ensure 'react-native' is included in export condition names so Firebase Auth resolves to its React Native bundle
config.resolver.unstable_conditionNames = ['react-native', 'browser', 'require', 'import', 'default'];

module.exports = config;
