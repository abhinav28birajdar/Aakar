import Constants from 'expo-constants';

export const siteConfig = {
  name: 'Aakar',
  description: 'The ultimate platform for digital design creators on mobile.',
  nextJsApiBaseUrl: Constants.expoConfig?.extra?.EXPO_PUBLIC_NEXTJS_API_BASE_URL || 'http://localhost:3000',
  stripePublishableKey: Constants.expoConfig?.extra?.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
};

export const DESIGN_CATEGORIES = [
  'UI/UX Design', 'Web Design', 'Mobile App Design', 'Product Design',
  'Branding & Identity', 'Illustration', 'Digital Art', '3D Art',
  'Motion Graphics', 'Animation', 'Photography', 'Typography',
  'Graphic Design', 'Iconography', 'Game Design', 'Fashion Design',
  'Industrial Design', 'Architectural Visualization', 'Character Design',
  'Hand-Drawing & Sketching', 'Print Design', 'Data Visualization',
  'Environmental Graphics', 'Automotive Design', 'Textile Design',
  'Pattern Design', 'Packaging Design',
] as const;
export type DesignCategory = (typeof DESIGN_CATEGORIES)[number];

export const NOTIFICATION_TYPES = [
  'like', 'comment', 'follow', 'message', 'project_invite',
  'product_purchase', 'forum_reply', 'event_reminder',
  'design_version_update', 'system_alert'
] as const;
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export const PROFILE_PLACEHOLDER_AVATAR = require('../../assets/images/default_avatar.png');
export const PROFILE_PLACEHOLDER_HEADER = require('../../assets/images/default_header.png');
export const APP_ICON_PNG = require('../../assets/icon.png');
