/** @typedef {'day' | 'month' | 'year'} ChartPeriod */

/**
 * @param {Date} date
 */
const startOfLocalDay = (date) => {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

/**
 * @param {Date} date
 */
const startOfLocalMonth = (date) => {
  const d = new Date(date.getFullYear(), date.getMonth(), 1)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

/**
 * @param {Date} date
 */
const endOfLocalMonth = (date) => {
  const d = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  d.setHours(23, 59, 59, 999)
  return d.getTime()
}

/**
 * @param {Date} date
 */
const startOfLocalYear = (date) => {
  const d = new Date(date.getFullYear(), 0, 1)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

/**
 * @param {Date} date
 */
const endOfLocalYear = (date) => {
  const d = new Date(date.getFullYear(), 11, 31)
  d.setHours(23, 59, 59, 999)
  return d.getTime()
}

const DAY_MS = 86400000

/**
 * @param {ChartPeriod} period
 * @param {boolean} toDate
 * @param {number} [nowMs]
 * @returns {{ start: number, end: number }}
 */
export const getChartTimeRange = (period, toDate, nowMs = Date.now()) => {
  const now = new Date(nowMs)

  if (period === 'day') {
    return { start: startOfLocalDay(now), end: nowMs }
  }

  if (period === 'month') {
    if (toDate) {
      return { start: nowMs - 30 * DAY_MS, end: nowMs }
    }
    return {
      start: startOfLocalMonth(now),
      end: Math.min(endOfLocalMonth(now), nowMs),
    }
  }

  if (toDate) {
    return { start: nowMs - 365 * DAY_MS, end: nowMs }
  }
  return {
    start: startOfLocalYear(now),
    end: Math.min(endOfLocalYear(now), nowMs),
  }
}

/**
 * @typedef {{ count: number, timestamp: number }} CounterEntry
 * @typedef {{ x: number, y: number }} ChartPoint
 */

/**
 * Cumulative counter total over time within [start, end].
 *
 * @param {CounterEntry[]} entries
 * @param {number} start
 * @param {number} end
 * @returns {ChartPoint[]}
 */
export const buildCumulativeChartSeries = (entries, start, end) => {
  const sorted = [...entries].sort((a, b) => a.timestamp - b.timestamp)

  let totalBefore = 0
  for (const entry of sorted) {
    if (entry.timestamp >= start) break
    totalBefore += entry.count
  }

  const inRange = sorted.filter(
    (entry) => entry.timestamp >= start && entry.timestamp <= end,
  )

  /** @type {ChartPoint[]} */
  const points = [{ x: start, y: totalBefore }]

  let running = totalBefore
  for (const entry of inRange) {
    running += entry.count
    points.push({ x: entry.timestamp, y: running })
  }

  const last = points[points.length - 1]
  if (last.x < end) {
    points.push({ x: end, y: last.y })
  }

  return points
}

const HOUR_MS = 3600000

/**
 * Floor a timestamp to the start of its bucket for the given period.
 *
 * @param {number} timestamp
 * @param {ChartPeriod} period
 */
const bucketStart = (timestamp, period) => {
  const d = new Date(timestamp)
  if (period === 'day') {
    d.setMinutes(0, 0, 0)
    return d.getTime()
  }
  if (period === 'month') {
    return startOfLocalDay(d)
  }
  return startOfLocalMonth(d)
}

/**
 * Next bucket boundary after `timestamp`.
 *
 * @param {number} timestamp
 * @param {ChartPeriod} period
 */
const nextBucketStart = (timestamp, period) => {
  if (period === 'day') return timestamp + HOUR_MS
  if (period === 'month') return timestamp + DAY_MS
  const d = new Date(timestamp)
  return startOfLocalMonth(
    new Date(d.getFullYear(), d.getMonth() + 1, 1),
  )
}

/**
 * Count deltas per time tick (hour / day / month) within [start, end].
 *
 * @param {CounterEntry[]} entries
 * @param {number} start
 * @param {number} end
 * @param {ChartPeriod} period
 * @returns {ChartPoint[]}
 */
export const buildPerTickChartSeries = (entries, start, end, period) => {
  /** @type {Map<number, number>} */
  const totals = new Map()

  for (const entry of entries) {
    if (entry.timestamp < start || entry.timestamp > end) continue
    const key = bucketStart(entry.timestamp, period)
    totals.set(key, (totals.get(key) ?? 0) + entry.count)
  }

  /** @type {ChartPoint[]} */
  const points = []
  let cursor = bucketStart(start, period)
  while (cursor <= end) {
    points.push({ x: cursor, y: totals.get(cursor) ?? 0 })
    cursor = nextBucketStart(cursor, period)
  }

  return points
}
