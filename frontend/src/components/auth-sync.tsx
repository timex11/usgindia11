'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function AuthSync() {
  const initialize = useAuthStore((state) => state.initialize)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const unsubscribe = initialize()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        router.refresh()
      }
    })

    return () => {
      unsubscribe()
      subscription.unsubscribe()
    }
  }, [initialize, router, supabase])

  return null
}
