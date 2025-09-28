// Stub database module for static export
// All data comes from demoContent.ts

export interface DatabaseResult<T = any> {
  success: boolean
  data: T | null
  error: string | null
}

// Stub functions that always return demo data
export async function checkDatabaseConnection(): Promise<boolean> {
  return false // Always use demo data
}

export function withDatabaseErrorHandling<T>(
  operation: () => Promise<DatabaseResult<T>>
): Promise<DatabaseResult<T>> {
  // Always return demo data fallback
  return Promise.resolve({
    success: false,
    data: null,
    error: 'Database disabled for static export',
  })
}

// Stub query functions
export async function query<T>(...args: any[]): Promise<DatabaseResult<T[]>> {
  return { success: false, data: null, error: 'Static export mode' }
}

export async function queryOne<T>(...args: any[]): Promise<DatabaseResult<T>> {
  return { success: false, data: null, error: 'Static export mode' }
}

export async function select<T>(...args: any[]): Promise<DatabaseResult<T[]>> {
  return { success: false, data: null, error: 'Static export mode' }
}

export async function selectOne<T>(...args: any[]): Promise<DatabaseResult<T>> {
  return { success: false, data: null, error: 'Static export mode' }
}

export async function insert<T>(...args: any[]): Promise<DatabaseResult<T>> {
  return { success: false, data: null, error: 'Static export mode' }
}

export async function update<T>(...args: any[]): Promise<DatabaseResult<T>> {
  return { success: false, data: null, error: 'Static export mode' }
}

export async function deleteFrom<T>(...args: any[]): Promise<DatabaseResult<T>> {
  return { success: false, data: null, error: 'Static export mode' }
}

// Stub transaction functions
export async function withTransaction<T>(operation: () => Promise<T>): Promise<DatabaseResult<T>> {
  return { success: false, data: null, error: 'Static export mode' }
}

// Legacy exports for backward compatibility
export const getPostsFromDatabase = async () => ({ data: null, error: 'Static export mode' })
export const getPostBySlugFromDatabase = async () => ({ data: null, error: 'Static export mode' })
export const getSiteSettingsFromDatabase = async () => ({ data: null, error: 'Static export mode' })
