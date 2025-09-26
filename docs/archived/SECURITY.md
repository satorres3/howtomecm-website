# Security Best Practices

This document outlines the security measures implemented in the How to MeCM website and provides guidelines for maintaining secure operations.

## Environment Variables Security

### Required Environment Variables

The following environment variables are **required** and must be configured securely:

```bash
# Database Connection (choose one)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# OR alternative names
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# Site Configuration
WEBSITE_DOMAIN=your-domain.com

# Optional: Webhook Security
WEBHOOK_SECRET=your-webhook-secret-key
```

### Security Guidelines for Environment Variables

1. **Never commit environment variables to version control**
   - Use `.env.local` for local development
   - Configure environment variables through your hosting platform (Vercel, Netlify, etc.)

2. **Use strong, unique secrets**
   - Generate webhook secrets using: `openssl rand -base64 32`
   - Rotate secrets regularly (every 6 months minimum)

3. **Principle of least privilege**
   - Use Supabase anon keys, not service keys, for client-side operations
   - Configure Row Level Security (RLS) in Supabase

## Database Security

### Supabase Security Configuration

1. **Row Level Security (RLS)**
   - Enable RLS on all tables containing sensitive data
   - Implement domain-based access control for multi-tenant content

2. **API Security**
   - Use anon keys for public operations
   - Implement rate limiting in Supabase dashboard
   - Monitor API usage for anomalies

3. **Connection Security**
   - Database connections use SSL/TLS encryption
   - Connection pooling is configured securely
   - Health checks are implemented to detect connection issues

## Content Security

### Input Sanitization

1. **User-generated content** is sanitized before storage
2. **Database queries** use parameterized statements to prevent SQL injection
3. **HTML content** is properly escaped when rendered

### Content Management

1. **Authentication** is required for content modification
2. **Domain-based isolation** ensures content separation between sites
3. **Published status** controls content visibility

## Infrastructure Security

### Next.js Security Headers

The application implements security headers through `next.config.js`:

```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:;"
          }
        ]
      }
    ]
  }
}
```

### HTTPS Enforcement

1. All production deployments must use HTTPS
2. HTTP requests are automatically redirected to HTTPS
3. Security headers enforce secure connections

## Error Handling Security

### Secure Error Messages

1. **Production errors** do not expose sensitive information
2. **Database errors** are logged securely without exposing schema details
3. **User-facing errors** provide helpful information without security risks

### Logging and Monitoring

1. **Security events** are logged (authentication attempts, unusual API usage)
2. **Error monitoring** is configured for production environments
3. **Performance monitoring** helps detect potential DDoS attacks

## Development Security

### Local Development

1. **Environment isolation**: Use `.env.local` for development variables
2. **Test data**: Never use production credentials in development
3. **Dependencies**: Regularly update dependencies to address security vulnerabilities

### Code Security

1. **Static analysis**: ESLint configuration includes security rules
2. **Dependency scanning**: Regular updates and vulnerability checks
3. **Type safety**: TypeScript helps prevent runtime security issues

## Deployment Security

### Secure Deployment Checklist

- [ ] Environment variables are configured securely
- [ ] Database RLS policies are enabled and tested
- [ ] Security headers are properly configured
- [ ] HTTPS is enforced
- [ ] Error handling doesn't expose sensitive information
- [ ] Dependencies are up to date
- [ ] Logging and monitoring are configured

### Platform-Specific Security

#### Vercel Deployment

```bash
# Set environment variables through Vercel CLI or dashboard
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add WEBSITE_DOMAIN
vercel env add WEBHOOK_SECRET
```

#### Environment Variable Management

1. **Production**: Set through hosting platform dashboard
2. **Staging**: Use separate environment with test credentials
3. **Development**: Use `.env.local` file (not committed to git)

## Security Incident Response

### If a Security Issue is Discovered

1. **Immediate action**: Change all affected credentials
2. **Assessment**: Determine scope and impact of the issue
3. **Notification**: Inform affected users if necessary
4. **Documentation**: Record the incident and response actions
5. **Prevention**: Implement measures to prevent similar issues

### Contact Information

For security-related issues, please contact:
- Email: security@howtomecm.com
- Create a private issue in the repository

## Compliance and Auditing

### Regular Security Reviews

1. **Quarterly**: Review environment variables and access controls
2. **Monthly**: Update dependencies and check for vulnerabilities
3. **Weekly**: Monitor logs for unusual activity
4. **Daily**: Automated security scanning in CI/CD pipeline

### Documentation Updates

This security documentation should be reviewed and updated:
- When new features are added
- After security incidents
- During major infrastructure changes
- At least quarterly

## Additional Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Documentation](https://nextjs.org/docs/advanced-features/security-headers)
- [Supabase Security Guide](https://supabase.com/docs/guides/platform/security)
- [Vercel Security Best Practices](https://vercel.com/docs/security)