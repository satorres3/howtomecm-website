import fs from 'fs'
import path from 'path'
import { z } from 'zod'

import type { SiteSettings, SiteSocialLinkItem, SiteSocialLinkRecord } from '@/types/site'
import type {
  AboutPageContent,
  BlogPageContent,
  ContactFormField,
  ContactPageContent,
  FooterContent,
  HomepageContent,
  HomepageCta,
  SiteNavigationConfig,
  SiteNavigationItem,
  TaxonomyItem,
} from '@/types/site-content'

const contentRoot = path.join(process.cwd(), 'content')

const SiteSettingsSchema = z.object({
  domain: z.string(),
  site_name: z.string(),
  tagline: z.string(),
  description: z.string(),
  logo: z
    .object({
      url: z.string(),
      alt: z.string(),
      width: z.number().optional(),
      height: z.number().optional(),
    })
    .optional(),
  colors: z
    .object({
      primary: z.string(),
      secondary: z.string(),
    })
    .optional(),
  social_links: z
    .union([
      z.array(
        z.object({
          platform: z.string(),
          url: z.string(),
          enabled: z.boolean().optional(),
        })
      ),
      z.record(z.string(), z.string()),
    ])
    .optional(),
  author: z.string().optional(),
  keywords: z.array(z.string()).optional(),
})

const NavigationSchema = z.object({
  primary: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
        href: z.string(),
        order: z.number(),
        target: z.enum(['_self', '_blank']).optional(),
      })
    )
    .default([]),
  secondary: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
        href: z.string(),
        order: z.number(),
        target: z.enum(['_self', '_blank']).optional(),
      })
    )
    .default([]),
})

const HomepageContentSchema: z.ZodType<HomepageContent> = z.object({
  hero: z.object({
    badge: z.string(),
    heading: z.string(),
    subtitle: z.string(),
    primaryCta: z.object({
      label: z.string(),
      href: z.string(),
      style: z.enum(['primary', 'outline']).optional(),
      external: z.boolean().optional(),
    }),
    secondaryCta: z
      .object({
        label: z.string(),
        href: z.string(),
        style: z.enum(['primary', 'outline']).optional(),
        external: z.boolean().optional(),
      })
      .optional(),
  }),
  latestPosts: z.object({
    heading: z.string(),
    subtitle: z.string(),
    cta: z.object({
      label: z.string(),
      href: z.string(),
      style: z.enum(['primary', 'outline']).optional(),
      external: z.boolean().optional(),
    }),
  }),
  videoHighlights: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
        url: z.string(),
        duration: z.string().optional(),
        topic: z.string().optional(),
      })
    )
    .default([]),
  ctaPanel: z.object({
    heading: z.string(),
    body: z.string(),
    primaryCta: z.object({
      label: z.string(),
      href: z.string(),
      style: z.enum(['primary', 'outline']).optional(),
      external: z.boolean().optional(),
    }),
    secondaryCta: z
      .object({
        label: z.string(),
        href: z.string(),
        style: z.enum(['primary', 'outline']).optional(),
        external: z.boolean().optional(),
      })
      .optional(),
  }),
  seo: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
    })
    .optional(),
})

const BlogContentSchema: z.ZodType<BlogPageContent> = z.object({
  hero: z.object({
    badge: z.string(),
    title: z.string(),
    subtitle: z.string(),
    primaryCta: z.object({
      label: z.string(),
      href: z.string(),
    }),
    secondaryCta: z
      .object({
        label: z.string(),
        href: z.string(),
      })
      .optional(),
  }),
  emptyState: z.object({
    title: z.string(),
    body: z.string(),
    cta: z.object({
      label: z.string(),
      href: z.string(),
    }),
  }),
})

