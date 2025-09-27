import { z } from 'zod'

// Base schemas for common fields
export const BaseSchema = z.object({
  id: z.string(),
  created_at: z.string(),
  updated_at: z.string().optional(),
})

// Author schema
export const AuthorSchema = z.object({
  id: z.string(),
  full_name: z.string(),
  email: z.string().email().optional(),
  avatar_url: z.string().url().optional(),
  bio: z.string().optional(),
})

// Category schema
export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  color: z.string().optional(),
  website_domain: z.string().optional(),
  created_at: z.string(),
})

// Post schema with comprehensive validation
export const PostSchema = BaseSchema.extend({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  slug: z.string().min(1, 'Slug is required'),
  excerpt: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  featured_image: z.string().url().optional(),
  published: z.boolean().default(false),
  reading_time: z.number().min(1).optional(),
  author: AuthorSchema.optional(),
  category: CategorySchema.optional(),
  tags: z.array(z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
  })).default([]),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  canonical_url: z.string().url().optional(),
})

// API Response schemas
export const PostsResponseSchema = z.object({
  data: z.array(PostSchema),
  total: z.number(),
  page: z.number().optional(),
  limit: z.number().optional(),
  has_more: z.boolean().optional(),
})

export const SinglePostResponseSchema = z.object({
  data: PostSchema,
})

// Error response schema
export const ErrorResponseSchema = z.object({
  error: z.object({
    message: z.string(),
    code: z.string().optional(),
    details: z.any().optional(),
  }),
})

// API response wrapper that handles both success and error cases
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.discriminatedUnion('success', [
    z.object({
      success: z.literal(true),
      data: dataSchema,
    }),
    z.object({
      success: z.literal(false),
      error: ErrorResponseSchema.shape.error,
    }),
  ])

// Type exports
export type Author = z.infer<typeof AuthorSchema>
export type Category = z.infer<typeof CategorySchema>
export type Post = z.infer<typeof PostSchema>
export type PostsResponse = z.infer<typeof PostsResponseSchema>
export type SinglePostResponse = z.infer<typeof SinglePostResponseSchema>
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>

// Query parameter schemas
export const PostsQuerySchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  category: z.string().optional(),
  tag: z.string().optional(),
  search: z.string().optional(),
  author: z.string().optional(),
  published: z.boolean().default(true),
  sort: z.enum(['created_at', 'updated_at', 'title', 'reading_time']).default('created_at'),
  order: z.enum(['asc', 'desc']).default('desc'),
})

export type PostsQuery = z.infer<typeof PostsQuerySchema>