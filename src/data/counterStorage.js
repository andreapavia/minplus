import { supabase } from './supabaseClient.js'
import { getCounterTotal } from './counterModel.js'

/**
 * @param {string | Date} value
 * @returns {number}
 */
const toMs = (value) => new Date(value).getTime()

/**
 * List load: one request. Totals from entry counts only — no timestamps yet.
 * @returns {Promise<{ id: string, name: string, color: string, total: number, entries: null }[]>}
 */
export const loadCounters = async () => {
  const { data, error } = await supabase
    .from('counters')
    .select('id, name, color, entries(count)')
    .order('created_at', { ascending: true })

  if (error) throw error

  return (data ?? []).map((counter) => ({
    id: counter.id,
    name: counter.name,
    color: counter.color,
    total: getCounterTotal(counter.entries ?? []),
    entries: null,
  }))
}

/**
 * Detail load: one request for that counter's history.
 * @param {string} counterId
 * @returns {Promise<{ id: number, count: number, timestamp: number }[]>}
 */
export const loadCounterEntries = async (counterId) => {
  const { data, error } = await supabase
    .from('entries')
    .select('id, count, timestamp')
    .eq('counter_id', counterId)
    .order('timestamp', { ascending: true })

  if (error) throw error

  return (data ?? []).map((entry) => ({
    id: entry.id,
    count: entry.count,
    timestamp: toMs(entry.timestamp),
  }))
}

/**
 * Load every entry once, grouped by counter id.
 * @returns {Promise<Record<string, { id: number, count: number, timestamp: number }[]>>}
 */
export const loadAllCounterEntries = async () => {
  const { data, error } = await supabase
    .from('entries')
    .select('id, count, timestamp, counter_id')
    .order('timestamp', { ascending: true })

  if (error) throw error

  /** @type {Record<string, { id: number, count: number, timestamp: number }[]>} */
  const byCounter = {}
  for (const entry of data ?? []) {
    const counterId = String(entry.counter_id)
    if (!byCounter[counterId]) byCounter[counterId] = []
    byCounter[counterId].push({
      id: entry.id,
      count: entry.count,
      timestamp: toMs(entry.timestamp),
    })
  }
  return byCounter
}

/**
 * @param {{ id: string, name: string, color: string }} counter
 */
export const createCounter = async ({ id, name, color }) => {
  const { error } = await supabase.from('counters').insert({ id, name, color })
  if (error) throw error
}

/**
 * @param {string} counterId
 * @param {number} count
 * @param {number} [timestampMs]
 * @returns {Promise<{ id: number, count: number, timestamp: number }>}
 */
export const appendEntry = async (counterId, count, timestampMs = Date.now()) => {
  const { data, error } = await supabase
    .from('entries')
    .insert({
      counter_id: counterId,
      count,
      timestamp: new Date(timestampMs).toISOString(),
    })
    .select('id, count, timestamp')
    .single()

  if (error) throw error

  return {
    id: data.id,
    count: data.count,
    timestamp: toMs(data.timestamp),
  }
}

/**
 * @param {number} entryId
 * @param {number} timestampMs
 */
export const updateEntryTimestamp = async (entryId, timestampMs) => {
  const { error } = await supabase
    .from('entries')
    .update({ timestamp: new Date(timestampMs).toISOString() })
    .eq('id', entryId)

  if (error) throw error
}