const AboutContentSchema: z.ZodType<AboutPageContent> = z.object({
  hero: z.object({
    logo: z.string(),
    name: z.string(),
    title: z.string(),
    location: z.string(),
    experience: z.string(),
  }),
  story: z.object({
    heading: z.string(),
    paragraphs: z.array(z.string()),
    origin: z.object({
      logo: z.string(),
      title: z.string(),
      body: z.string(),
      stats: z.array(
        z.object({
          label: z.string(),
          value: z.string(),
        })
      ),
    }),
  }),
  expertise: z.array(
    z.object({
      icon: z.string(),
      title: z.string(),
      description: z.string(),
    })
  ),
  connect: z.object({
    heading: z.string(),
    body: z.string(),
    links: z.array(
      z.object({
        id: z.string(),
        label: z.string(),
        description: z.string(),
        url: z.string(),
        background: z.string(),
      })
    ),
    footer: z.string(),
  }),
})

const ContactFieldSchema: z.ZodType<ContactFormField> = z.object({
  id: z.string(),
  label: z.string(),
  type: z.enum(['text', 'email', 'textarea', 'select']),
  required: z.boolean().optional(),
  placeholder: z.string().optional(),
  options: z.array(z.string()).optional(),
})

const ContactContentSchema: z.ZodType<ContactPageContent> = z.object({
  hero: z.object({
    title: z.string(),
    subtitle: z.string(),
  }),
  methods: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      action: z
        .object({
          label: z.string(),
          href: z.string(),
        })
        .optional(),
      links: z
        .array(
          z.object({
            label: z.string(),
            href: z.string(),
          })
        )
        .optional(),
      icon: z.string(),
    })
  ),
  form: z.object({
    title: z.string(),
    description: z.string(),
    fields: z.array(ContactFieldSchema),
    consent: z.string(),
    submit: z.string(),
  }),
})

const FooterContentSchema: z.ZodType<FooterContent> = z.object({
  intro: z.object({
    heading: z.string(),
    body: z.string(),
    primaryCta: z.object({
      label: z.string(),
      href: z.string(),
      style: z.enum(['primary', 'outline']).optional(),
      external: z.boolean().optional(),
    }),
    secondaryCta: z
      .object({
        label: z.string(),
        href: z.string(),
        style: z.enum(['primary', 'outline']).optional(),
        external: z.boolean().optional(),
      })
      .optional(),
  }),
})

const defaultSiteSettingsSource = {
  domain: 'staging.howtomecm.com',
  site_name: 'How to MeCM',
  tagline: 'Endpoint management knowledge hub',
  description:
    'Deep technical guides, lab notes, and deployment experiments for Microsoft endpoint administrators.',
  logo: {
    url: '/images/branding/portal-logo.svg',
    alt: 'How to MeCM logo',
    width: 56,
    height: 56,
  },
  colors: {
    primary: '#0ea5e9',
    secondary: '#6366f1',
  },
  social_links: [
    { platform: 'youtube', url: 'https://youtube.com/@howtomecm', enabled: true },
    { platform: 'linkedin', url: 'https://linkedin.com/in/sauloalvestorres', enabled: true },
  ],
  author: 'How to MeCM Team',
  keywords: [
    'Microsoft Intune',
    'Microsoft Endpoint Manager',
    'Configuration Manager',
    'Device management',
  ],
} satisfies z.infer<typeof SiteSettingsSchema>

const defaultSiteSettings: SiteSettings = {
  ...defaultSiteSettingsSource,
  social_links: normalizeSocialLinks(defaultSiteSettingsSource.social_links),
}

const defaultNavigation: SiteNavigationConfig = {
  primary: [
    { id: 'home', label: 'Home', href: '/', order: 1, target: '_self' },
    { id: 'blog', label: 'Blog', href: '/blog', order: 2, target: '_self' },
    { id: 'about', label: 'About', href: '/about', order: 3, target: '_self' },
    { id: 'contact', label: 'Contact', href: '/contact', order: 4, target: '_self' },
  ],
  secondary: [
    { id: 'privacy', label: 'Privacy Policy', href: '/privacy', order: 1, target: '_self' },
  ],
}

