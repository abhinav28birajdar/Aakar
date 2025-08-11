// src/lib/utils/validation.ts
import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
});

export const profileSetupSchema = z.object({
  username: z.string().min(3),
  displayName: z.string().min(1),
  bio: z.string().optional(),
});

export const designUploadSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  tags: z.array(z.string()),
  isPrivate: z.boolean(),
  imageUris: z.array(z.string()),
  coverImageUri: z.string(),
});

export const commentSchema = z.object({
  text: z.string().min(1),
});
