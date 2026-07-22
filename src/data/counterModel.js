/** @typedef {{ count: number, timestamp: number }} CounterEntry */

/**
 * @param {CounterEntry[]} entries
 */
export const getCounterTotal = (entries) =>
  entries.reduce((sum, entry) => sum + entry.count, 0)

/**
 * @param {CounterEntry[]} entries
 * @param {number} delta
 * @returns {CounterEntry[]}
 */
export const appendCounterEntry = (entries, delta) => {
  if (delta === 0) return entries
  return [...entries, { count: delta, timestamp: Date.now() }]
}

/**
 * @param {number} timestamp
 */
export const formatEntryTimestamp = (timestamp) => {
  const date = new Date(timestamp)
  const day = date.getDate()
  const month = date.toLocaleString('en-GB', { month: 'long' })
  const year = date.getFullYear()
  const time = date.toLocaleString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  return `${day} ${month} ${year}:${time}`
}

/**
 * @param {number} count
 * @param {number} [baseTime]
 * @returns {CounterEntry[]}
 */
export const seedEntries = (count, baseTime = Date.now()) => {
  if (count <= 0) return []
  const hourMs = 3600000
  return Array.from({ length: count }, (_, index) => ({
    count: 1,
    timestamp: baseTime - (count - index) * hourMs,
  }))
}
