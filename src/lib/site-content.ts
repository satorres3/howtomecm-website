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
  keywords: ['Microsoft Intune', 'Microsoft Endpoint Manager', 'Configuration Manager', 'Device management'],
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
  secondary: [{ id: 'privacy', label: 'Privacy Policy', href: '/privacy', order: 1, target: '_self' }],
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

function readJsonFile(relativePath: string): unknown {
  const filePath = path.join(contentRoot, relativePath)
  if (!fs.existsSync(filePath)) {
    return null
  }

  const fileContents = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(fileContents)
}

function loadWithSchema<T>(relativePath: string, schema: z.ZodType<T>, fallback: T): T {
  try {
    const raw = readJsonFile(relativePath)
    if (!raw) {
      return fallback
    }

    return schema.parse(raw)
  } catch (error) {
    console.warn(`Failed to load ${relativePath}:`, error)
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
  const settings = loadWithSchema('site/settings.json', SiteSettingsSchema, defaultSiteSettingsSource)
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

export function loadCategories(): TaxonomyItem[] {
  return loadWithSchema('taxonomy/categories.json', z.array(TaxonomyItemSchema), [])
}

export function loadTags(): TaxonomyItem[] {
  return loadWithSchema('taxonomy/tags.json', z.array(TaxonomyItemSchema), [])
}
