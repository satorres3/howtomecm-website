# Setup Guide

This guide will walk you through setting up your multi-tenant CMS website template from scratch.

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier available)
- Git installed
- Code editor (VS Code recommended)

## Step-by-Step Setup

### 1. Repository Setup

```bash
# Clone the repository
git clone <your-repository-url>
cd website-template

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local
```

### 2. Supabase Project Setup

1. **Create a new project** at [supabase.com](https://supabase.com)
2. **Get your credentials** from Project Settings → API
3. **Update your `.env.local`**:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   WEBSITE_DOMAIN=localhost:3000
   ```

### 3. Database Schema Setup

In your Supabase SQL Editor, run the following scripts:

#### Core Tables
```sql
-- Site settings for multi-tenant support
CREATE TABLE site_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  domain text UNIQUE NOT NULL,
  site_name text NOT NULL,
  tagline text,
  description text,
  logo_url text,
  author text,
  keywords text[],
  navigation jsonb DEFAULT '{"header": [], "footer": []}'::jsonb,
  social_links jsonb DEFAULT '[]'::jsonb,
  features jsonb DEFAULT '{"blog_enabled": true, "dark_mode_enabled": true}'::jsonb,
  contact_info jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Theme configuration
CREATE TABLE themes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  domain text UNIQUE NOT NULL,
  colors jsonb NOT NULL DEFAULT '{"primary": "#3b82f6", "secondary": "#8b5cf6"}'::jsonb,
  typography jsonb DEFAULT '{"font-family-primary": "Inter, sans-serif"}'::jsonb,
  layout jsonb DEFAULT '{"container-max-width": "1200px"}'::jsonb,
  components jsonb DEFAULT '{}'::jsonb,
  animations jsonb DEFAULT '{"duration": "300ms"}'::jsonb,
  breakpoints jsonb DEFAULT '{"sm": "640px", "md": "768px", "lg": "1024px"}'::jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Page content with sections
CREATE TABLE pages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  domain text NOT NULL,
  slug text NOT NULL,
  title text NOT NULL,
  sections jsonb DEFAULT '[]'::jsonb,
  seo jsonb,
  published boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  UNIQUE(domain, slug)
);

-- Blog posts (optional)
CREATE TABLE posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  domain text NOT NULL,
  slug text NOT NULL,
  title text NOT NULL,
  excerpt text,
  content text,
  featured_image text,
  sections jsonb DEFAULT '[]'::jsonb,
  author jsonb,
  category jsonb,
  tags jsonb DEFAULT '[]'::jsonb,
  seo jsonb,
  published boolean DEFAULT false,
  date timestamp with time zone DEFAULT timezone('utc'::text, now()),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  UNIQUE(domain, slug)
);
```

#### Row Level Security
```sql
-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public read access" ON themes FOR SELECT USING (true);
CREATE POLICY "Public read published pages" ON pages FOR SELECT USING (published = true);
CREATE POLICY "Public read published posts" ON posts FOR SELECT USING (published = true);
```

#### Indexes for Performance
```sql
-- Create indexes for better performance
CREATE INDEX idx_site_settings_domain ON site_settings(domain);
CREATE INDEX idx_themes_domain ON themes(domain);
CREATE INDEX idx_pages_domain_slug ON pages(domain, slug);
CREATE INDEX idx_pages_published ON pages(published);
CREATE INDEX idx_posts_domain_slug ON posts(domain, slug);
CREATE INDEX idx_posts_published ON posts(published);
CREATE INDEX idx_posts_date ON posts(date DESC);
```

### 4. Initial Data Setup

Insert your first site configuration:

```sql
-- Insert site settings
INSERT INTO site_settings (domain, site_name, tagline, description, navigation, social_links, features)
VALUES (
  'localhost:3000', -- or your domain
  'My Website',
  'A Modern CMS-Driven Website',
  'Built with Next.js and Supabase for ultimate flexibility',
  '{
    "header": [
      {"name": "Home", "url": "/", "enabled": true},
      {"name": "About", "url": "/about", "enabled": true},
      {"name": "Blog", "url": "/blog", "enabled": true},
      {"name": "Contact", "url": "/contact", "enabled": true}
    ],
    "footer": [
      {"name": "Privacy Policy", "url": "/privacy", "enabled": true},
      {"name": "Terms of Service", "url": "/terms", "enabled": true}
    ]
  }',
  '[
    {"platform": "twitter", "url": "https://twitter.com/example", "enabled": true},
    {"platform": "linkedin", "url": "https://linkedin.com/company/example", "enabled": true},
    {"platform": "github", "url": "https://github.com/example", "enabled": true}
  ]',
  '{"blog_enabled": true, "dark_mode_enabled": true}'
);

