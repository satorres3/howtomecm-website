# How to MeCM - Website

This is the public website repository for howtomecm.com.
Built with Next.js and deployed to Vercel.

## Deployment Domains
- **Production:** howtomecm.com
- **Staging:** staging.howtomecm.com

## Project Structure
```
src/
├── app/                 # Next.js App Router
├── components/website/  # Website-specific components
├── lib/                # Utilities and content fetching
└── types/              # TypeScript types

api/                    # API routes (to be added)
├── public/             # Public API endpoints
└── webhooks/           # Build webhooks
```

## Content Source
Content is dynamically generated from the CMS at cms.howtomecm.com via:
- Supabase database queries
- Real-time updates via webhooks
- Static site generation with ISR

## Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run type-check   # Check TypeScript
```

## Deployment
- **Platform:** Vercel
- **Build Trigger:** Webhook from CMS
- **Content Source:** Supabase database
- **Updates:** Real-time via revalidation