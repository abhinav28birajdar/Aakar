import { z } from 'zod';

// User validation schemas
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain uppercase, lowercase, and number'
  );

export const displayNameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name cannot exceed 50 characters')
  .regex(/^[a-zA-Z0-9\s_-]+$/, 'Name can only contain letters, numbers, spaces, underscores, and dashes');

export const urlSchema = z
  .string()
  .url('Invalid URL')
  .or(z.literal(''));

// Auth form schemas
export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  displayName: displayNameSchema,
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Profile validation schemas
export const profileSchema = z.object({
  displayName: displayNameSchema,
  bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
  website: urlSchema.optional(),
  location: z.string().max(100, 'Location cannot exceed 100 characters').optional(),
});

// Project validation schemas
export const projectSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title cannot exceed 100 characters'),
  description: z
    .string()
    .max(1000, 'Description cannot exceed 1000 characters')
    .optional(),
  categoryId: z.string().min(1, 'Category is required'),
  tags: z
    .array(z.string())
    .max(10, 'Maximum 10 tags allowed')
    .optional(),
  imageUrl: z.string().url('Invalid image URL'),
});

// Comment validation schema
export const commentSchema = z.object({
  content: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(500, 'Comment cannot exceed 500 characters'),
  projectId: z.string().min(1, 'Project ID is required'),
  parentId: z.string().optional(), // For replies
});

// Search validation schema
export const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
  category: z.string().optional(),
  sortBy: z.enum(['recent', 'popular', 'trending']).optional(),
  tags: z.array(z.string()).optional(),
});

// API Key validation schema (from api-keys.ts)
export const apiKeysSchema = z.object({
  supabaseUrl: z.string().url('Invalid Supabase URL'),
  supabaseAnonKey: z.string().min(1, 'Supabase anon key is required'),
  geminiApiKey: z.string().optional(),
  stripePublishableKey: z.string().optional(),
  firebaseConfig: z.object({
    apiKey: z.string(),
    authDomain: z.string(),
    projectId: z.string(),
    storageBucket: z.string(),
    messagingSenderId: z.string(),
    appId: z.string(),
  }).optional(),
});

// Contact/Report validation schema
export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: emailSchema,
  subject: z.string().min(1, 'Subject is required'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message cannot exceed 1000 characters'),
});

export const reportSchema = z.object({
  reason: z.enum(['spam', 'inappropriate', 'copyright', 'harassment', 'other']),
  description: z
    .string()
    .min(10, 'Please provide more details')
    .max(500, 'Description cannot exceed 500 characters'),
  resourceType: z.enum(['project', 'comment', 'user']),
  resourceId: z.string().min(1, 'Resource ID is required'),
});

// Settings validation schema
export const settingsSchema = z.object({
  notifications: z.object({
    push: z.boolean(),
    email: z.boolean(),
    likes: z.boolean(),
    comments: z.boolean(),
    follows: z.boolean(),
    features: z.boolean(),
  }),
  privacy: z.object({
    profileVisible: z.boolean(),
    showEmail: z.boolean(),
    showProjects: z.boolean(),
    allowMessages: z.boolean(),
  }),
  appearance: z.object({
    theme: z.enum(['light', 'dark', 'system']),
    reducedMotion: z.boolean(),
    fontSize: z.enum(['small', 'normal', 'large']),
  }),
});

// Type inference
export type SignInForm = z.infer<typeof signInSchema>;
export type SignUpForm = z.infer<typeof signUpSchema>;
export type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;
export type ProfileForm = z.infer<typeof profileSchema>;
export type ProjectForm = z.infer<typeof projectSchema>;
export type CommentForm = z.infer<typeof commentSchema>;
export type SearchForm = z.infer<typeof searchSchema>;
export type ContactForm = z.infer<typeof contactSchema>;
export type ReportForm = z.infer<typeof reportSchema>;
export type SettingsForm = z.infer<typeof settingsSchema>;

// Validation utility functions
export const validateEmail = (email: string): boolean => {
  return emailSchema.safeParse(email).success;
};

export const validatePassword = (password: string): boolean => {
  return passwordSchema.safeParse(password).success;
};

export const getPasswordStrength = (password: string): {
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score += 1;
  else feedback.push('At least 8 characters');

  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('One lowercase letter');

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('One uppercase letter');

  if (/\d/.test(password)) score += 1;
  else feedback.push('One number');

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
  else feedback.push('One special character');

  return { score, feedback };
};

// Sanitization functions
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const sanitizeHtml = (html: string): string => {
  return html
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Validation middleware for forms
export const createValidator = <T>(schema: z.ZodSchema<T>) => {
  return (data: unknown): { success: true; data: T } | { success: false; errors: Record<string, string[]> } => {
    const result = schema.safeParse(data);
    
    if (result.success) {
      return { success: true, data: result.data };
    }
    
    const errors: Record<string, string[]> = {};
    
    result.error.issues.forEach(issue => {
      const path = issue.path.join('.');
      if (!errors[path]) {
        errors[path] = [];
      }
      errors[path].push(issue.message);
    });
    
    return { success: false, errors };
  };
};