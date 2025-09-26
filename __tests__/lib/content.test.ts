/**
 * @jest-environment node
 */

import { ContentLibrary } from '../../src/lib/content'

// Mock Supabase
jest.mock('../../src/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      single: jest.fn(),
      insert: jest.fn().mockReturnThis()
    })),
    rpc: jest.fn()
  }
}))

// Mock fetch for CMS API calls
global.fetch = jest.fn()

describe('ContentLibrary', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getAllPosts', () => {
    it('should return posts successfully', async () => {
      const mockPosts = [
        {
          id: '1',
          title: 'Test Post',
          slug: 'test-post',
          content: 'Test content',
          date: '2024-01-01',
          status: 'published'
        }
      ]

      const { supabase } = require('../../lib/supabase')
      supabase.from().select().eq().order().mockResolvedValue({
        data: mockPosts,
        error: null
      })

      const result = await ContentLibrary.getAllPosts('test.com')

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockPosts)
      expect(result.error).toBeNull()
    })

    it('should handle database errors gracefully', async () => {
      const mockError = { message: 'Database connection failed' }

      const { supabase } = require('../../lib/supabase')
      supabase.from().select().eq().order().mockResolvedValue({
        data: null,
        error: mockError
      })

      const result = await ContentLibrary.getAllPosts('test.com')

      expect(result.success).toBe(false)
      expect(result.data).toBeNull()
      expect(result.error).toContain('Failed to fetch posts')
    })
  })

  describe('getPostBySlug', () => {
    it('should return a single post by slug', async () => {
      const mockPost = {
        id: '1',
        title: 'Test Post',
        slug: 'test-post',
        content: 'Test content',
        date: '2024-01-01',
        status: 'published'
      }

      const { supabase } = require('../../lib/supabase')
      supabase.from().select().eq().single.mockResolvedValue({
        data: mockPost,
        error: null
      })

      const result = await ContentLibrary.getPostBySlug('test.com', 'test-post')

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockPost)
      expect(result.error).toBeNull()
    })

    it('should handle post not found', async () => {
      const mockError = { code: 'PGRST116' }

      const { supabase } = require('../../lib/supabase')
      supabase.from().select().eq().single.mockResolvedValue({
        data: null,
        error: mockError
      })

      const result = await ContentLibrary.getPostBySlug('test.com', 'nonexistent')

      expect(result.success).toBe(false)
      expect(result.data).toBeNull()
      expect(result.error).toBe('Post not found')
    })
  })

  describe('getSiteSettings', () => {
    it('should return site settings', async () => {
      const mockSettings = {
        domain: 'test.com',
        site_name: 'Test Site',
        tagline: 'Test Tagline'
      }

      const { supabase } = require('../../lib/supabase')
      supabase.from().select().eq().single.mockResolvedValue({
        data: mockSettings,
        error: null
      })

      const result = await ContentLibrary.getSiteSettings('test.com')

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockSettings)
    })

    it('should return default settings when none exist', async () => {
      const mockError = { code: 'PGRST116' }

      const { supabase } = require('../../lib/supabase')
      supabase.from().select().eq().single.mockResolvedValue({
        data: null,
        error: mockError
      })

      const result = await ContentLibrary.getSiteSettings('test.com')

      expect(result.success).toBe(true)
      expect(result.data.domain).toBe('test.com')
      expect(result.data.site_name).toContain('How to MeCM')
    })
  })

  describe('Cache functionality', () => {
    it('should cache results', async () => {
      const mockPosts = [{ id: '1', title: 'Test' }]

      const { supabase } = require('../../lib/supabase')
      supabase.from().select().eq().order().mockResolvedValue({
        data: mockPosts,
        error: null
      })

      // First call
      const result1 = await ContentLibrary.getAllPosts('test.com')
      // Second call should use cache
      const result2 = await ContentLibrary.getAllPosts('test.com')

      expect(result1.success).toBe(true)
      expect(result2.success).toBe(true)
      expect(result1.data).toEqual(result2.data)
    })

    it('should clear cache correctly', () => {
      ContentLibrary.clearCache('test.com')

      const stats = ContentLibrary.getCacheStats()
      const testDomainCacheEntries = stats.keys.filter(key => key.includes('test.com'))

      expect(testDomainCacheEntries).toHaveLength(0)
    })
  })
})