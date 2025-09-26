# Component Documentation

This document provides detailed information about all available section components in the multi-tenant CMS template.

## ContentRenderer System

The `ContentRenderer` is the heart of the template's modular content system. It dynamically renders different section types based on CMS data.

### Usage
```tsx
import ContentRenderer from '@/components/ContentRenderer'

const sections = [
  {
    id: 'hero-1',
    type: 'hero',
    title: 'Welcome',
    // ... other props
  }
]

<ContentRenderer title="Page Title" sections={sections} />
```

## Available Section Types

### 1. HeroSection
**Type:** `hero`

Large banner section perfect for page headers and landing pages.

#### Props
```typescript
{
  id: string
  type: 'hero'
  title: string
  subtitle?: string
  description?: string
  backgroundImage?: string
  backgroundVideo?: string
  backgroundType?: 'image' | 'video' | 'gradient' | 'color'
  backgroundColor?: string
  gradient?: {
    from: string
    to: string
    direction?: string
  }
  textAlign?: 'left' | 'center' | 'right'
  textColor?: string
  buttons?: Array<{
    id: string
    text: string
    url: string
    type: 'primary' | 'secondary' | 'outline'
    target?: '_blank' | '_self'
  }>
  overlayOpacity?: number
  height?: 'screen' | 'large' | 'medium' | 'small'
  animation?: {
    enabled: boolean
    type?: 'fade' | 'slide' | 'zoom'
    delay?: number
  }
}
```

#### Example
```json
{
  "id": "hero-1",
  "type": "hero",
  "title": "Welcome to Our Website",
  "subtitle": "Building the Future",
  "description": "Discover amazing products and services",
  "backgroundType": "gradient",
  "gradient": {
    "from": "#3b82f6",
    "to": "#8b5cf6",
    "direction": "to bottom right"
  },
  "textColor": "white",
  "textAlign": "center",
  "height": "large",
  "buttons": [
    {
      "id": "btn-1",
      "text": "Get Started",
      "url": "/contact",
      "type": "primary"
    }
  ]
}
```

### 2. TextSection
**Type:** `text`

Rich text content with flexible layouts and styling options.

#### Props
```typescript
{
  id: string
  type: 'text'
  content: string
  title?: string
  subtitle?: string
  layout?: {
    width: 'full' | 'container' | 'narrow'
    textAlign: 'left' | 'center' | 'right'
    columns?: 1 | 2 | 3
  }
  styling?: {
    backgroundColor?: string
    textColor?: string
    fontSize?: 'small' | 'medium' | 'large'
    fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold'
    lineHeight?: 'tight' | 'normal' | 'relaxed' | 'loose'
  }
  padding?: {
    top?: 'none' | 'small' | 'medium' | 'large'
    bottom?: 'none' | 'small' | 'medium' | 'large'
  }
}
```

#### Example
```json
{
  "id": "text-1",
  "type": "text",
  "title": "About Our Company",
  "content": "<h2>Our Story</h2><p>We started with a simple mission...</p>",
  "layout": {
    "width": "narrow",
    "textAlign": "left"
  },
  "styling": {
    "fontSize": "medium",
    "lineHeight": "relaxed"
  }
}
```

### 3. FeatureGridSection
**Type:** `feature_grid`

Grid layout for showcasing features, services, or products.

#### Props
```typescript
{
  id: string
  type: 'feature_grid'
  title?: string
  subtitle?: string
  description?: string
  features: Array<{
    id: string
    title: string
    description: string
    icon?: {
      type: 'svg' | 'image' | 'emoji'
      content: string
    }
    image?: string
    link?: {
      url: string
      text: string
      target?: '_blank' | '_self'
    }
  }>
  layout: {
    columns: 2 | 3 | 4
    gap: 'small' | 'medium' | 'large'
    style: 'cards' | 'minimal' | 'bordered'
  }
  styling?: {
    backgroundColor?: string
    textColor?: string
    accentColor?: string
  }
  animation?: {
    enabled: boolean
    type?: 'fade' | 'slide' | 'stagger'
    delay?: number
  }
}
```

