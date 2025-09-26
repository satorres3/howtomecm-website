# How to MeCM Portal

A knowledge portal for Microsoft endpoint management featuring guides, tutorials, and best practices for Intune, MECM, and modern workplace technologies.

## Features

- 📚 **Technical Guides**: In-depth tutorials for Microsoft endpoint technologies
- 🚀 **Modern Stack**: Built with Next.js 15, React 19, and TypeScript
- 📱 **Responsive Design**: Optimized for all devices with Tailwind CSS
- 🔍 **SEO Optimized**: Built-in SEO features for better discoverability
- ♿ **Accessible**: WCAG compliant with comprehensive accessibility features
- ⚡ **Fast Performance**: Optimized for speed with modern web technologies

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Neon
- **Deployment**: Vercel-ready configuration
- **Testing**: Jest, Playwright E2E tests

## Quick Start

1. **Clone and install**:
   ```bash
   git clone <repository-url>
   cd howtomecm-portal
   npm install
   ```

2. **Environment setup**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **View the portal**:
   Open [http://localhost:3000](http://localhost:3000)

## Content Structure

The portal currently features two template blog posts that demonstrate the content structure:

- **Microsoft Edge Configuration**: Guide for configuring Edge homepage and start page via Intune
- **Security Copilot Updates**: Coverage of RBAC updates and identity controls for vulnerability remediation

These posts serve as templates for future content creation.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks
- `npm run test` - Run Jest tests
- `npm run test:e2e` - Run Playwright E2E tests

### Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # React components
├── lib/                # Utilities and business logic
├── types/              # TypeScript definitions
└── providers/          # React context providers
```

## Deployment

The portal is configured for deployment on Vercel:

1. Push to your Git repository
2. Connect to Vercel
3. Configure environment variables
4. Deploy automatically on push

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details