# CMS Integration Setup Guide

This guide shows you how to connect your howtomecm-website to your MyCMS for full dynamic content management.

## 🎯 What You'll Get

After this setup, you'll be able to:
- ✅ Create/edit pages via CMS → appears on website instantly
- ✅ Create/edit blog posts → appears on website instantly
- ✅ Upload media files → available on website instantly
- ✅ Manage categories and tags → filters work on website
- ✅ Handle form submissions → data goes to CMS
- ✅ Real-time updates via webhooks

## 🚀 Quick Setup (5 minutes)

### Step 1: Copy Environment Variables

Copy your `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

The file already contains your correct Supabase credentials and CMS URLs.

### Step 2: Deploy to Vercel

```bash
# Connect to Vercel (one time)
npx vercel

# Deploy
npm run build
npx vercel --prod
```

### Step 3: Configure Webhook in MyCMS

1. Go to your MyCMS at https://mycms-admin.vercel.app
2. Navigate to Settings → Webhooks
3. Add webhook URL: `https://your-website.vercel.app/api/revalidate`
4. Set secret: `your_webhook_secret` (same as in .env.local)

### Step 4: Test the Integration

1. **Create a test page in CMS:**
   - Go to MyCMS → Pages → New Page
   - Title: "Test Page"
   - Slug: "test-page"
   - Status: Published
   - Save

2. **Check your website:**
   - Visit: `https://your-website.vercel.app/test-page`
   - Should display your new page immediately

## 🔧 Environment Variables Reference

```env
# Required - Supabase Connection
NEXT_PUBLIC_SUPABASE_URL=https://cqzfwnyhxmmasjannfvx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Required - CMS Integration
CMS_API_URL=https://mycms-admin.vercel.app/api
NEXT_PUBLIC_CMS_URL=https://mycms-admin.vercel.app

# Required - Domain Configuration
WEBSITE_DOMAIN=howtomecm.com
NEXT_PUBLIC_WEBSITE_DOMAIN=howtomecm.com

# Optional - Webhook Security
WEBHOOK_SECRET=your_webhook_secret

# Required - Enable CMS Features
ENABLE_CMS_INTEGRATION=true
NEXT_PUBLIC_ENABLE_CMS_INTEGRATION=true
```

## 📋 Available CMS Features

### Content Management
- **Pages:** Static pages (About, Contact, Services, etc.)
- **Posts:** Blog articles with categories and tags
- **Media:** Image/file uploads with CDN delivery
- **Categories:** Content organization
- **Tags:** Content tagging system

### Interactive Features
- **Comments:** Moderated comment system
- **Forms:** Contact forms with submissions
- **Search:** Full-text search across content

### Advanced Features
- **SEO:** Meta titles, descriptions, keywords
- **Multi-language:** Translation support
- **Scheduling:** Publish content at specific times
- **Drafts:** Save work without publishing

## 🛠️ API Usage Examples

### Fetch Pages
```typescript
import { getAllPages } from '../lib/content'

const pagesResult = await getAllPages('howtomecm.com')
if (pagesResult.success) {
  const pages = pagesResult.data
  // Use pages data
}
```

### Fetch Posts with Categories
```typescript
import { getAllPosts } from '../lib/content'

const postsResult = await getAllPosts('howtomecm.com')
if (postsResult.success) {
  const posts = postsResult.data
  // Each post includes category and tag data
}
```

### Upload Media
```typescript
import { uploadMediaViaCMS } from '../lib/content'

const fileInput = document.getElementById('file')
const file = fileInput.files[0]

const result = await uploadMediaViaCMS(file, 'howtomecm.com')
if (result.success) {
  const mediaUrl = result.data.url
  // Use media URL
}
```

### Submit Form
```typescript
import { submitForm } from '../lib/content'

const formData = {
  name: 'John Doe',
  email: 'john@example.com',
  message: 'Hello from the website!'
}

const result = await submitForm('contact-form-id', formData)
if (result.success) {
  // Form submitted successfully
}
```

## 🔄 Webhook Integration

Your website automatically updates when content changes in the CMS via webhooks:

1. **Content Updated in CMS** → Webhook triggered
2. **Webhook hits** `/api/revalidate` → Next.js cache cleared
3. **Next page load** → Fresh content displayed

### Webhook Events
- `page.created` → Revalidates `/` and `/sitemap.xml`
- `page.updated` → Revalidates specific page and homepage
- `post.created` → Revalidates `/blog` and `/sitemap.xml`
- `post.updated` → Revalidates specific post and blog index
- `media.uploaded` → Clears media cache
- `settings.updated` → Revalidates entire site

## 🏗️ Development Workflow

### Local Development
1. **Start CMS locally:**
   ```bash
   cd MyCMS
   npm run dev # Runs on http://localhost:5173
   ```

2. **Update website env for local CMS:**
   ```env
   CMS_API_URL=http://localhost:5173/api
   NEXT_PUBLIC_CMS_URL=http://localhost:5173
   ```

3. **Start website:**
   ```bash
   cd howtomecm-website
   npm run dev # Runs on http://localhost:3000
   ```

### Production Deployment
1. **Deploy CMS:** Already deployed at https://mycms-admin.vercel.app
2. **Deploy Website:** Uses production CMS URLs automatically
3. **Configure Webhooks:** Point to production website URL

## 🚨 Troubleshooting

### Content Not Appearing
1. **Check environment variables** - Ensure all required vars are set
2. **Verify domain filtering** - Content must have `website_domain = 'howtomecm.com'`
3. **Check publish status** - Content must be `status = 'published'`
4. **Clear cache** - Try force refresh (Ctrl+F5) or clear cache

### Media Not Loading
1. **Check Supabase storage** - Verify files uploaded correctly
2. **Check file permissions** - Ensure files are publicly accessible
3. **Verify URLs** - Check media URLs in CMS match website requests

### Forms Not Submitting
1. **Check form configuration** - Verify form ID matches CMS
2. **Check CORS settings** - Ensure API allows website domain
3. **Check error logs** - Look in browser console and Vercel logs

### Webhooks Not Working
1. **Verify webhook URL** - Must be publicly accessible
2. **Check webhook secret** - Must match between CMS and website
3. **Check CMS webhook config** - Ensure enabled and properly configured

## 📞 Support

If you need help:
1. Check the browser console for errors
2. Check Vercel deployment logs
3. Verify all environment variables are set correctly
4. Ensure your CMS is accessible and running

The integration is designed to work out of the box with minimal configuration. Most issues are related to environment variables or domain configuration.