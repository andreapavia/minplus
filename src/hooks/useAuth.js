import { useEffect, useState } from 'react'
import { supabase } from '../data/supabaseClient.js'

/**
 * @returns {{
 *   session: import('@supabase/supabase-js').Session | null,
 *   loading: boolean,
 *   signIn: (email: string, password: string) => Promise<{ error: Error | null }>,
 *   signOut: () => Promise<void>,
 * }}
 */
export const useAuth = () => {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return
      setSession(data.session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setLoading(false)
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return { session, loading, signIn, signOut }
}
