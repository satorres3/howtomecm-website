import { ContentLibrary } from './lib/content.js'

async function testContent() {
  console.log('Testing content API for staging.howtomecm.com...\n')

  // Test 1: Get all pages
  console.log('1. Getting all pages...')
  const allPages = await ContentLibrary.getAllPages('staging.howtomecm.com')
  console.log('All pages result:', JSON.stringify(allPages, null, 2))

  if (allPages.success && allPages.data) {
    console.log('\nFound pages:')
    allPages.data.forEach(page => {
      console.log(`- ${page.title} (/${page.slug}) - Published: ${page.is_published_to_domain}`)
    })
  }

  // Test 2: Try to get specific pages
  console.log('\n2. Testing specific page lookups...')

  const testSlugs = ['staging-home', 'services-staging', 'about-staging', 'home']

  for (const slug of testSlugs) {
    console.log(`\nTrying slug: ${slug}`)
    const pageResult = await ContentLibrary.getPageBySlug('staging.howtomecm.com', slug)
    if (pageResult.success) {
      console.log(`✅ Found: ${pageResult.data?.title}`)
    } else {
      console.log(`❌ Error: ${pageResult.error}`)
    }
  }
}

testContent().catch(console.error)