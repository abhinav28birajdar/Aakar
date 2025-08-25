import Constants from 'expo-constants';
import type { DesignCategory, NotificationType } from './types';

export const siteConfig = {
  name: 'Aakar',
  description: 'The premier mobile platform for digital creators.',
  // Access environment variables defined in app.json
  nextJsApiBaseUrl: Constants.expoConfig?.extra?.EXPO_PUBLIC_NEXTJS_API_BASE_URL || 'http://localhost:3000',
  stripePublishableKey: Constants.expoConfig?.extra?.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  communityGuidelinesUrl: 'https://aakar.com/guidelines',
  privacyPolicyUrl: 'https://aakar.com/privacy',
  termsOfServiceUrl: 'https://aakar.com/terms',
  // Mobile-specific config
  PAGINATION_LIMIT: 12,
  AI_CREDITS_FREE_TIER_MAX: 50,
};

// Categories from types.ts
export const DESIGN_CATEGORIES: DesignCategory[] = [
  'UI/UX Design', 'Web Design', 'Illustration', 'Logo Design', '3D Design',
  'Icon Design', 'Brand Design', 'Product Design', 'Motion Design',
  'Print Design', 'Game Design', 'Typography', 'Other'
];

export const NOTIFICATION_TYPES: NotificationType[] = [
  'like', 'comment', 'follow', 'mention', 'design_feature',
  'new_follower_post', 'system_alert'
];

// Local asset imports
export const PLACEHOLDER_AVATAR = require('../../assets/images/default_avatar.png');
export const PLACEHOLDER_HEADER = require('../../assets/images/default_header.png');
export const APP_ICON_DARK = require('../../assets/images/icon_dark.png');
export const APP_ICON_LIGHT = require('../../assets/images/icon_light.png');
export const NOTIFICATION_SMALL_ICON = require('../../assets/images/notification_icon_small.png');
