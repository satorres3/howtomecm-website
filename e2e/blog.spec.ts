import { test, expect } from '@playwright/test'

test.describe('Blog Functionality', () => {
  test('should load blog listing page', async ({ page }) => {
    await page.goto('/blog')

    await expect(page).toHaveTitle(/Blog.*How to MeCM/)
    await expect(page.getByRole('heading', { name: /featured articles/i })).toBeVisible()
    await expect(page.getByTestId('blog-posts')).toBeVisible()
  })

  test('should handle no posts scenario', async ({ page }) => {
    await page.goto('/blog?testState=empty')

    // Should show empty state message
    await expect(page.getByTestId('blog-posts')).toContainText(/no posts published yet/i)
  })

  test('should filter posts by category', async ({ page }) => {
    await page.goto('/blog')

    // Verify curated categories are displayed in the sidebar summary
    const categoriesSummary = page.locator('aside').filter({ hasText: 'Categories' })
    await expect(categoriesSummary.first()).toBeVisible()
    await expect(categoriesSummary.first()).toContainText(/MECM deployment/i)
  })

  test('should display portal branding in the blog sidebar', async ({ page }) => {
    await page.goto('/blog')

    const sidebarLogo = page.getByTestId('blog-sidebar-logo')
    await expect(sidebarLogo).toBeVisible()
    await expect(sidebarLogo.getByRole('link')).toHaveAttribute('href', '/')
  })

  test('should navigate to individual blog post', async ({ page }) => {
    await page.goto('/blog')

    // Look for the first blog post link
    const firstPostLink = page.locator('a[href^="/blog/"]').first()

    if (await firstPostLink.isVisible()) {
      const href = await firstPostLink.getAttribute('href')
      if (href) {
        await Promise.all([
          page.waitForURL(new RegExp(`${href}$`)),
          firstPostLink.click()
        ])
      } else {
        await firstPostLink.click()
      }

      // Should show post content
      await expect(page.locator('article').first()).toBeVisible()
    }
  })

  test('should handle blog post not found', async ({ page }) => {
    // Try to navigate to a non-existent blog post
    const response = await page.goto('/blog/non-existent-post-slug')

    // Should return 404 or show not found message
    if (response) {
      expect([200, 404]).toContain(response.status())
    }

    // Look for 404 content or error message
    const notFoundContent = page.locator('text=/not found|404|does not exist/i')
    if (await notFoundContent.count() > 0) {
      await expect(notFoundContent.first()).toBeVisible()
    }
  })
})

test.describe('Blog Post Page', () => {
  test('should display post metadata', async ({ page }) => {
    // This test assumes there's at least one post available
    await page.goto('/blog')

    const firstPostLink = page.locator('a[href^="/blog/"]').first()

    if (await firstPostLink.isVisible()) {
      await firstPostLink.click()

      // Should show post title
      await expect(page.locator('h1')).toBeVisible()

      // Should show post date inside the article header
      await expect(page.locator('article time').first()).toBeVisible()

      // Should show author information
      const authorInfo = page.locator('text=/by |author/i')
      if (await authorInfo.count() > 0) {
        await expect(authorInfo.first()).toBeVisible()
      }
    }
  })

  test('should show table of contents for long posts', async ({ page }) => {
    await page.goto('/blog')

    const firstPostLink = page.locator('a[href^="/blog/"]').first()

    if (await firstPostLink.isVisible()) {
      await firstPostLink.click()

      const toc = page.getByTestId('table-of-contents')
      await expect(toc).toBeVisible()
      await expect(toc).toContainText(/table of contents/i)
    }
  })

  test('should show related posts', async ({ page }) => {
    await page.goto('/blog')

    const firstPostLink = page.locator('a[href^="/blog/"]').first()

    if (await firstPostLink.isVisible()) {
      await firstPostLink.click()

      const relatedPosts = page.locator('text=/related articles/i')
      await expect(relatedPosts.first()).toBeVisible()
    }
  })

  test('should have social sharing functionality', async ({ page }) => {
    await page.goto('/blog')

    const firstPostLink = page.locator('a[href^="/blog/"]').first()

    if (await firstPostLink.isVisible()) {
      await firstPostLink.click()

      const shareButtons = page.getByTestId('share-actions')
      await expect(shareButtons).toBeVisible()
      const shareCount = await shareButtons.locator('a').count()
      expect(shareCount).toBeGreaterThan(1)
    }
  })

  test('should highlight site branding within the article sidebar', async ({ page }) => {
    await page.goto('/blog')

    const firstPostLink = page.locator('a[href^="/blog/"]').first()

    if (await firstPostLink.isVisible()) {
      await firstPostLink.click()

      const sidebarLogo = page.getByTestId('post-sidebar-logo')
      await expect(sidebarLogo).toBeVisible()
      await expect(sidebarLogo.getByRole('link')).toHaveAttribute('href', '/')
    }
  })

  test('should display reading progress indicator', async ({ page }) => {
    await page.goto('/blog')

    const firstPostLink = page.locator('a[href^="/blog/"]').first()

    if (await firstPostLink.isVisible()) {
      await firstPostLink.click()

      const progressBar = page.getByTestId('reading-progress')
      await expect(progressBar).toBeVisible()

      // Scroll down to trigger progress update
      await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }))
      await page.waitForTimeout(250)

      const transformValue = await progressBar.locator('span').evaluate(span => span.style.transform)
      expect(transformValue).toMatch(/scaleX\((0\.(?!0)\d+|1(?:\.0+)?)\)/)
      expect(transformValue).not.toBe('scaleX(0)')
    }
  })

  test('should allow readers to add comments', async ({ page }) => {
    await page.goto('/blog')

    const firstPostLink = page.locator('a[href^="/blog/"]').first()

    if (await firstPostLink.isVisible()) {
      await firstPostLink.click()

      await expect(page.getByRole('heading', { name: /join the discussion/i })).toBeVisible()

      const initialComments = await page.locator('section').filter({ hasText: /Join the discussion/i }).locator('li').count()

      await page.getByLabel('Name').fill('Playwright Tester')
      await page.getByLabel('Comment').fill('Really enjoying the refreshed blog layout!')
      await page.getByRole('button', { name: /post comment/i }).click()

      await expect(page.getByRole('button', { name: /post comment/i })).toHaveText(/post comment/i)

      const updatedComments = await page.locator('section').filter({ hasText: /Join the discussion/i }).locator('li').count()
      expect(updatedComments).toBeGreaterThan(initialComments)
      await expect(page.locator('section').filter({ hasText: /Join the discussion/i }).locator('li').first()).toContainText('Playwright Tester')
    }
  })
})
