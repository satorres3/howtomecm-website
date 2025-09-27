export interface SiteNavigationItem {
  id: string
  label: string
  href: string
  url?: string
  order: number
  target?: '_self' | '_blank'
  is_active?: boolean
}

export interface SiteNavigationConfig {
  primary: SiteNavigationItem[]
  secondary: SiteNavigationItem[]
}

export interface HomepageCta {
  label: string
  href: string
  style?: 'primary' | 'outline'
  external?: boolean
}

export interface HomepageVideoHighlight {
  title: string
  description: string
  url: string
  duration?: string
  topic?: string
}

export interface HomepageContent {
  hero: {
    badge: string
    heading: string
    subtitle: string
    primaryCta: HomepageCta
    secondaryCta?: HomepageCta
  }
  latestPosts: {
    heading: string
    subtitle: string
    cta: HomepageCta
  }
  videoHighlights: HomepageVideoHighlight[]
  ctaPanel: {
    heading: string
    body: string
    primaryCta: HomepageCta
    secondaryCta?: HomepageCta
  }
  seo?: {
    title?: string
    description?: string
  }
}

export interface BlogPageContent {
  hero: {
    badge: string
    title: string
    subtitle: string
    primaryCta: HomepageCta
    secondaryCta?: HomepageCta
  }
  emptyState: {
    title: string
    body: string
    cta: HomepageCta
  }
}

export interface AboutPageContent {
  hero: {
    logo: string
    name: string
    title: string
    location: string
    experience: string
  }
  story: {
    heading: string
    paragraphs: string[]
    origin: {
      logo: string
      title: string
      body: string
      stats: Array<{ label: string; value: string }>
    }
  }
  expertise: Array<{
    icon: string
    title: string
    description: string
  }>
  connect: {
    heading: string
    body: string
    links: Array<{
      id: string
      label: string
      description: string
      url: string
      background: string
    }>
    footer: string
  }
}

export interface ContactFormField {
  id: string
  label: string
  type: 'text' | 'email' | 'textarea' | 'select'
  required?: boolean
  placeholder?: string
  options?: string[]
}

export interface ContactPageContent {
  hero: {
    title: string
    subtitle: string
  }
  methods: Array<{
    id: string
    title: string
    description: string
    action?: {
      label: string
      href: string
    }
    links?: Array<{
      label: string
      href: string
    }>
    icon: 'email' | 'network' | string
  }>
  form: {
    title: string
    description: string
    fields: ContactFormField[]
    consent: string
    submit: string
  }
}

export interface FooterContent {
  intro: {
    heading: string
    body: string
    primaryCta: HomepageCta
    secondaryCta?: HomepageCta
  }
}

export interface TaxonomyItem {
  id: string
  name: string
  slug: string
  description?: string
  website_domain?: string
  created_at?: string
  icon?: string
  accent?: {
    from: string
    to: string
  }
}