const defaultHomepageContent: HomepageContent = {
  hero: {
    badge: 'How to MeCM Knowledge Base',
    heading: 'Endpoint management knowledge center',
    subtitle:
      'Hands-on guides, lab notes, and deployment experiments for Microsoft endpoint administrators.',
    primaryCta: { label: 'Explore the latest guides', href: '/blog', style: 'primary' },
    secondaryCta: {
      label: 'Watch the lab sessions',
      href: 'https://youtube.com/@howtomecm',
      style: 'outline',
      external: true,
    },
  },
  latestPosts: {
    heading: 'Latest field notes',
    subtitle:
      'Configuration walkthroughs and automation experiments pulled straight from enterprise deployments.',
    cta: { label: 'Explore all articles', href: '/blog' },
  },
  videoHighlights: [],
  ctaPanel: {
    heading: 'Need a configuration walkthrough for your next rollout?',
    body: 'Tell us about the deployment blockers or automation challenges you want covered next and we will add it to the editorial backlog.',
    primaryCta: { label: 'Request a walkthrough', href: '/contact' },
    secondaryCta: { label: 'Read the blog', href: '/blog' },
  },
  seo: {
    title: 'How to MeCM – Endpoint management knowledge hub',
    description:
      'Deep technical guides, walkthroughs, and community resources for Microsoft endpoint teams.',
  },
}

const defaultBlogContent: BlogPageContent = {
  hero: {
    badge: 'How to MeCM Blog',
    title: 'Latest insights from the How to MeCM team',
    subtitle:
      'Deep dives, configuration walkthroughs, and battle-tested guidance for Microsoft Endpoint Configuration Manager, Intune, Azure, and the modern workplace.',
    primaryCta: { label: 'Back to homepage', href: '/' },
    secondaryCta: { label: 'Jump to latest insights', href: '#latest' },
  },
  emptyState: {
    title: 'Need a deep dive that is not here yet?',
    body: 'Tell us about the deployment blockers or automation challenges you want covered next.',
    cta: { label: 'Request a walkthrough', href: '/contact' },
  },
}

const defaultAboutContent: AboutPageContent = {
  hero: {
    logo: 'https://assets.zyrosite.com/A0xw0LoMOVtarQa0/how-to-mk3zRRxqrQFyKNnl.gif',
    name: 'Saulo Alves Torres',
    title: 'Microsoft Technology Expert & IT Consultant',
    location: 'Global Remote',
    experience: '15+ Years Experience',
  },
  story: {
    heading: 'My Journey in Technology',
    paragraphs: [],
    origin: {
      logo: 'https://assets.zyrosite.com/A0xw0LoMOVtarQa0/how-to-mk3zRRxqrQFyKNnl.gif',
      title: 'How to MeCM',
      body: 'Born from the need to demystify Microsoft Configuration Manager and share practical solutions with the IT community.',
      stats: [],
    },
  },
  expertise: [],
  connect: {
    heading: "Let's Connect",
    body: '',
    links: [],
    footer: '',
  },
}

const defaultContactContent: ContactPageContent = {
  hero: {
    title: 'Get in touch with our experts',
    subtitle:
      'Whether you need Microsoft Configuration Manager consulting, Azure migration guidance, or PowerShell automation solutions, our team of certified experts is here to help.',
  },
  methods: [],
  form: {
    title: 'Send us a message',
    description: "Tell us about your project and we'll get back to you within 24 hours.",
    fields: [],
    consent:
      'By submitting this form, you agree to our privacy policy and consent to being contacted about your inquiry.',
    submit: 'Submit message',
  },
}

const defaultFooterContent: FooterContent = {
  intro: {
    heading: 'Build reliable Microsoft endpoint experiences.',
    body: 'Weekly guides and lab notes that help MECM, Intune, and automation teams ship with confidence.',
    primaryCta: { label: 'Explore the blog', href: '/blog' },
    secondaryCta: { label: 'Suggest a topic', href: '/contact' },
  },
}

