/**
 * @jest-environment node
 */

import { ContentLibrary } from '../../src/lib/content'

// Mock database functions
jest.mock('../../src/lib/database', () => ({
  getPostsFromDatabase: jest.fn(),
  getPostBySlugFromDatabase: jest.fn(),
  getSiteSettingsFromDatabase: jest.fn(),
  checkDatabaseConnection: jest.fn().mockResolvedValue(true),
  withDatabaseErrorHandling: jest.fn((fn) => fn())
}))

// Mock fetch for fallback content
global.fetch = jest.fn()

describe('ContentLibrary', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getAllPosts', () => {
    it('should return posts successfully from database', async () => {
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

      const { getPostsFromDatabase } = require('../../src/lib/database')
      getPostsFromDatabase.mockResolvedValue({
        data: mockPosts,
        error: null
      })

      const result = await ContentLibrary.getAllPosts('test.com')

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockPosts)
      expect(result.error).toBeNull()
    })

    it('should handle database errors gracefully', async () => {
      const mockError = 'Database connection failed'

      const { getPostsFromDatabase } = require('../../src/lib/database')
      getPostsFromDatabase.mockResolvedValue({
        data: null,
        error: mockError
      })

      const result = await ContentLibrary.getAllPosts('test.com')

      expect(result.success).toBe(false)
      expect(result.data).toBeNull()
      expect(result.error).toContain('Failed to fetch posts')
    })

    it('should fallback to demo content when database fails', async () => {
      const { getPostsFromDatabase } = require('../../src/lib/database')
      getPostsFromDatabase.mockResolvedValue({
        data: null,
        error: 'Connection failed'
      })

      const result = await ContentLibrary.getAllPosts('test.com')

      // Should still return data (demo content) even when database fails
      expect(result.data).toBeDefined()
      expect(Array.isArray(result.data)).toBe(true)
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

      const { getPostBySlugFromDatabase } = require('../../src/lib/database')
      getPostBySlugFromDatabase.mockResolvedValue({
        data: mockPost,
        error: null
      })

      const result = await ContentLibrary.getPostBySlug('test.com', 'test-post')

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockPost)
      expect(result.error).toBeNull()
    })

    it('should handle post not found', async () => {
      const { getPostBySlugFromDatabase } = require('../../src/lib/database')
      getPostBySlugFromDatabase.mockResolvedValue({
        data: null,
        error: 'Post not found'
      })

      const result = await ContentLibrary.getPostBySlug('test.com', 'nonexistent')

      expect(result.success).toBe(false)
      expect(result.data).toBeNull()
      expect(result.error).toBe('Post not found')
    })
  })

  describe('getSiteSettings', () => {
    it('should return site settings from database', async () => {
      const mockSettings = {
        domain: 'test.com',
        site_name: 'Test Site',
        tagline: 'Test Tagline'
      }

      const { getSiteSettingsFromDatabase } = require('../../src/lib/database')
      getSiteSettingsFromDatabase.mockResolvedValue({
        data: mockSettings,
        error: null
      })

      const result = await ContentLibrary.getSiteSettings('test.com')

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockSettings)
    })

    it('should return default settings when database fails', async () => {
      const { getSiteSettingsFromDatabase } = require('../../src/lib/database')
      getSiteSettingsFromDatabase.mockResolvedValue({
        data: null,
        error: 'Settings not found'
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

      const { getPostsFromDatabase } = require('../../src/lib/database')
      getPostsFromDatabase.mockResolvedValue({
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

      // Database should only be called once due to caching
      expect(getPostsFromDatabase).toHaveBeenCalledTimes(1)
    })

    it('should clear cache correctly', () => {
      ContentLibrary.clearCache('test.com')

      const stats = ContentLibrary.getCacheStats()
      const testDomainCacheEntries = stats.keys.filter(key => key.includes('test.com'))

      expect(testDomainCacheEntries).toHaveLength(0)
    })
  })
})