import { useAuth } from '../../hooks/useAuth.js'
import { LoginForm } from '../LoginForm/LoginForm.jsx'
import { App } from '../../App.jsx'
import './AuthGate.css'

export const AuthGate = () => {
  const { session, loading, signIn, signOut } = useAuth()

  if (loading) {
    return (
      <div className="auth-gate">
        <p className="auth-gate__status">Loading…</p>
      </div>
    )
  }

  if (!session) {
    return <LoginForm onSignIn={signIn} />
  }

  return <App onSignOut={signOut} />
}