#### Example
```json
{
  "id": "features-1",
  "type": "feature_grid",
  "title": "Our Features",
  "subtitle": "Why Choose Us",
  "features": [
    {
      "id": "f1",
      "title": "Fast Performance",
      "description": "Lightning-fast loading times",
      "icon": {
        "type": "emoji",
        "content": "⚡"
      }
    },
    {
      "id": "f2",
      "title": "Secure",
      "description": "Enterprise-grade security",
      "icon": {
        "type": "emoji",
        "content": "🔒"
      }
    }
  ],
  "layout": {
    "columns": 2,
    "gap": "large",
    "style": "cards"
  }
}
```

### 4. TestimonialSection
**Type:** `testimonial` or `testimonials`

Customer testimonials and reviews.

#### Props
```typescript
{
  id: string
  type: 'testimonial' | 'testimonials'
  title?: string
  subtitle?: string
  description?: string
  testimonials: Array<{
    id: string
    text: string
    author: string
    role?: string
    company?: string
    avatar?: string
    rating?: number
  }>
  layout: {
    style: 'cards' | 'quotes' | 'carousel' | 'grid'
    columns?: 1 | 2 | 3
    showAvatars: boolean
    showRatings: boolean
  }
  styling?: {
    backgroundColor?: string
    textColor?: string
    accentColor?: string
  }
}
```

### 5. CallToActionSection
**Type:** `cta` or `call_to_action`

Call-to-action sections with buttons and compelling copy.

#### Props
```typescript
{
  id: string
  type: 'cta' | 'call_to_action'
  title: string
  subtitle?: string
  description?: string
  buttons: Array<{
    id: string
    text: string
    url: string
    type: 'primary' | 'secondary' | 'outline'
    target?: '_blank' | '_self'
  }>
  backgroundImage?: string
  backgroundVideo?: string
  backgroundType?: 'color' | 'gradient' | 'image' | 'video'
  backgroundColor?: string
  gradient?: {
    from: string
    to: string
    direction?: string
  }
  layout: {
    alignment: 'left' | 'center' | 'right'
    width: 'full' | 'container' | 'narrow'
    style: 'minimal' | 'boxed' | 'banner'
  }
  styling?: {
    textColor?: string
    overlayOpacity?: number
  }
}
```

### 6. VideoSection
**Type:** `video`

Video embedding with support for YouTube, Vimeo, and direct uploads.

#### Props
```typescript
{
  id: string
  type: 'video'
  title?: string
  description?: string
  videoUrl?: string
  videoType?: 'upload' | 'youtube' | 'vimeo' | 'embed'
  youtubeId?: string
  vimeoId?: string
  embedUrl?: string
  poster?: string
  caption?: string
  autoPlay?: boolean
  muted?: boolean
  controls?: boolean
  loop?: boolean
  layout: {
    width: 'full' | 'container' | 'narrow'
    aspectRatio: 'video' | 'square' | '4:3' | '21:9' | 'auto'
  }
  styling?: {
    borderRadius?: 'none' | 'small' | 'medium' | 'large'
    shadow?: 'none' | 'small' | 'medium' | 'large'
  }
}
```

### 7. ContactFormSection
**Type:** `contact_form` or `contact`

Dynamic contact forms with validation.

#### Props
```typescript
{
  id: string
  type: 'contact_form' | 'contact'
  title?: string
  subtitle?: string
  description?: string
  fields: Array<{
    id: string
    name: string
    label: string
    type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'radio'
    placeholder?: string
    required?: boolean
    options?: string[]
  }>
  submitButton: {
    text: string
    loadingText?: string
  }
  layout: {
    width: 'full' | 'container' | 'narrow'
    columns: 1 | 2
    style: 'minimal' | 'boxed' | 'bordered'
  }
  settings?: {
    action?: string
    method?: 'POST' | 'GET'
    successMessage?: string
    errorMessage?: string
  }
}
```

### 8. ImageSection
**Type:** `image`

Image display with captions and styling options.

#### Props
```typescript
{
  id: string
  type: 'image'
  url: string
  alt?: string
  caption?: string
  width?: number
  height?: number
  layout?: {
    width: 'full' | 'container' | 'narrow'
    alignment: 'left' | 'center' | 'right'
    aspectRatio?: 'auto' | 'square' | 'video' | '4:3' | '16:9'
  }
  styling?: {
    borderRadius?: 'none' | 'small' | 'medium' | 'large' | 'full'
    shadow?: 'none' | 'small' | 'medium' | 'large'
    border?: {
      enabled: boolean
      color?: string
      width?: string
    }
  }
}
```