-- Insert default theme
INSERT INTO themes (domain, colors, typography, layout)
VALUES (
  'localhost:3000', -- or your domain
  '{
    "primary": "#3b82f6",
    "secondary": "#8b5cf6",
    "accent": "#f59e0b",
    "background": "#ffffff",
    "surface": "#f8fafc",
    "text-primary": "#1f2937",
    "text-secondary": "#6b7280",
    "border": "#e5e7eb",
    "success": "#10b981",
    "warning": "#f59e0b",
    "error": "#ef4444"
  }',
  '{
    "font-family-primary": "Inter, system-ui, sans-serif",
    "font-family-secondary": "system-ui, sans-serif",
    "font-size-base": "16px",
    "font-size-sm": "14px",
    "font-size-lg": "18px",
    "font-size-xl": "20px",
    "line-height-base": "1.5",
    "line-height-tight": "1.25",
    "line-height-relaxed": "1.75"
  }',
  '{
    "container-max-width": "1200px",
    "spacing-unit": "1rem",
    "border-radius-base": "0.5rem",
    "border-radius-lg": "1rem",
    "shadow-sm": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    "shadow-md": "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    "shadow-lg": "0 10px 15px -3px rgb(0 0 0 / 0.1)"
  }'
);

-- Insert a sample homepage
INSERT INTO pages (domain, slug, title, sections, published)
VALUES (
  'localhost:3000',
  '',
  'Welcome to My Website',
  '[
    {
      "id": "hero-1",
      "type": "hero",
      "title": "Welcome to My Amazing Website",
      "subtitle": "Building the Future",
      "description": "This is a modern, CMS-driven website built with Next.js and Supabase.",
      "backgroundType": "gradient",
      "gradient": {"from": "#3b82f6", "to": "#8b5cf6"},
      "textColor": "white",
      "textAlign": "center",
      "height": "large",
      "buttons": [
        {
          "id": "btn-1",
          "text": "Get Started",
          "url": "/about",
          "type": "primary"
        },
        {
          "id": "btn-2",
          "text": "Learn More",
          "url": "/blog",
          "type": "outline"
        }
      ]
    },
    {
      "id": "features-1",
      "type": "feature_grid",
      "title": "Key Features",
      "subtitle": "What makes us different",
      "description": "Discover the powerful features that make our platform unique.",
      "features": [
        {
          "id": "f1",
          "title": "CMS-Driven",
          "description": "Manage all content through our intuitive CMS interface.",
          "icon": {"type": "emoji", "content": "⚡"}
        },
        {
          "id": "f2",
          "title": "Fully Responsive",
          "description": "Looks great on all devices, from mobile to desktop.",
          "icon": {"type": "emoji", "content": "📱"}
        },
        {
          "id": "f3",
          "title": "SEO Optimized",
          "description": "Built-in SEO optimization for better search rankings.",
          "icon": {"type": "emoji", "content": "🔍"}
        }
      ],
      "layout": {"columns": 3, "gap": "large", "style": "cards"}
    },
    {
      "id": "cta-1",
      "type": "cta",
      "title": "Ready to Get Started?",
      "description": "Join thousands of satisfied customers who trust our platform.",
      "buttons": [
        {
          "id": "cta-btn-1",
          "text": "Contact Us",
          "url": "/contact",
          "type": "primary"
        }
      ],
      "backgroundType": "color",
      "backgroundColor": "#f8fafc",
      "layout": {"alignment": "center", "width": "container", "style": "minimal"}
    }
  ]',
  true
);

