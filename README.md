# How to MeCM - Professional Microsoft Technology Blog

A modern, professional blog platform focused on Microsoft Configuration Manager (MECM), Azure cloud technologies, and enterprise IT solutions.

## Features

- Azure blog-inspired design
- Responsive layout with modern UI components
- Content management system integration
- Professional article templates with reading time
- Search functionality
- Category and tag filtering
- SEO optimization

## Technology Stack

- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- Supabase (CMS backend)

## Getting Started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run type-check
```

## Environment Variables

Copy `.env.local.example` to `.env.local` and configure:

- `WEBSITE_DOMAIN`: Your domain name
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_ANON_KEY`: Supabase anonymous key

## Content Management

This blog integrates with a Supabase-powered CMS for dynamic content management. Articles, categories, and metadata are managed through the CMS interface.

