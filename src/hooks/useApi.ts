import useSWR, { SWRConfiguration, SWRResponse } from 'swr'
import { z } from 'zod'
import { fetcher } from '@/lib/swr-config'

/**
 * Type-safe API hook with Zod validation
 * @param key - SWR key (URL or null to disable)
 * @param schema - Zod schema for response validation
 * @param config - SWR configuration options
 * @returns SWR response with validated data
 */
export function useApi<T>(
  key: string | null,
  schema: z.ZodSchema<T>,
  config?: SWRConfiguration
): SWRResponse<T, Error> & { validatedData: T | undefined } {
  const response = useSWR(
    key,
    async (url: string) => {
      const data = await fetcher(url)

      // Validate response with Zod schema
      try {
        return schema.parse(data)
      } catch (error) {
        if (error instanceof z.ZodError) {
          const validationError = new Error(
            `API response validation failed: ${error.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ')}`
          )
          ;(validationError as any).zodError = error
          ;(validationError as any).rawData = data
          throw validationError
        }
        throw error
      }
    },
    {
      // Default configuration
      revalidateOnFocus: false,
      revalidateOnMount: true,
      ...config,
    }
  )

  return {
    ...response,
    validatedData: response.data,
  }
}

/**
 * Hook for fetching paginated data with built-in loading states
 */
export function usePaginatedApi<T>(
  key: string | null,
  schema: z.ZodSchema<T>,
  config?: SWRConfiguration
) {
  const { data, error, isLoading, isValidating, mutate, validatedData } = useApi(
    key,
    schema,
    config
  )

  return {
    data: validatedData,
    error,
    isLoading,
    isValidating,
    isRefreshing: isValidating && !isLoading,
    isEmpty: !isLoading && !data,
    mutate,
    refresh: () => mutate(),
  }
}

/**
 * Hook for API mutations (POST, PUT, DELETE)
 */
export function useApiMutation<TData, TVariables = any>(
  mutationFn: (variables: TVariables) => Promise<TData>
) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<TData | null>(null)

  const mutate = useCallback(
    async (variables: TVariables) => {
      try {
        setIsLoading(true)
        setError(null)
        const result = await mutationFn(variables)
        setData(result)
        return result
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error')
        setError(error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [mutationFn]
  )

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setIsLoading(false)
  }, [])

  return {
    mutate,
    data,
    error,
    isLoading,
    reset,
  }
}

// Re-export necessary types and utilities
export type { SWRConfiguration, SWRResponse }
import { useState, useCallback } from 'react'