-- Insert a sample blog post
INSERT INTO posts (domain, slug, title, excerpt, content, author, category, tags, published)
VALUES (
  'localhost:3000',
  'welcome-to-our-blog',
  'Welcome to Our Blog',
  'This is our first blog post. Learn about what makes our platform special and how you can get the most out of it.',
  '<h2>Getting Started</h2><p>Welcome to our blog! This is where we share insights, tips, and updates about our platform.</p><h2>What to Expect</h2><p>We will regularly publish articles about:</p><ul><li>Platform updates and new features</li><li>Best practices and tips</li><li>Industry insights</li><li>Customer success stories</li></ul><p>Stay tuned for more content!</p>',
  '{"full_name": "Admin User", "email": "admin@example.com"}',
  '{"name": "General", "slug": "general"}',
  '["welcome", "getting-started", "blog"]',
  true
);
```

### 5. Development Server

```bash
# Start the development server
npm run dev

# Open your browser to http://localhost:3000
```

You should now see your website with:
- A hero section with gradient background
- A features grid with three items
- A call-to-action section
- A working blog at `/blog`

### 6. Customization

#### Update Site Settings
```sql
UPDATE site_settings
SET
  site_name = 'Your Site Name',
  tagline = 'Your Tagline',
  description = 'Your description',
  logo_url = 'https://your-domain.com/logo.png'
WHERE domain = 'localhost:3000';
```

#### Update Theme Colors
```sql
UPDATE themes
SET colors = jsonb_set(colors, '{primary}', '"#your-color"')
WHERE domain = 'localhost:3000';
```

#### Add More Pages
```sql
INSERT INTO pages (domain, slug, title, sections, published)
VALUES (
  'localhost:3000',
  'about',
  'About Us',
  '[
    {
      "id": "about-hero",
      "type": "hero",
      "title": "About Our Company",
      "subtitle": "Our Story",
      "description": "Learn about our mission and values.",
      "backgroundType": "color",
      "backgroundColor": "#f8fafc",
      "textColor": "#1f2937",
      "height": "medium"
    },
    {
      "id": "about-text",
      "type": "text",
      "content": "<h2>Our Mission</h2><p>We are dedicated to providing the best possible experience for our customers...</p>",
      "layout": {"width": "narrow", "textAlign": "left"}
    }
  ]',
  true
);
```

## Multi-Tenant Setup

To add additional websites to the same codebase:

### 1. Environment Variables
Add your new domain to the environment:
```env
WEBSITE_DOMAIN=newsite.com
```

### 2. Database Records
```sql
-- Add site settings for new domain
INSERT INTO site_settings (domain, site_name, tagline, description, ...)
VALUES ('newsite.com', 'New Site', 'New Tagline', '...');

-- Add theme for new domain
INSERT INTO themes (domain, colors, typography, layout, ...)
VALUES ('newsite.com', '{"primary": "#different-color"}', '...', '...');

-- Add pages for new domain
INSERT INTO pages (domain, slug, title, sections, published, ...)
VALUES ('newsite.com', '', 'New Site Home', '[...]', true);
```

### 3. DNS Setup
Point your new domain to your deployment platform (Vercel, etc.)

The same codebase will now serve different content based on the domain!

## Production Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production
```env
WEBSITE_DOMAIN=yourdomain.com
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NODE_ENV=production
```

## Testing Your Setup

Run the test suite to ensure everything is working:
```bash
npm run test
npm run test:integration
npm run test:e2e
```

## Troubleshooting

### Common Issues

**Database Connection Issues**
- Verify your Supabase URL and key
- Check that RLS policies are set correctly
- Ensure tables exist with correct names

**Styling Issues**
- Check that your theme configuration is valid JSON
- Verify CSS variables are being applied
- Check browser console for errors

**Content Not Showing**
- Ensure `published` is set to `true`
- Verify domain matches exactly (including port for localhost)
- Check that sections JSON is valid

### Getting Help

- Check the [main README](README.md) for detailed documentation
- Review the [component documentation](src/components/sections/README.md)
- Look at the example data in your database
- Open an issue if you encounter bugs

## Next Steps

Once your site is running:
1. Customize your theme colors and typography
2. Add your content and pages
3. Configure your navigation and social links
4. Set up your domain and SSL
5. Add analytics and monitoring

Congratulations! You now have a fully functional, CMS-driven website. 🎉