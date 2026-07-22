import { useEffect, useState } from 'react'
import { AllCountersView } from './components/AllCountersView/AllCountersView.jsx'
import { Button } from './components/Button/Button.jsx'
import { CounterCard } from './components/CounterCard/CounterCard.jsx'
import { CounterDetailView } from './components/CounterDetailView/CounterDetailView.jsx'
import { CreateCounterMenu } from './components/CreateCounterMenu/CreateCounterMenu.jsx'
import { getCounterTotal } from './data/counterModel.js'
import {
  appendEntry,
  createCounter,
  loadAllCounterEntries,
  loadCounterEntries,
  loadCounters,
  updateEntryTimestamp,
} from './data/counterStorage.js'
import './App.css'

const ChartIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M4 19V9M10 19V5M16 19v-7M22 19H2"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const LogoutIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const App = ({ onSignOut }) => {
  const [counters, setCounters] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [entriesLoading, setEntriesLoading] = useState(false)
  const [allChartsLoading, setAllChartsLoading] = useState(false)
  const [showCreateMenu, setShowCreateMenu] = useState(false)
  const [showAllCharts, setShowAllCharts] = useState(false)
  const [selectedCounterId, setSelectedCounterId] = useState(null)

  useEffect(() => {
    let cancelled = false

    loadCounters()
      .then((data) => {
        if (cancelled) return
        setCounters(data)
        setLoading(false)
      })
      .catch((error) => {
        if (cancelled) return
        setLoadError(error.message ?? String(error))
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const updateCount = (id, delta) => {
    if (delta === 0) return
    const timestamp = Date.now()
    const tempId = `temp-${timestamp}-${Math.random()}`
    setCounters((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c
        return {
          ...c,
          total: c.total + delta,
          entries:
            c.entries == null
              ? c.entries
              : [...c.entries, { id: tempId, count: delta, timestamp }],
        }
      }),
    )
    appendEntry(id, delta, timestamp)
      .then((entry) => {
        setCounters((prev) =>
          prev.map((c) => {
            if (c.id !== id || c.entries == null) return c
            return {
              ...c,
              entries: c.entries.map((e) => (e.id === tempId ? entry : e)),
            }
          }),
        )
      })
      .catch((error) => {
        console.error('Failed to save entry', error)
      })
  }

  const handleUpdateEntryTimestamp = (counterId, entryId, timestamp) => {
    setCounters((prev) =>
      prev.map((c) => {
        if (c.id !== counterId || c.entries == null) return c
        return {
          ...c,
          entries: c.entries.map((e) =>
            e.id === entryId ? { ...e, timestamp } : e,
          ),
        }
      }),
    )
    updateEntryTimestamp(entryId, timestamp).catch((error) => {
      console.error('Failed to update entry date', error)
    })
  }

  const handleSaveCounter = ({ name, color }) => {
    const id = String(Date.now())
    setCounters((prev) => [
      ...prev,
      { id, name, color, total: 0, entries: null },
    ])
    setShowCreateMenu(false)
    createCounter({ id, name, color }).catch((error) => {
      console.error('Failed to create counter', error)
    })
  }

  const handleOpenCounter = (id) => {
    setSelectedCounterId(id)
    const counter = counters.find((c) => c.id === id)
    if (!counter || counter.entries != null) return

    setEntriesLoading(true)
    loadCounterEntries(id)
      .then((entries) => {
        setCounters((prev) =>
          prev.map((c) =>
            c.id === id
              ? { ...c, entries, total: getCounterTotal(entries) }
              : c,
          ),
        )
      })
      .catch((error) => {
        console.error('Failed to load entries', error)
      })
      .finally(() => {
        setEntriesLoading(false)
      })
  }

  const handleOpenAllCharts = () => {
    setShowAllCharts(true)
    const needsLoad = counters.some((c) => c.entries == null)
    if (!needsLoad) return

    setAllChartsLoading(true)
    loadAllCounterEntries()
      .then((byCounter) => {
        setCounters((prev) =>
          prev.map((c) => {
            if (c.entries != null) return c
            const entries = byCounter[c.id] ?? []
            return { ...c, entries, total: getCounterTotal(entries) }
          }),
        )
      })
      .catch((error) => {
        console.error('Failed to load all entries', error)
      })
      .finally(() => {
        setAllChartsLoading(false)
      })
  }

  const selectedCounter = counters.find((c) => c.id === selectedCounterId)

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">
          <img
            className="app__logo"
            src="/icons/icon-192.png"
            alt=""
            width={32}
            height={32}
          />
          Minplus
        </h1>
        <div className="app__header-actions">
          <Button
            type="button"
            variant="icon"
            backgroundColor="var(--color-interactive)"
            className="app__charts-btn"
            onClick={handleOpenAllCharts}
            ariaLabel="Open all charts"
          >
            <ChartIcon />
          </Button>
          {onSignOut && (
            <Button
              type="button"
              variant="icon"
              backgroundColor="var(--color-button-inactive)"
              className="app__logout-btn"
              onClick={onSignOut}
              ariaLabel="Sign out"
            >
              <LogoutIcon />
            </Button>
          )}
        </div>
      </header>
      <main className="app__main">
        {loading && <p className="app__status">Loading…</p>}
        {loadError && (
          <p className="app__status app__status--error">{loadError}</p>
        )}
        {!loading && !loadError && (
          <ul className="app__grid">
            {counters.map((counter) => (
              <li key={counter.id} className="app__grid-item">
                <CounterCard
                  name={counter.name}
                  count={counter.total}
                  backgroundColor={counter.color}
                  onOpen={() => handleOpenCounter(counter.id)}
                  onIncrement={() => updateCount(counter.id, 1)}
                  onDecrement={() => updateCount(counter.id, -1)}
                />
              </li>
            ))}
          </ul>
        )}
      </main>
      <div className="app__fab">
        <Button
          backgroundColor="var(--color-interactive)"
          onClick={() => setShowCreateMenu(true)}
        >
          Add counter
        </Button>
      </div>
      {selectedCounter && (
        <CounterDetailView
          name={selectedCounter.name}
          entries={selectedCounter.entries ?? []}
          total={selectedCounter.total}
          backgroundColor={selectedCounter.color}
          loading={entriesLoading && selectedCounter.entries == null}
          onBack={() => setSelectedCounterId(null)}
          onUpdateEntryTimestamp={(entryId, timestamp) =>
            handleUpdateEntryTimestamp(selectedCounter.id, entryId, timestamp)
          }
        />
      )}
      {showAllCharts && (
        <AllCountersView
          counters={counters}
          loading={allChartsLoading}
          onBack={() => setShowAllCharts(false)}
        />
      )}
      {showCreateMenu && (
        <CreateCounterMenu
          onCancel={() => setShowCreateMenu(false)}
          onSave={handleSaveCounter}
        />
      )}
    </div>
  )
}
