import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cqzfwnyhxmmasjannfvx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxemZ3bnloeG1tYXNqYW5uZnZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNjUzODIsImV4cCI6MjA3Mzg0MTM4Mn0.pAxuYEK7LplmfQRTDNLPQ_0E0FTIPDygXZVAx6yv4b0'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testHomepage() {
  console.log('Testing exact homepage query that ContentLibrary uses...\n')

  try {
    // Test the exact query that ContentLibrary.getPageBySlug('staging.howtomecm.com', 'home') uses
    console.log('Executing homepage query for staging.howtomecm.com...')
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('website_domain', 'staging.howtomecm.com')
      .eq('is_homepage', true)
      .eq('status', 'published')
      .eq('is_published_to_domain', true)
      .single()

    if (error) {
      console.log('❌ Homepage query error:', error)
      console.log('Error code:', error.code)

      if (error.code === 'PGRST116') {
        console.log('This means: No rows found matching the query')
      }
    } else {
      console.log('✅ Homepage found successfully!')
      console.log('Homepage data:', JSON.stringify(data, null, 2))
    }

    // Additional test: Check what happens without .single()
    console.log('\n--- Additional test without .single() ---')
    const { data: multiData, error: multiError } = await supabase
      .from('pages')
      .select('*')
      .eq('website_domain', 'staging.howtomecm.com')
      .eq('is_homepage', true)
      .eq('status', 'published')
      .eq('is_published_to_domain', true)

    if (multiError) {
      console.log('❌ Multi query error:', multiError)
    } else {
      console.log(`✅ Multi query found ${multiData?.length || 0} matching pages`)
      if (multiData && multiData.length > 0) {
        multiData.forEach(page => {
          console.log(`- ${page.title} (/${page.slug}) - is_homepage: ${page.is_homepage}`)
        })
      }
    }

  } catch (error) {
    console.log('❌ Unexpected error:', error)
  }
}

testHomepage()