#!/usr/bin/env node

/**
 * Content Migration Script
 * Migrates well-formatted content from samplePosts.ts to Supabase database
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Import sample posts (we'll need to convert this to work with Node.js)
const samplePostsPath = path.join(__dirname, '../src/data/samplePosts.ts')

async function migrateSamplePosts() {
  console.log('🚀 Starting content migration...')

  try {
    // Read the samplePosts.ts file content
    const fileContent = fs.readFileSync(samplePostsPath, 'utf8')

    // Extract the Microsoft Edge post content using regex
    const edgePostMatch = fileContent.match(/id: "7"[\s\S]*?content: `([\s\S]*?)`,[\s\S]*?date: "2024-12-08"/);

    if (!edgePostMatch) {
      console.error('❌ Could not find Microsoft Edge post in samplePosts.ts')
      process.exit(1)
    }

    const edgePostContent = edgePostMatch[1]

    console.log('📝 Found Microsoft Edge post content')

    // Check if the post already exists in database
    const { data: existingPosts, error: fetchError } = await supabase
      .from('posts')
      .select('id, slug, title')
      .eq('slug', 'how-to-configure-microsoft-edge-start-home-page-intune')
      .limit(1)

    if (fetchError) {
      console.error('❌ Error checking existing posts:', fetchError.message)
      return
    }

    const DOMAIN = process.env.WEBSITE_DOMAIN || 'staging.howtomecm.com'

    if (existingPosts && existingPosts.length > 0) {
      // Update existing post
      console.log('📋 Updating existing post...')

      const { error: updateError } = await supabase
        .from('posts')
        .update({
          content: edgePostContent,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingPosts[0].id)

      if (updateError) {
        console.error('❌ Error updating post:', updateError.message)
        return
      }

      console.log('✅ Successfully updated Microsoft Edge post with enhanced formatting!')

    } else {
      // Create new post
      console.log('📋 Creating new post...')

      const newPost = {
        title: 'How to Configure Microsoft Edge Start & Home Page via Intune',
        slug: 'how-to-configure-microsoft-edge-start-home-page-intune',
        excerpt: 'Complete step-by-step guide for configuring Microsoft Edge start and home pages for Windows 10/11 devices using Microsoft Intune Settings Catalog.',
        content: edgePostContent,
        status: 'published',
        website_domain: DOMAIN,
        is_published_to_domain: true,
        date: '2024-12-08',
        created_at: '2024-12-08T12:00:00Z',
        updated_at: new Date().toISOString(),
        featured_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop'
      }

      const { error: insertError } = await supabase
        .from('posts')
        .insert([newPost])

      if (insertError) {
        console.error('❌ Error creating post:', insertError.message)
        return
      }

      console.log('✅ Successfully created Microsoft Edge post with enhanced formatting!')
    }

    console.log('🎉 Content migration completed successfully!')
    console.log(`📍 Check your blog at: https://${DOMAIN}/blog/how-to-configure-microsoft-edge-start-home-page-intune`)

  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    process.exit(1)
  }
}

// Run migration
migrateSamplePosts()