import { z } from 'zod';
import { DESIGN_CATEGORIES } from '../constants';

// Auth Schemas
export const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signUpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be at most 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  displayName: z.string()
    .min(2, 'Display name must be at least 2 characters')
    .max(50, 'Display name must be at most 50 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Profile Schemas
export const profileSetupSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be at most 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  displayName: z.string()
    .min(2, 'Display name must be at least 2 characters')
    .max(50, 'Display name must be at most 50 characters'),
  bio: z.string().max(250, 'Bio must be at most 250 characters').optional(),
  websiteUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  location: z.string().max(100, 'Location must be at most 100 characters').optional(),
  socialLinks: z.object({
    dribbble: z.string().url('Please enter a valid Dribbble URL').optional().or(z.literal('')),
    instagram: z.string().url('Please enter a valid Instagram URL').optional().or(z.literal('')),
    twitter: z.string().url('Please enter a valid Twitter URL').optional().or(z.literal('')),
    linkedin: z.string().url('Please enter a valid LinkedIn URL').optional().or(z.literal('')),
    behance: z.string().url('Please enter a valid Behance URL').optional().or(z.literal('')),
  }).optional(),
});

// Design Schemas
export const designUploadSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title must be at most 100 characters'),
  description: z.string()
    .max(2000, 'Description must be at most 2000 characters')
    .optional(),
  category: z.enum(DESIGN_CATEGORIES as [string, ...string[]]),
  tags: z.array(z.string())
    .min(1, 'Add at least one tag')
    .max(10, 'Maximum 10 tags allowed'),
  isPrivate: z.boolean(),
  isEditableByAI: z.boolean(),
  coverImageUri: z.string().min(1, 'Cover image is required'),
  otherImageUris: z.array(z.string()).optional(),
  videoPreviewUri: z.string().optional(),
  designFileUri: z.string().optional(),
  projectId: z.string().optional(),
});

// Product Schemas
export const productUploadSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters'),
  description: z.string()
    .min(1, 'Description is required')
    .max(2000, 'Description must be at most 2000 characters'),
  price: z.number()
    .min(0, 'Price must be 0 or greater')
    .max(999999.99, 'Price too high'),
  productType: z.enum(['file', 'font', 'brush', 'template']),
  coverImageUris: z.array(z.string())
    .min(1, 'At least one cover image is required'),
  productFileUri: z.string().min(1, 'Product file is required'),
  previewVideoUri: z.string().optional(),
  isAvailable: z.boolean(),
});

// Comment Schema
export const commentSchema = z.object({
  content: z.string()
    .min(1, 'Comment cannot be empty')
    .max(500, 'Comment must be at most 500 characters'),
  parentId: z.string().optional(),
});

// AI Panel Schema
export const aiPromptSchema = z.object({
  prompt: z.string()
    .min(3, 'Prompt must be at least 3 characters')
    .max(1000, 'Prompt must be at most 1000 characters'),
  stylePreset: z.string().optional(),
  resolution: z.enum(['standard', 'hd']).optional(),
});
