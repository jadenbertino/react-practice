'use client'

import {
  useCallback,
  useRef,
  useSyncExternalStore,
  type Dispatch,
  type SetStateAction,
} from 'react'
import type z from 'zod'

function useLocalStorage<T>({
  key,
  defaultValue,
  schema,
}: {
  key: string
  schema: z.ZodType<T>
  defaultValue: T
}): [T, Dispatch<SetStateAction<T>>] {
  const cachedSnapshot = useRef<{ raw: string | null; parsed: T } | null>(null)

  const getLocalValue = useCallback(() => {
    try {
      const localValue = window.localStorage.getItem(key)

      // Return cached value if raw data hasn't changed
      if (cachedSnapshot.current && cachedSnapshot.current.raw === localValue) {
        return cachedSnapshot.current.parsed
      }

      // Parse and cache new value
      const parsed =
        localValue === null
          ? defaultValue
          : schema.parse(JSON.parse(localValue))

      cachedSnapshot.current = { raw: localValue, parsed }
      return parsed
    } catch {
      const fallback = defaultValue
      cachedSnapshot.current = { raw: null, parsed: fallback }
      return fallback
    }
  }, [key, defaultValue, schema])

  const getServerSnapshot = useCallback(() => defaultValue, [defaultValue])

  const subscribe = useCallback((callback: () => void) => {
    window.addEventListener('storage', callback)
    return () => window.removeEventListener('storage', callback)
  }, [])

  const value = useSyncExternalStore(
    subscribe,
    getLocalValue,
    getServerSnapshot,
  )

  const setValue: Dispatch<SetStateAction<T>> = useCallback(
    (next) => {
      const prev = getLocalValue()
      const resolved =
        typeof next === 'function' ? (next as (p: T) => T)(prev) : next

      try {
        window.localStorage.setItem(key, JSON.stringify(resolved))
        // Manually trigger a re-render by dispatching a storage event
        window.dispatchEvent(new StorageEvent('storage'))
      } catch {
        // optional: handle quota / privacy mode errors
      }
    },
    [key, getLocalValue],
  )

  return [value, setValue]
}

export default useLocalStorage
