import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load the homepage successfully', async ({ page }) => {
    await page.goto('/')

    // Check if the page loads without throwing an error
    await expect(page).toHaveTitle(/How to MeCM/)
  })

  test('should display main navigation', async ({ page }) => {
    await page.goto('/')

    // Check for main navigation links
    await expect(page.locator('nav')).toBeVisible()
    let blogLink = page.locator('nav a:visible').filter({ hasText: /blog/i }).first()
    let aboutLink = page.locator('nav a:visible').filter({ hasText: /about/i }).first()

    if (!(await blogLink.count()) || !(await aboutLink.count())) {
      const mobileMenuButton = page.locator('button[aria-label*="mobile menu"]').first()
      if (await mobileMenuButton.count()) {
        await mobileMenuButton.click()
        await page.waitForTimeout(200)
      }
      blogLink = page.locator('nav a:visible').filter({ hasText: /blog/i }).first()
      aboutLink = page.locator('nav a:visible').filter({ hasText: /about/i }).first()
    }

    await expect(blogLink).toBeVisible()
    await expect(aboutLink).toBeVisible()
  })

  test('should display dark mode toggle', async ({ page }) => {
    await page.goto('/')

    // Look for dark mode toggle button
    let darkModeToggle = page.locator('button[aria-label*="mode"]:visible').first()

    if (!(await darkModeToggle.count())) {
      const mobileMenuButton = page.locator('button[aria-label*="mobile menu"]').first()
      if (await mobileMenuButton.count()) {
        await mobileMenuButton.click()
      }
      darkModeToggle = page.locator('button[aria-label*="mode"]:visible').first()
    }

    await expect(darkModeToggle).toBeVisible()
  })

  test('should toggle dark mode', async ({ page }) => {
    await page.goto('/')

    // Find and click the dark mode toggle
    let darkModeToggle = page.locator('button[aria-label*="mode"]:visible').first()

    if (!(await darkModeToggle.count())) {
      const mobileMenuButton = page.locator('button[aria-label*="mobile menu"]').first()
      if (await mobileMenuButton.count()) {
        await mobileMenuButton.click()
      }
      darkModeToggle = page.locator('button[aria-label*="mode"]:visible').first()
    }

    // Check initial state (should be light mode)
    await expect(page.locator('html')).toHaveClass(/light/)

    // Click to toggle to dark mode
    await darkModeToggle.click()

    // Check that dark mode is now active
    await expect(page.locator('html')).toHaveClass(/dark/)

    // Click again to toggle back to light mode
    await darkModeToggle.click()

    // Check that light mode is active again
    await expect(page.locator('html')).toHaveClass(/light/)
  })

  test('should handle CMS error gracefully', async ({ page }) => {
    // Mock network error for CMS requests
    await page.route('**/api/**', route => {
      route.fulfill({
        status: 500,
        contentType: 'text/plain',
        body: 'Internal Server Error'
      })
    })

    await page.goto('/')

    // Should show error page or fallback content, not crash
    // The specific behavior depends on your error handling implementation
    await expect(page.locator('body')).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Check that the page renders properly on mobile
    await expect(page.locator('body')).toBeVisible()

    // Check if mobile navigation works (hamburger menu, etc.)
    // This depends on your specific mobile navigation implementation
  })

  test('should surface the video library section', async ({ page }) => {
    await page.goto('/')

    const videoLibrary = page.getByTestId('video-library')
    await expect(videoLibrary).toBeVisible()

    const videoCards = page.getByTestId('video-card')
    await expect(videoCards).toHaveCount(3)
    await expect(videoCards.first()).toContainText(/watch now/i)
  })

  test('should show the community call to action', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: /what should we explore next/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /suggest a topic/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /follow the video updates/i })).toHaveAttribute('target', '_blank')
  })
})

test.describe('Accessibility', () => {
  test('should have proper heading structure', async ({ page }) => {
    await page.goto('/')

    // Check for h1 heading
    const h1 = page.locator('h1')
    await expect(h1).toBeVisible()

    // Ensure there's only one h1
    await expect(h1).toHaveCount(1)
  })

  test('should have alt text for images', async ({ page }) => {
    await page.goto('/')

    // Get all images and check they have alt attributes
    const images = await page.locator('img').all()

    for (const image of images) {
      const altText = await image.getAttribute('alt')
      expect(altText).toBeTruthy()
    }
  })

  test('should have proper link accessibility', async ({ page }) => {
    await page.goto('/')

    // Check that all links have accessible names
    const links = await page.locator('a').all()

    for (const link of links) {
      const accessibleName = await link.textContent()
      const ariaLabel = await link.getAttribute('aria-label')
      const title = await link.getAttribute('title')

      // Link should have either text content, aria-label, or title
      expect(accessibleName || ariaLabel || title).toBeTruthy()
    }
  })
})
