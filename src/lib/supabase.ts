// Supabase compatibility layer - redirects to new Neon database connection
// This maintains backward compatibility while using the new PostgreSQL connection

import { checkDatabaseConnection, withDatabaseErrorHandling } from './database'

// This file maintains backward compatibility for any legacy imports

// Legacy supabase export for backward compatibility
// This is a mock object that throws meaningful errors if used
export const supabase = {
  from: () => {
    throw new Error('Supabase client is no longer available. Use the new database functions from ./database instead.')
  },
  rpc: () => {
    throw new Error('Supabase RPC calls are no longer available. Use the new database functions from ./database instead.')
  },
  auth: {
    user: () => {
      throw new Error('Supabase Auth is no longer available. Authentication has been removed.')
    },
    session: () => {
      throw new Error('Supabase Auth is no longer available. Authentication has been removed.')
    }
  }
}

// Compatibility exports for existing code that might import from here
export { checkDatabaseConnection, withDatabaseErrorHandling }