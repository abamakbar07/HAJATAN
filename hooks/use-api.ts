"use client"

import { useState, useEffect, useCallback } from "react"

interface FetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE"
  body?: any
  headers?: Record<string, string>
}

export function useApi<T>(url: string, options?: FetchOptions) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const fetchData = useCallback(
    async (customOptions?: FetchOptions) => {
      try {
        setLoading(true)
        setError(null)

        const fetchOptions: RequestInit = {
          method: customOptions?.method || options?.method || "GET",
          headers: {
            "Content-Type": "application/json",
            ...(customOptions?.headers || options?.headers || {}),
          },
        }

        if (customOptions?.body || options?.body) {
          fetchOptions.body = JSON.stringify(customOptions?.body || options?.body)
        }

        const response = await fetch(url, fetchOptions)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "An error occurred")
        }

        const result = await response.json()
        setData(result)
        return result
      } catch (err: any) {
        setError(err)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [url, options],
  )

  useEffect(() => {
    if (options?.method !== "POST" && options?.method !== "PUT" && options?.method !== "DELETE") {
      fetchData()
    }
  }, [fetchData, options?.method])

  return { data, error, loading, fetchData }
}

