import './Button.css'

export const Button = ({
  backgroundColor,
  children,
  onClick,
  type = 'button',
  variant = 'pill',
  ariaLabel,
  className = '',
}) => {
  return (
    <button
      type={type}
      className={`button button--${variant} ${className}`.trim()}
      style={{ backgroundColor }}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  )
}