/**
 * Enhanced JSON file reader with comprehensive error handling and validation
 * @param relativePath Path relative to content root
 * @returns Parsed JSON data or null if reading/parsing fails
 */
function readJsonFile(relativePath: string): {
  data: unknown | null
  success: boolean
  error?: string
} {
  if (!relativePath || typeof relativePath !== 'string') {
    return { data: null, success: false, error: 'Invalid file path provided' }
  }

  try {
    const filePath = path.join(contentRoot, relativePath)

    // Security check: ensure the path is within content root
    const resolvedPath = path.resolve(filePath)
    const resolvedContentRoot = path.resolve(contentRoot)
    if (!resolvedPath.startsWith(resolvedContentRoot)) {
      return { data: null, success: false, error: 'Path traversal attempt blocked' }
    }

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return { data: null, success: false, error: 'File not found' }
    }

    // Check file size (prevent memory exhaustion)
    const stats = fs.statSync(filePath)
    const maxFileSize = 10 * 1024 * 1024 // 10MB limit
    if (stats.size > maxFileSize) {
      return { data: null, success: false, error: 'File too large (>10MB)' }
    }

    // Read file with encoding validation
    const fileContents = fs.readFileSync(filePath, 'utf8')

    // Validate content is not empty
    if (!fileContents.trim()) {
      return { data: null, success: false, error: 'File is empty' }
    }

    // Enhanced JSON parsing with detailed error reporting
    try {
      const parsed = JSON.parse(fileContents)
      return { data: parsed, success: true }
    } catch (parseError) {
      const errorMessage =
        parseError instanceof Error
          ? `JSON parsing failed: ${parseError.message}`
          : 'JSON parsing failed: Unknown error'

      // Log parse error in development for debugging
      if (process.env.NODE_ENV === 'development') {
        console.warn(`JSON parse error in ${relativePath}:`, errorMessage)
      }

      return { data: null, success: false, error: errorMessage }
    }
  } catch (fileError) {
    const errorMessage =
      fileError instanceof Error
        ? `File reading failed: ${fileError.message}`
        : 'File reading failed: Unknown error'

    // Log file error in development for debugging
    if (process.env.NODE_ENV === 'development') {
      console.warn(`File read error for ${relativePath}:`, errorMessage)
    }

    return { data: null, success: false, error: errorMessage }
  }
}

/**
 * Enhanced schema-based JSON loader with comprehensive validation and error handling
 * @param relativePath Path relative to content root
 * @param schema Zod schema for validation
 * @param fallback Fallback value if loading/validation fails
 * @returns Validated data or fallback
 */