### 9. Additional Sections

The template also includes these sections with basic implementations:

- **GallerySection** (`gallery`) - Image galleries
- **FAQSection** (`faq` | `faqs`) - Frequently asked questions
- **NewsletterSection** (`newsletter`) - Email subscription
- **StatsSection** (`stats` | `statistics`) - Statistics display
- **TeamSection** (`team`) - Team member profiles
- **PricingSection** (`pricing`) - Pricing tables
- **TimelineSection** (`timeline`) - Event timelines
- **BlogPostsSection** (`blog_posts` | `blog`) - Blog post listings

## Creating Custom Sections

### 1. Create Component File
```tsx
// src/components/sections/CustomSection.tsx
import React from 'react'

interface CustomSectionProps {
  data: {
    id: string
    type: 'custom'
    title?: string
    customProperty?: string
    // Add your properties here
  }
  className?: string
}

export default function CustomSection({ data, className = '' }: CustomSectionProps) {
  const { title, customProperty } = data

  return (
    <section className={`py-16 ${className}`}>
      <div className="container mx-auto px-6">
        {title && <h2 className="text-3xl font-bold mb-8">{title}</h2>}
        <div>
          {/* Your custom content here */}
          <p>{customProperty}</p>
        </div>
      </div>
    </section>
  )
}
```

### 2. Export in Index
```tsx
// src/components/sections/index.ts
export { default as CustomSection } from './CustomSection'
```

### 3. Register in ContentRenderer
```tsx
// In src/components/ContentRenderer.tsx
const sectionComponents = {
  // ... existing components
  CustomSection: dynamic(() => import('./sections/CustomSection'), { ssr: false })
}

const sectionTypeMap: Record<string, keyof typeof sectionComponents> = {
  // ... existing mappings
  'custom': 'CustomSection'
}
```

### 4. Use in CMS
```json
{
  "id": "custom-1",
  "type": "custom",
  "title": "My Custom Section",
  "customProperty": "Custom value"
}
```

## Best Practices

### 1. Component Structure
- Always use TypeScript interfaces for props
- Include className prop for additional styling
- Support responsive design with Tailwind classes
- Add proper ARIA labels for accessibility

### 2. Content Validation
- Validate required props with sensible defaults
- Handle missing or malformed data gracefully
- Provide helpful error messages

### 3. Styling
- Use Tailwind CSS classes consistently
- Support theme customization through CSS variables
- Ensure mobile-first responsive design
- Follow the existing design system

### 4. Performance
- Use dynamic imports for better code splitting
- Optimize images with Next.js Image component
- Implement proper loading states
- Use React.memo for expensive components

### 5. Accessibility
- Include proper heading hierarchy
- Add alt text for images
- Ensure keyboard navigation works
- Use semantic HTML elements

## Testing Components

### Unit Tests
```tsx
// __tests__/components/CustomSection.test.tsx
import { render, screen } from '@testing-library/react'
import CustomSection from '@/components/sections/CustomSection'

describe('CustomSection', () => {
  it('renders title correctly', () => {
    const data = {
      id: 'test',
      type: 'custom' as const,
      title: 'Test Title'
    }

    render(<CustomSection data={data} />)
    expect(screen.getByRole('heading', { name: 'Test Title' })).toBeInTheDocument()
  })
})
```

### Integration Tests
Test components within the ContentRenderer system to ensure proper integration.

## Troubleshooting

### Common Issues

**Component Not Rendering**
- Check that the component is registered in `sectionTypeMap`
- Verify the component is exported from `sections/index.ts`
- Ensure the `type` field matches exactly

**Styling Issues**
- Check Tailwind CSS classes are valid
- Verify CSS variables are being applied
- Use browser dev tools to debug styles

**TypeScript Errors**
- Ensure all required props are defined in the interface
- Check that the component props match the data structure
- Use proper type assertions where needed

**Performance Issues**
- Use dynamic imports for heavy components
- Implement proper memoization
- Optimize images and assets

This documentation should help you understand and extend the component system effectively. Each component is designed to be flexible, accessible, and performant while maintaining consistency across the platform.