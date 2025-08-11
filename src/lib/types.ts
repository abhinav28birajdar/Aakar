// In src/lib/types.ts
// Ensure this is synchronized with your Supabase schema definitions
// using `npx supabase gen types typescript --db-url <URL> --schema public > src/lib/types.ts` (manual sync).
// Or, if using a monorepo, symlink from a shared types folder.

export interface Database { /* ... generated types ... */ }

// Derived Types for convenience
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Design = Database['public']['Tables']['designs']['Row'];
export type Comment = Database['public']['Tables']['comments']['Row'];
export type Notification = Database['public']['Tables']['notifications']['Row'];
// ... define other row/insert/update types

// UI/API specific types
export interface AuthPayload { email: string; password?: string; displayName?: string; username?: string; /* etc. */ }
export interface DesignUploadPayload { title: string; description: string; category: string; tags: string[]; isPrivate: boolean; imageUris: string[]; coverImageUri: string; videoPreviewUri?: string; designFileUri?: string; /* etc. */ }
export interface AAResponse { transformedImageBase64?: string; message?: string; error?: string; }
// ... other interfaces as needed