function loadWithSchema<T>(relativePath: string, schema: z.ZodType<T>, fallback: T): T {
  if (!relativePath || typeof relativePath !== 'string') {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Invalid path provided for schema loading: ${relativePath}`)
    }
    return fallback
  }

  try {
    const result = readJsonFile(relativePath)

    if (!result.success) {
      // File reading failed - use fallback
      if (process.env.NODE_ENV === 'development' && result.error !== 'File not found') {
        console.warn(`Failed to read ${relativePath}: ${result.error}`)
      }
      return fallback
    }

    if (!result.data) {
      // No data to parse
      return fallback
    }

    try {
      // Validate data against schema
      const validated = schema.parse(result.data)
      return validated
    } catch (validationError) {
      // Schema validation failed
      if (process.env.NODE_ENV === 'development') {
        if (validationError instanceof z.ZodError) {
          console.warn(`Schema validation failed for ${relativePath}:`, {
            issues: validationError.issues.map(issue => ({
              path: issue.path.join('.'),
              message: issue.message,
              code: issue.code,
            })),
          })
        } else {
          console.warn(`Schema validation failed for ${relativePath}:`, validationError)
        }
      }
      return fallback
    }
  } catch (unexpectedError) {
    // Unexpected error during processing
    const errorMessage =
      unexpectedError instanceof Error ? unexpectedError.message : 'Unknown error'

    if (process.env.NODE_ENV === 'development') {
      console.warn(`Unexpected error loading ${relativePath}: ${errorMessage}`)
    }

    return fallback
  }
}

function normalizeSocialLinks(
  links?: SiteSocialLinkRecord | SiteSocialLinkItem[] | Record<string, unknown>
): SiteSocialLinkRecord | undefined {
  if (!links) {
    return undefined
  }

  if (Array.isArray(links)) {
    return links.reduce<SiteSocialLinkRecord>((acc, link) => {
      if (link.enabled === false) {
        return acc
      }

      if (link.platform && link.url) {
        acc[link.platform] = link.url
      }
      return acc
    }, {})
  }

  return Object.entries(links).reduce<SiteSocialLinkRecord>((acc, [platform, value]) => {
    if (typeof value === 'string' && value.trim() !== '') {
      acc[platform] = value
    }
    return acc
  }, {})
}

export function loadSiteSettings(): SiteSettings {
  const settings = loadWithSchema(
    'site/settings.json',
    SiteSettingsSchema,
    defaultSiteSettingsSource
  )
  const { social_links, ...rest } = settings
  const normalized = normalizeSocialLinks(social_links ?? defaultSiteSettingsSource.social_links)
  return {
    ...rest,
    social_links: normalized,
  }
}

export function loadNavigation(): SiteNavigationConfig {
  const navigation = loadWithSchema('site/navigation.json', NavigationSchema, defaultNavigation)

  const sortByOrder = (items: SiteNavigationItem[]) => [...items].sort((a, b) => a.order - b.order)

  return {
    primary: sortByOrder(navigation.primary),
    secondary: sortByOrder(navigation.secondary),
  }
}

export function loadHomepageContent(): HomepageContent {
  return loadWithSchema('site/homepage.json', HomepageContentSchema, defaultHomepageContent)
}

export function loadBlogPageContent(): BlogPageContent {
  return loadWithSchema('site/blog.json', BlogContentSchema, defaultBlogContent)
}

export function loadAboutPageContent(): AboutPageContent {
  return loadWithSchema('pages/about.json', AboutContentSchema, defaultAboutContent)
}

export function loadContactPageContent(): ContactPageContent {
  return loadWithSchema('pages/contact.json', ContactContentSchema, defaultContactContent)
}

export function loadFooterContent(): FooterContent {
  return loadWithSchema('site/footer.json', FooterContentSchema, defaultFooterContent)
}

const TaxonomyItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  website_domain: z.string().optional(),
  created_at: z.string().optional(),
  icon: z.string().optional(),
  accent: z
    .object({
      from: z.string(),
      to: z.string(),
    })
    .optional(),
})

/**
 * Enhanced categories loader with taxonomy mapping guards and validation
 * @returns Array of validated category items with required fields
 */
export function loadCategories(): TaxonomyItem[] {
  const rawCategories = loadWithSchema('taxonomy/categories.json', z.array(TaxonomyItemSchema), [])

  // Filter categories to ensure required fields are present
  const validCategories = rawCategories.filter(category => {
    const isValid = Boolean(
      category.id &&
        category.name &&
        category.slug &&
        typeof category.id === 'string' &&
        typeof category.name === 'string' &&
        typeof category.slug === 'string'
    )

    if (!isValid && process.env.NODE_ENV === 'development') {
      console.warn('Filtered out invalid category:', {
        id: category.id || 'missing',
        name: category.name || 'missing',
        slug: category.slug || 'missing',
      })
    }

    return isValid
  })

  // Check for duplicate slugs and IDs
  const seenSlugs = new Set<string>()
  const seenIds = new Set<string>()
  const deduplicatedCategories = validCategories.filter(category => {
    if (seenSlugs.has(category.slug) || seenIds.has(category.id)) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Filtered out duplicate category: ${category.slug} (${category.id})`)
      }
      return false
    }

    seenSlugs.add(category.slug)
    seenIds.add(category.id)
    return true
  })

  if (
    process.env.NODE_ENV === 'development' &&
    deduplicatedCategories.length !== rawCategories.length
  ) {
    console.info(
      `Loaded ${deduplicatedCategories.length} valid categories (filtered ${rawCategories.length - deduplicatedCategories.length} invalid/duplicate items)`
    )
  }

  return deduplicatedCategories
}

