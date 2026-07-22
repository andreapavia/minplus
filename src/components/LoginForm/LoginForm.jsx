import { useState } from 'react'
import { Button } from '../Button/Button.jsx'
import './LoginForm.css'

export const LoginForm = ({ onSignIn }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    const { error: signInError } = await onSignIn(
      email.trim(),
      password,
    )
    setSubmitting(false)
    if (signInError) {
      setError(signInError.message ?? String(signInError))
    }
  }

  return (
    <div className="login-form">
      <header className="login-form__header">
        <h1 className="login-form__title">
          <img
            className="login-form__logo"
            src="/icons/icon-192.png"
            alt=""
            width={32}
            height={32}
          />
          Minplus
        </h1>
        <p className="login-form__subtitle">Sign in to continue</p>
      </header>

      <form className="login-form__form" onSubmit={handleSubmit}>
        <label className="login-form__field">
          <span className="login-form__label">Email</span>
          <input
            className="login-form__input"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
            autoFocus
          />
        </label>

        <label className="login-form__field">
          <span className="login-form__label">Password</span>
          <input
            className="login-form__input"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        {error && <p className="login-form__error">{error}</p>}

        <Button
          type="submit"
          backgroundColor="var(--color-interactive)"
          className="login-form__submit"
        >
          {submitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
    </div>
  )
}
