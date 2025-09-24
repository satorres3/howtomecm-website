import { createClient } from '@supabase/supabase-js'

// Support both Supabase and Neon database URLs with flexible environment variable names
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ||
                    process.env.SUPABASE_URL ||
                    process.env.NEON_DATABASE_URL ||
                    process.env.DATABASE_URL ||
                    'https://cqzfwnyhxmmasjannfvx.supabase.co'

const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
                       process.env.SUPABASE_ANON_KEY ||
                       process.env.SUPABASE_SERVICE_KEY ||
                       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxemZ3bnloeG1tYXNqYW5uZnZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNjUzODIsImV4cCI6MjA3Mzg0MTM4Mn0.pAxuYEK7LplmfQRTDNLPQ_0E0FTIPDygXZVAx6yv4b0'

// More flexible environment variable checking
if (!supabaseUrl) {
  console.error('❌ Database Configuration Error:')
  console.error('Missing database URL. Expected one of:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- SUPABASE_URL')
  console.error('- NEON_DATABASE_URL')
  console.error('- DATABASE_URL')
  throw new Error('Missing database URL environment variable')
}

if (!supabaseAnonKey) {
  console.error('❌ Database Configuration Error:')
  console.error('Missing database key. Expected one of:')
  console.error('- NEXT_PUBLIC_SUPABASE_ANON_KEY')
  console.error('- SUPABASE_ANON_KEY')
  console.error('- SUPABASE_SERVICE_KEY')
  throw new Error('Missing database key environment variable')
}

console.log('✅ Database Configuration:')
console.log(`  - URL: ${supabaseUrl.substring(0, 30)}...`)
console.log(`  - Key: ${supabaseAnonKey ? 'Present' : 'Missing'}`)

export const supabase = createClient(supabaseUrl, supabaseAnonKey)