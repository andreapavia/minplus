import { useState } from 'react'
import { Button } from '../Button/Button.jsx'
import { CounterTrendChart } from '../CounterTrendChart/CounterTrendChart.jsx'
import { EditEntryMenu } from '../EditEntryMenu/EditEntryMenu.jsx'
import {
  formatEntryTimestamp,
  getCounterTotal,
} from '../../data/counterModel.js'
import './CounterDetailView.css'

export const CounterDetailView = ({
  name,
  entries,
  total: totalProp,
  backgroundColor,
  loading = false,
  onBack,
  onUpdateEntryTimestamp,
}) => {
  const [editingEntry, setEditingEntry] = useState(null)
  const total = totalProp ?? getCounterTotal(entries)
  const sortedEntries = [...entries].sort(
    (a, b) => b.timestamp - a.timestamp,
  )

  return (
    <div className="counter-detail">
      <header className="counter-detail__header">
        <Button
          type="button"
          variant="icon"
          backgroundColor="var(--color-interactive)"
          className="counter-detail__back"
          onClick={onBack}
          ariaLabel="Back to counters"
        >
          ←
        </Button>
        <h2 className="counter-detail__title">{name}</h2>
      </header>

      <div
        className="counter-detail__hero"
        style={{ backgroundColor }}
      >
        <p className="counter-detail__total-label">Total</p>
        <p className="counter-detail__total">{total}</p>
      </div>

      <div className="counter-detail__body">
        {loading ? (
          <p className="counter-detail__empty">Loading…</p>
        ) : (
          <>
            <CounterTrendChart entries={entries} lineColor={backgroundColor} />
            {sortedEntries.length === 0 ? (
              <p className="counter-detail__empty">No entries yet.</p>
            ) : (
              <ul className="counter-detail__list">
                {sortedEntries.map((entry, index) => {
                  const canEdit = typeof entry.id === 'number'
                  return (
                    <li key={canEdit ? entry.id : `${entry.timestamp}-${index}`}>
                      <button
                        type="button"
                        className="counter-detail__row"
                        onClick={() => {
                          if (!canEdit) return
                          setEditingEntry(entry)
                        }}
                        disabled={!canEdit}
                        aria-label={`Edit date for entry ${entry.count > 0 ? `+${entry.count}` : entry.count}`}
                      >
                        <span className="counter-detail__row-count">
                          {entry.count > 0 ? `+${entry.count}` : entry.count}
                        </span>
                        <span className="counter-detail__row-time">
                          {formatEntryTimestamp(entry.timestamp)}
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

      {editingEntry && (
        <EditEntryMenu
          entry={editingEntry}
          onCancel={() => setEditingEntry(null)}
          onSave={({ timestamp }) => {
            onUpdateEntryTimestamp(editingEntry.id, timestamp)
            setEditingEntry(null)
          }}
        />
      )}
    </div>
  )
}
