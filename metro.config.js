// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Support for expo-router
config.resolver.assetExts.push(
  // Adds support for `.db` files for SQLite databases
  'db',
  'cjs'
);

// Support for NativeWind - updated configuration for v4
module.exports = withNativeWind(config, { input: './global.css' });