import { useState } from 'react'
import { Button } from '../Button/Button.jsx'
import { CounterTrendChart } from '../CounterTrendChart/CounterTrendChart.jsx'
import './AllCountersView.css'

/**
 * @param {{
 *   counters: { id: string, name: string, color: string, entries: { count: number, timestamp: number }[] | null }[]
 *   loading?: boolean
 *   onBack: () => void
 * }} props
 */
export const AllCountersView = ({ counters, loading = false, onBack }) => {
  const [enabledIds, setEnabledIds] = useState(() =>
    new Set(counters.map((c) => c.id)),
  )

  const toggleCounter = (id) => {
    setEnabledIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const chartSeries = counters
    .filter((c) => enabledIds.has(c.id))
    .map((c) => ({
      id: c.id,
      name: c.name,
      entries: c.entries ?? [],
      color: c.color,
    }))

  return (
    <div className="all-counters">
      <header className="all-counters__header">
        <Button
          type="button"
          variant="icon"
          backgroundColor="var(--color-interactive)"
          className="all-counters__back"
          onClick={onBack}
          ariaLabel="Back to counters"
        >
          ←
        </Button>
        <h2 className="all-counters__title">All charts</h2>
      </header>

      <div className="all-counters__body">
        {loading ? (
          <p className="all-counters__status">Loading…</p>
        ) : (
          <>
            <CounterTrendChart series={chartSeries} />

            <h3 className="all-counters__list-heading">Counters</h3>
            {counters.length === 0 ? (
              <p className="all-counters__status">No counters yet.</p>
            ) : (
              <ul className="all-counters__list">
                {counters.map((counter) => {
                  const enabled = enabledIds.has(counter.id)
                  return (
                    <li key={counter.id}>
                      <button
                        type="button"
                        className={`all-counters__toggle${enabled ? ' all-counters__toggle--on' : ''}`}
                        onClick={() => toggleCounter(counter.id)}
                        aria-pressed={enabled}
                      >
                        <span
                          className="all-counters__swatch"
                          style={{ backgroundColor: counter.color }}
                          aria-hidden="true"
                        />
                        <span className="all-counters__toggle-name">
                          {counter.name}
                        </span>
                        <span className="all-counters__toggle-state">
                          {enabled ? 'On' : 'Off'}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  )
}
