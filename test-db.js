import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cqzfwnyhxmmasjannfvx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxemZ3bnloeG1tYXNqYW5uZnZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNjUzODIsImV4cCI6MjA3Mzg0MTM4Mn0.pAxuYEK7LplmfQRTDNLPQ_0E0FTIPDygXZVAx6yv4b0'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testDatabase() {
  console.log('Testing database connection for staging.howtomecm.com...\n')

  try {
    // Test 1: Get all pages for staging domain
    console.log('1. Querying all pages for staging.howtomecm.com...')
    const { data: allPages, error: allPagesError } = await supabase
      .from('pages')
      .select('*')
      .eq('website_domain', 'staging.howtomecm.com')

    if (allPagesError) {
      console.log('❌ Error fetching all pages:', allPagesError)
    } else {
      console.log(`✅ Found ${allPages?.length || 0} pages total for staging.howtomecm.com`)
      if (allPages && allPages.length > 0) {
        console.log('Pages found:')
        allPages.forEach(page => {
          console.log(`- ${page.title} (/${page.slug})`)
          console.log(`  Status: ${page.status}, Published to domain: ${page.is_published_to_domain}`)
        })
      }
    }

    // Test 2: Get published pages only
    console.log('\n2. Querying published pages only...')
    const { data: publishedPages, error: publishedError } = await supabase
      .from('pages')
      .select('*')
      .eq('website_domain', 'staging.howtomecm.com')
      .eq('status', 'published')
      .eq('is_published_to_domain', true)

    if (publishedError) {
      console.log('❌ Error fetching published pages:', publishedError)
    } else {
      console.log(`✅ Found ${publishedPages?.length || 0} published pages`)
      if (publishedPages && publishedPages.length > 0) {
        console.log('Published pages:')
        publishedPages.forEach(page => {
          console.log(`- ${page.title} (/${page.slug})`)
        })
      }
    }

    // Test 3: Check for homepage
    console.log('\n3. Looking for homepage...')
    const { data: homepage, error: homepageError } = await supabase
      .from('pages')
      .select('*')
      .eq('website_domain', 'staging.howtomecm.com')
      .eq('is_homepage', true)

    if (homepageError) {
      console.log('❌ Error fetching homepage:', homepageError)
    } else {
      console.log(`✅ Found ${homepage?.length || 0} homepage(s)`)
      if (homepage && homepage.length > 0) {
        homepage.forEach(page => {
          console.log(`- Homepage: ${page.title} (/${page.slug})`)
          console.log(`  Status: ${page.status}, Published: ${page.is_published_to_domain}`)
        })
      }
    }

  } catch (error) {
    console.log('❌ Unexpected error:', error)
  }
}

testDatabase()