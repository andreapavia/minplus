import { useState } from 'react'
import { Button } from '../Button/Button.jsx'
import './EditEntryMenu.css'

/**
 * @param {number} timestampMs
 */
const toDatetimeLocalValue = (timestampMs) => {
  const date = new Date(timestampMs)
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

/**
 * @param {string} value
 * @returns {number | null}
 */
const fromDatetimeLocalValue = (value) => {
  if (!value) return null
  const ms = new Date(value).getTime()
  return Number.isNaN(ms) ? null : ms
}

export const EditEntryMenu = ({ entry, onCancel, onSave }) => {
  const [dateValue, setDateValue] = useState(() =>
    toDatetimeLocalValue(entry.timestamp),
  )

  const handleSave = () => {
    const timestamp = fromDatetimeLocalValue(dateValue)
    if (timestamp == null) return
    onSave({ timestamp })
  }

  const countLabel = entry.count > 0 ? `+${entry.count}` : String(entry.count)

  return (
    <div className="edit-entry-menu" role="dialog" aria-labelledby="edit-entry-title">
      <header className="edit-entry-menu__header">
        <Button
          type="button"
          variant="pill"
          backgroundColor="var(--color-button-inactive)"
          className="edit-entry-menu__header-btn edit-entry-menu__header-btn--cancel"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <h2 id="edit-entry-title" className="edit-entry-menu__title">
          Edit date
        </h2>
        <Button
          type="button"
          variant="pill"
          backgroundColor="var(--color-interactive)"
          className="edit-entry-menu__header-btn edit-entry-menu__header-btn--save"
          onClick={handleSave}
        >
          Save
        </Button>
      </header>

      <div className="edit-entry-menu__body">
        <p className="edit-entry-menu__count">{countLabel}</p>

        <label className="edit-entry-menu__date-row">
          <span className="edit-entry-menu__date-label">Date</span>
          <input
            className="edit-entry-menu__date-input"
            type="datetime-local"
            value={dateValue}
            onChange={(e) => setDateValue(e.target.value)}
          />
        </label>
      </div>
    </div>
  )
}
