import { Button } from '../Button/Button.jsx'
import './CounterCard.css'

export const CounterCard = ({
  name,
  count,
  backgroundColor,
  onOpen,
  onIncrement,
  onDecrement,
}) => {
  const stopPropagation = (event) => {
    event.stopPropagation()
  }

  return (
    <article
      className="counter-card"
      style={{ backgroundColor }}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen()
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`${name}, total ${count}. Open entry history`}
    >
      <p className="counter-card__name">{name}</p>
      <p className="counter-card__count">{count}</p>
      <div className="counter-card__actions">
        <Button
          variant="icon"
          backgroundColor="var(--color-interactive)"
          onClick={(event) => {
            stopPropagation(event)
            onDecrement()
          }}
          ariaLabel={`Decrease ${name}`}
        >
          −
        </Button>
        <Button
          variant="icon"
          backgroundColor="var(--color-interactive)"
          onClick={(event) => {
            stopPropagation(event)
            onIncrement()
          }}
          ariaLabel={`Increase ${name}`}
        >
          +
        </Button>
      </div>
    </article>
  )
}
