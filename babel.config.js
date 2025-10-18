module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Update the order of plugins for Expo SDK 54 compatibility
      'expo-router/babel',
      'nativewind/babel',
      'react-native-reanimated/plugin'
    ],
  };
};
