import { Pool, QueryResult, QueryResultRow } from 'pg'

// Neon Database Configuration
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://localhost:5432/website_template'

// Database connection pool
let pool: Pool | null = null

function createPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    })

    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err)
    })

    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Database Pool Configuration:')
      console.log(`  - Connected to Neon PostgreSQL`)
      console.log(`  - Max connections: 20`)
      console.log(`  - SSL enabled`)
    }
  }
  return pool
}

export function getPool(): Pool {
  return createPool()
}

// Enhanced database query wrapper with error handling
export interface DatabaseResult<T> {
  data: T | null
  error: string | null
  success: boolean
}

function createSuccessResult<T>(data: T): DatabaseResult<T> {
  return { data, error: null, success: true }
}

function createErrorResult<T>(error: string): DatabaseResult<T> {
  console.error('Database operation error:', error)
  return { data: null, error, success: false }
}

// Generic query function
export async function query<T extends QueryResultRow = any>(text: string, params?: any[]): Promise<DatabaseResult<T[]>> {
  const client = getPool()
  try {
    const result: QueryResult<T> = await client.query(text, params)
    return createSuccessResult(result.rows)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown database error'
    return createErrorResult(errorMessage)
  }
}

// Query function that expects a single result
export async function queryOne<T extends QueryResultRow = any>(text: string, params?: any[]): Promise<DatabaseResult<T>> {
  const result = await query<T>(text, params)
  if (!result.success) {
    return createErrorResult(result.error || 'Query failed')
  }

  if (!result.data || result.data.length === 0) {
    return createErrorResult('No results found')
  }

  return createSuccessResult(result.data[0])
}

// Connection health check function
export async function checkDatabaseConnection(): Promise<{ healthy: boolean; error?: string }> {
  try {
    const result = await query('SELECT 1 as health_check')

    if (!result.success) {
      return { healthy: false, error: result.error || 'Health check failed' }
    }

    return { healthy: true }
  } catch (error) {
    return { healthy: false, error: `Database connection failed: ${error}` }
  }
}

// Utility function for safe database operations with enhanced error handling
export async function withDatabaseErrorHandling<T>(
  operation: () => Promise<DatabaseResult<T>>,
  operationName: string
): Promise<DatabaseResult<T>> {
  try {
    const result = await operation()
    return result
  } catch (error) {
    const errorMessage = `${operationName} failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    return createErrorResult(errorMessage)
  }
}

// Helper functions for common query patterns

// Select with filtering
export async function select<T extends QueryResultRow = any>(
  table: string,
  columns: string = '*',
  where?: { [key: string]: any },
  orderBy?: string,
  limit?: number
): Promise<DatabaseResult<T[]>> {
  let queryText = `SELECT ${columns} FROM ${table}`
  const params: any[] = []
  let paramCount = 0

  if (where && Object.keys(where).length > 0) {
    const whereConditions = Object.keys(where).map(key => {
      paramCount++
      params.push(where[key])
      return `${key} = $${paramCount}`
    })
    queryText += ` WHERE ${whereConditions.join(' AND ')}`
  }

  if (orderBy) {
    queryText += ` ORDER BY ${orderBy}`
  }

  if (limit) {
    paramCount++
    params.push(limit)
    queryText += ` LIMIT $${paramCount}`
  }

  return query<T>(queryText, params)
}

// Select single record
export async function selectOne<T extends QueryResultRow = any>(
  table: string,
  columns: string = '*',
  where: { [key: string]: any }
): Promise<DatabaseResult<T>> {
  const result = await select<T>(table, columns, where, undefined, 1)
  if (!result.success) {
    return createErrorResult(result.error || 'Query failed')
  }

  if (!result.data || result.data.length === 0) {
    return createErrorResult('Record not found')
  }

  return createSuccessResult(result.data[0])
}

// Insert record
export async function insert<T extends QueryResultRow = any>(
  table: string,
  data: { [key: string]: any },
  returning: string = '*'
): Promise<DatabaseResult<T>> {
  const columns = Object.keys(data)
  const values = Object.values(data)
  const placeholders = values.map((_, index) => `$${index + 1}`)

  const queryText = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING ${returning}`

  const result = await query<T>(queryText, values)
  if (!result.success || !result.data || result.data.length === 0) {
    return createErrorResult(result.error || 'Insert failed')
  }

  return createSuccessResult(result.data[0])
}

// Update record
export async function update<T extends QueryResultRow = any>(
  table: string,
  data: { [key: string]: any },
  where: { [key: string]: any },
  returning: string = '*'
): Promise<DatabaseResult<T>> {
  const setColumns = Object.keys(data)
  const setValues = Object.values(data)
  const whereColumns = Object.keys(where)
  const whereValues = Object.values(where)

  let paramCount = 0
  const setClause = setColumns.map(col => {
    paramCount++
    return `${col} = $${paramCount}`
  }).join(', ')

  const whereClause = whereColumns.map(col => {
    paramCount++
    return `${col} = $${paramCount}`
  }).join(' AND ')

  const queryText = `UPDATE ${table} SET ${setClause} WHERE ${whereClause} RETURNING ${returning}`
  const allValues = [...setValues, ...whereValues]

  const result = await query<T>(queryText, allValues)
  if (!result.success || !result.data || result.data.length === 0) {
    return createErrorResult(result.error || 'Update failed')
  }

  return createSuccessResult(result.data[0])
}

// Delete record
export async function remove(
  table: string,
  where: { [key: string]: any }
): Promise<DatabaseResult<{ deleted: boolean }>> {
  const whereColumns = Object.keys(where)
  const whereValues = Object.values(where)

  const whereClause = whereColumns.map((col, index) => `${col} = $${index + 1}`).join(' AND ')
  const queryText = `DELETE FROM ${table} WHERE ${whereClause}`

  try {
    const client = getPool()
    const result = await client.query(queryText, whereValues)
    return createSuccessResult({ deleted: (result.rowCount || 0) > 0 })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Delete failed'
    return createErrorResult(errorMessage)
  }
}

// Close the pool (for graceful shutdown)
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end()
    pool = null
  }
}