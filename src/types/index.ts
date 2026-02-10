// ============================================================
// Aakar Platform - Complete Type Definitions
// ============================================================

// ---- User & Auth Types ----
export type UserRole = 'designer' | 'learner' | 'recruiter' | 'mentor';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  username: string;
  avatar: string;
  coverPhoto?: string;
  bio: string;
  location?: string;
  website?: string;
  role: UserRole;
  skills: string[];
  interests: string[];
  software: Record<string, number>; // software name -> proficiency 1-5
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isVerified: boolean;
  isOnline: boolean;
  lastSeen?: string;
  createdAt: string;
  updatedAt: string;
  // Mentor-specific
  mentorSpecialty?: string[];
  hourlyRate?: number;
  availability?: 'available' | 'busy' | 'unavailable';
  // Recruiter-specific
  company?: string;
  jobTitle?: string;
  // Settings
  isPrivate: boolean;
  allowMessages: 'everyone' | 'followers' | 'none';
  showOnlineStatus: boolean;
  showLastSeen: boolean;
}

export interface AuthState {
  user: UserProfile | null;
  session: any;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
}

// ---- Post Types ----
export type PostCategory = 
  | 'UI/UX' | 'Branding' | 'Illustration' | 'Typography' 
  | '3D Art' | 'Motion' | 'Photography' | 'Web Design'
  | 'App Design' | 'Logo Design' | 'Icon Design' | 'Other';

export type PostVisibility = 'public' | 'followers' | 'private';

export interface Post {
  id: string;
  userId: string;
  user: PostUser;
  title: string;
  description: string;
  images: string[];
  tags: string[];
  category: PostCategory;
  software: string[];
  style?: string;
  visibility: PostVisibility;
  likesCount: number;
  commentsCount: number;
  savesCount: number;
  sharesCount: number;
  viewsCount: number;
  isLiked: boolean;
  isSaved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PostUser {
  id: string;
  displayName: string;
  username: string;
  avatar: string;
  isVerified: boolean;
}

// ---- Comment Types ----
export interface Comment {
  id: string;
  postId: string;
  userId: string;
  user: PostUser;
  text: string;
  likesCount: number;
  isLiked: boolean;
  parentId?: string;
  replies?: Comment[];
  createdAt: string;
}

// ---- Chat Types ----
export interface ChatRoom {
  id: string;
  participants: ChatParticipant[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
  isMuted: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatParticipant {
  id: string;
  displayName: string;
  username: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: string;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  text?: string;
  image?: string;
  audio?: string;
  file?: { name: string; url: string; size: number };
  replyTo?: { id: string; text: string; senderName: string };
  isRead: boolean;
  isDelivered: boolean;
  reactions: Record<string, string[]>; // emoji -> userIds
  createdAt: string;
  isDeleted: boolean;
}

// ---- Notification Types ----
export type NotificationType = 
  | 'like' | 'comment' | 'follow' | 'mention' 
  | 'share' | 'message' | 'system' | 'milestone'
  | 'challenge' | 'trending' | 'gig_inquiry';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  userId: string;
  actorId?: string;
  actor?: PostUser;
  postId?: string;
  postImage?: string;
  chatId?: string;
  isRead: boolean;
  createdAt: string;
  data?: Record<string, any>;
}

// ---- Collection Types ----
export interface Collection {
  id: string;
  userId: string;
  name: string;
  description?: string;
  coverImage?: string;
  itemCount: number;
  isPublic: boolean;
  isCollaborative: boolean;
  collaborators?: string[];
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CollectionItem {
  id: string;
  collectionId: string;
  postId: string;
  post: Post;
  addedBy: string;
  note?: string;
  addedAt: string;
}

// ---- Challenge Types ----
export interface Challenge {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  category: PostCategory;
  startDate: string;
  endDate: string;
  votingEndDate: string;
  submissionsCount: number;
  status: 'upcoming' | 'active' | 'voting' | 'completed';
  prizes?: string[];
  rules?: string[];
  hostId: string;
  host: PostUser;
}

// ---- Event Types ----
export interface DesignEvent {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  type: 'webinar' | 'hackathon' | 'meetup' | 'workshop' | 'conference';
  date: string;
  endDate?: string;
  location?: string;
  isOnline: boolean;
  meetLink?: string;
  price: number;
  capacity: number;
  attendeesCount: number;
  hostId: string;
  host: PostUser;
  speakers?: PostUser[];
  isRSVP: boolean;
  tags: string[];
}

// ---- Gig / Freelance Types ----
export interface Gig {
  id: string;
  userId: string;
  user: PostUser;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  images: string[];
  pricing: {
    basic: { price: number; description: string; deliveryDays: number; revisions: number };
    standard: { price: number; description: string; deliveryDays: number; revisions: number };
    premium: { price: number; description: string; deliveryDays: number; revisions: number };
  };
  addOns?: { name: string; price: number }[];
  rating: number;
  reviewsCount: number;
  ordersCount: number;
  isActive: boolean;
  createdAt: string;
}

// ---- Analytics Types ----
export interface AnalyticsData {
  profileViews: number;
  profileViewsChange: number;
  totalLikes: number;
  totalLikesChange: number;
  totalSaves: number;
  totalSavesChange: number;
  followerGrowth: { date: string; count: number }[];
  topPosts: Post[];
  engagementRate: number;
  bestPostingTime: string;
  audienceLocations: { location: string; percentage: number }[];
}

// ---- Tutorial Types ----
export interface Tutorial {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  creatorId: string;
  creator: PostUser;
  category: PostCategory;
  software: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  steps: TutorialStep[];
  duration: number; // minutes
  likesCount: number;
  completionsCount: number;
  isFree: boolean;
  price?: number;
  tags: string[];
  createdAt: string;
}

export interface TutorialStep {
  id: string;
  title: string;
  content: string;
  image?: string;
  video?: string;
  order: number;
}

// ---- Navigation Params ----
export type RootStackParamList = {
  '(auth)': undefined;
  '(tabs)': undefined;
  'onboarding/welcome': undefined;
  'onboarding/features': undefined;
  'onboarding/role-select': undefined;
  'onboarding/profile-setup': undefined;
  'onboarding/skills': undefined;
  'post/[id]': { id: string };
  'profile/[username]': { username: string };
  'category/[id]': { id: string };
  'chat/chat-room': { chatId: string };
  'messages/[id]': { id: string };
  'modal/image-preview': { imageUrl: string };
  'modal/user-actions': { userId: string };
  'edit-profile': undefined;
  search: undefined;
  settings: undefined;
  analytics: undefined;
  followers: undefined;
  following: undefined;
  notifications: undefined;
  report: { targetId: string; targetType: 'post' | 'user' | 'comment' };
};