/**
 * Enhanced tags loader with taxonomy mapping guards and validation
 * @returns Array of validated tag items with required fields
 */
export function loadTags(): TaxonomyItem[] {
  const rawTags = loadWithSchema('taxonomy/tags.json', z.array(TaxonomyItemSchema), [])

  // Filter tags to ensure required fields are present
  const validTags = rawTags.filter(tag => {
    const isValid = Boolean(
      tag.id &&
        tag.name &&
        tag.slug &&
        typeof tag.id === 'string' &&
        typeof tag.name === 'string' &&
        typeof tag.slug === 'string'
    )

    if (!isValid && process.env.NODE_ENV === 'development') {
      console.warn('Filtered out invalid tag:', {
        id: tag.id || 'missing',
        name: tag.name || 'missing',
        slug: tag.slug || 'missing',
      })
    }

    return isValid
  })

  // Check for duplicate slugs and IDs
  const seenSlugs = new Set<string>()
  const seenIds = new Set<string>()
  const deduplicatedTags = validTags.filter(tag => {
    if (seenSlugs.has(tag.slug) || seenIds.has(tag.id)) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Filtered out duplicate tag: ${tag.slug} (${tag.id})`)
      }
      return false
    }

    seenSlugs.add(tag.slug)
    seenIds.add(tag.id)
    return true
  })

  if (process.env.NODE_ENV === 'development' && deduplicatedTags.length !== rawTags.length) {
    console.info(
      `Loaded ${deduplicatedTags.length} valid tags (filtered ${rawTags.length - deduplicatedTags.length} invalid/duplicate items)`
    )
  }

  return deduplicatedTags
}

/**
 * Comprehensive content file validation utilities
 */

/**
 * Validates content file existence and accessibility
 * @param relativePath Path relative to content root
 * @returns Validation result with detailed information
 */
export function validateContentFile(relativePath: string): {
  exists: boolean
  accessible: boolean
  size?: number
  error?: string
  recommendations?: string[]
} {
  const recommendations: string[] = []

  try {
    if (!relativePath || typeof relativePath !== 'string') {
      return {
        exists: false,
        accessible: false,
        error: 'Invalid file path provided',
        recommendations: ['Provide a valid string path'],
      }
    }

    const filePath = path.join(contentRoot, relativePath)

    // Security check: ensure the path is within content root
    const resolvedPath = path.resolve(filePath)
    const resolvedContentRoot = path.resolve(contentRoot)
    if (!resolvedPath.startsWith(resolvedContentRoot)) {
      return {
        exists: false,
        accessible: false,
        error: 'Path traversal attempt blocked',
        recommendations: ['Use paths relative to content root only'],
      }
    }

    // Check existence
    if (!fs.existsSync(filePath)) {
      recommendations.push(`Create file at: ${relativePath}`)
      recommendations.push('Ensure the file path is correct')
      return {
        exists: false,
        accessible: false,
        error: 'File does not exist',
        recommendations,
      }
    }

    // Check accessibility and get file stats
    const stats = fs.statSync(filePath)

    // Check if it's a file (not a directory)
    if (!stats.isFile()) {
      return {
        exists: true,
        accessible: false,
        error: 'Path points to a directory, not a file',
        recommendations: ['Ensure the path points to a file'],
      }
    }

    // Check file size
    const maxFileSize = 50 * 1024 * 1024 // 50MB limit
    if (stats.size > maxFileSize) {
      recommendations.push('Consider reducing file size for better performance')
    }

    if (stats.size === 0) {
      recommendations.push('File is empty - consider adding content')
    }

    // Check file extension
    const ext = path.extname(relativePath).toLowerCase()
    if (!['.json', '.md', '.mdx', '.txt'].includes(ext)) {
      recommendations.push(`Unusual file extension: ${ext}`)
    }

    return {
      exists: true,
      accessible: true,
      size: stats.size,
      recommendations: recommendations.length > 0 ? recommendations : undefined,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return {
      exists: false,
      accessible: false,
      error: `File validation error: ${errorMessage}`,
      recommendations: ['Check file permissions and path validity'],
    }
  }
}

/**
 * Validates taxonomy relationships in content
 * @param content Content with potential taxonomy references
 * @returns Validation result with relationship status
 */
export function validateTaxonomyRelationships(content: {
  category_slug?: string
  tags?: Array<{ slug: string }>
}): {
  isValid: boolean
  issues: string[]
  warnings: string[]
} {
  const issues: string[] = []
  const warnings: string[] = []

  try {
    const categories = loadCategories()
    const tags = loadTags()

    // Validate category relationship
    if (content.category_slug) {
      const categoryExists = categories.some(cat => cat.slug === content.category_slug)
      if (!categoryExists) {
        issues.push(`Referenced category not found: ${content.category_slug}`)
      }
    }

    // Validate tag relationships
    if (content.tags && Array.isArray(content.tags)) {
      for (const tag of content.tags) {
        if (!tag || typeof tag.slug !== 'string') {
          issues.push('Invalid tag structure - missing slug')
          continue
        }

        const tagExists = tags.some(t => t.slug === tag.slug)
        if (!tagExists) {
          warnings.push(`Referenced tag not found: ${tag.slug}`)
        }
      }
    }

    return {
      isValid: issues.length === 0,
      issues,
      warnings,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return {
      isValid: false,
      issues: [`Taxonomy validation error: ${errorMessage}`],
      warnings: [],
    }
  }
}

/**
 * Comprehensive content directory validation
 * @returns Overall content structure health report
 */
export function validateContentStructure(): {
  isHealthy: boolean
  summary: {
    totalFiles: number
    validFiles: number
    invalidFiles: number
    categories: number
    tags: number
  }
  issues: string[]
  recommendations: string[]
} {
  const issues: string[] = []
  const recommendations: string[] = []

  try {
    // Check content root exists
    if (!fs.existsSync(contentRoot)) {
      return {
        isHealthy: false,
        summary: { totalFiles: 0, validFiles: 0, invalidFiles: 0, categories: 0, tags: 0 },
        issues: ['Content root directory does not exist'],
        recommendations: ['Create content directory structure'],
      }
    }

    // Load and validate taxonomy
    const categories = loadCategories()
    const tags = loadTags()

    // Check critical files
    const criticalFiles = [
      'site/settings.json',
      'site/navigation.json',
      'taxonomy/categories.json',
      'taxonomy/tags.json',
    ]

    let validFiles = 0
    let invalidFiles = 0

    for (const file of criticalFiles) {
      const validation = validateContentFile(file)
      if (validation.exists && validation.accessible) {
        validFiles++
      } else {
        invalidFiles++
        issues.push(`Critical file missing or inaccessible: ${file}`)
      }
    }

    // Additional recommendations
    if (categories.length === 0) {
      recommendations.push('Consider adding categories for better content organization')
    }

    if (tags.length === 0) {
      recommendations.push('Consider adding tags for enhanced content discovery')
    }

    const totalFiles = criticalFiles.length
    const isHealthy = issues.length === 0 && validFiles === totalFiles

    return {
      isHealthy,
      summary: {
        totalFiles,
        validFiles,
        invalidFiles,
        categories: categories.length,
        tags: tags.length,
      },
      issues,
      recommendations,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return {
      isHealthy: false,
      summary: { totalFiles: 0, validFiles: 0, invalidFiles: 0, categories: 0, tags: 0 },
      issues: [`Content structure validation error: ${errorMessage}`],
      recommendations: ['Check content directory permissions and structure'],
    }
  }
}
