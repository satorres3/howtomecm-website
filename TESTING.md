# Playwright Testing Guide

## Prerequisites
```bash
npm install
npx playwright install
```

**Important:** Ensure your development server is running first:
```bash
npm run dev
```

## Running Tests

### All Tests
```bash
npm run test:e2e
# or
npx playwright test
```

### Individual Test Files
```bash
# Blog enhanced functionality
npm run test:e2e:blog

# Comment system security
npm run test:e2e:comments

# Accessibility compliance
npm run test:e2e:a11y
```

### Specific Test Suites
```bash
# Tag functionality only
npx playwright test e2e/blog-enhanced.spec.ts -g "Tag Functionality"

# Comment validation only
npx playwright test e2e/comment-system.spec.ts -g "Input Validation"

# Keyboard navigation only
npx playwright test e2e/blog-accessibility.spec.ts -g "Keyboard Navigation"
```

### Debug Mode
```bash
npm run test:e2e:debug
# or
npx playwright test --debug
```

### View Test Report
```bash
npx playwright show-report
```

## Test Coverage
- **Enhanced Blog**: Tags, filtering, Security Copilot post, YouTube banner
- **Comment System**: Validation, spam detection, XSS protection, rate limiting
- **Accessibility**: Keyboard navigation, screen readers, ARIA compliance, color contrast

## Troubleshooting

### Port Conflicts
If you get "Port 3000 is in use" errors:
```bash
# Check what's using port 3000
lsof -i :3000

# Kill existing processes if needed
pkill -f "npm run dev"

# Then restart your dev server
npm run dev
```

### Server Timeout Issues
If tests timeout waiting for server:
- Ensure `npm run dev` is running and accessible at http://localhost:3000
- Check that the app loads correctly in your browser first
- Restart the development server if needed

### Test Failures
- Run tests with `--debug` flag to see detailed browser actions
- Use `npx playwright show-report` to view the latest test report
- Check that demo content is properly loaded before running tests