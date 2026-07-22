import { useState } from 'react'
import { Button } from '../Button/Button.jsx'
import './CreateCounterMenu.css'

export const COUNTER_COLOR_OPTIONS = [
  'var(--pastel-orange)',
  'var(--pastel-blue)',
  'var(--pastel-purple)',
  'var(--pastel-green)',
  'var(--pastel-yellow)',
  'var(--pastel-pink)',
  'var(--pastel-red)',
]

export const CreateCounterMenu = ({ onCancel, onSave }) => {
  const [name, setName] = useState('')
  const [selectedColor, setSelectedColor] = useState(COUNTER_COLOR_OPTIONS[0])

  const handleSave = () => {
    const trimmed = name.trim()
    onSave({
      name: trimmed || 'Counter',
      color: selectedColor,
    })
  }

  return (
    <div className="create-counter-menu" role="dialog" aria-labelledby="create-counter-title">
      <header className="create-counter-menu__header">
        <Button
          type="button"
          variant="pill"
          backgroundColor="var(--color-button-inactive)"
          className="create-counter-menu__header-btn create-counter-menu__header-btn--cancel"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <h2 id="create-counter-title" className="create-counter-menu__title">
          Create counter
        </h2>
        <Button
          type="button"
          variant="pill"
          backgroundColor="var(--color-interactive)"
          className="create-counter-menu__header-btn create-counter-menu__header-btn--save"
          onClick={handleSave}
        >
          Save
        </Button>
      </header>

      <div className="create-counter-menu__body">
        <fieldset className="create-counter-menu__colors">
          <legend className="create-counter-menu__colors-label">Color</legend>
          <div className="create-counter-menu__swatches">
            {COUNTER_COLOR_OPTIONS.map((color) => {
              const selected = color === selectedColor
              return (
                <button
                  key={color}
                  type="button"
                  className={`create-counter-menu__swatch${selected ? ' create-counter-menu__swatch--selected' : ''}`}
                  style={{ backgroundColor: color }}
                  aria-label={`Select color ${color}`}
                  aria-pressed={selected}
                  onClick={() => setSelectedColor(color)}
                />
              )
            })}
          </div>
        </fieldset>

        <label className="create-counter-menu__name-row">
          <span className="create-counter-menu__name-label">add counter</span>
          <input
            className="create-counter-menu__name-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="enter counter name"
            autoComplete="off"
          />
        </label>
      </div>
    </div>
  )
}
