import { useMemo, useState } from 'react'
import Highcharts from 'highcharts'
import { HighchartsReact } from 'highcharts-react-official'
import {
  buildCumulativeChartSeries,
  buildPerTickChartSeries,
  getChartTimeRange,
} from '../../data/chartSeries.js'
import './CounterTrendChart.css'

const PERIOD_TABS = [
  { id: 'day', label: 'Day' },
  { id: 'month', label: 'Month' },
  { id: 'year', label: 'Year' },
]

/**
 * @param {string} cssColor
 */
const resolveCssColor = (cssColor) => {
  if (typeof document === 'undefined') return cssColor
  const probe = document.createElement('span')
  probe.style.backgroundColor = cssColor
  document.body.appendChild(probe)
  const resolved = getComputedStyle(probe).backgroundColor
  probe.remove()
  return resolved || cssColor
}

/**
 * @param {{
 *   chartType: 'line' | 'column'
 *   series: { name: string, points: { x: number, y: number }[], color: string }[]
 *   period: 'day' | 'month' | 'year'
 * }} args
 */
const buildChartOptions = ({ chartType, series, period }) => {
  const tooltipDateFormat =
    period === 'day'
      ? '%d %b %Y, %H:00'
      : period === 'month'
        ? '%d %b %Y'
        : '%b %Y'

  const maxPoints = series.reduce(
    (max, s) => Math.max(max, s.points.length),
    0,
  )

  return {
    chart: {
      type: chartType,
      backgroundColor: 'transparent',
      height: 220,
      spacing: [8, 4, 8, 4],
    },
    title: { text: undefined },
    credits: { enabled: false },
    legend: { enabled: false },
    xAxis: {
      type: 'datetime',
      lineColor: 'transparent',
      tickColor: 'transparent',
      labels: {
        style: {
          color: '#6b7280',
          fontSize: '11px',
        },
      },
    },
    yAxis: {
      title: { text: undefined },
      gridLineColor: '#e5e7eb',
      gridLineWidth: 1,
      allowDecimals: false,
      labels: {
        style: {
          color: '#6b7280',
          fontSize: '11px',
        },
      },
    },
    tooltip: {
      shared: true,
      xDateFormat: tooltipDateFormat,
      backgroundColor: '#1a1a1a',
      borderWidth: 0,
      borderRadius: 12,
      style: { color: '#ffffff' },
    },
    plotOptions: {
      series: {
        marker: {
          enabled: chartType === 'line' && maxPoints <= 24,
          radius: 3,
          lineWidth: 0,
        },
        lineWidth: 2.5,
      },
      column: {
        borderWidth: 0,
        borderRadius: 4,
        pointPadding: 0.05,
        groupPadding: 0.05,
      },
    },
    series: series.map((s) => ({
      type: chartType,
      name: s.name,
      data: s.points.map((p) => [p.x, p.y]),
      color: s.color,
      marker: {
        fillColor: s.color,
      },
    })),
  }
}

/**
 * @typedef {{ id: string, name: string, entries: { count: number, timestamp: number }[], color: string }} ChartSeriesInput
 */

/**
 * @param {{
 *   entries?: { count: number, timestamp: number }[]
 *   lineColor?: string
 *   series?: ChartSeriesInput[]
 * }} props
 */
export const CounterTrendChart = ({
  entries,
  lineColor,
  series: seriesProp,
}) => {
  const [period, setPeriod] = useState('day')
  const [toDate, setToDate] = useState(false)

  const chartSeries = useMemo(() => {
    if (seriesProp) return seriesProp
    return [
      {
        id: 'single',
        name: 'Total',
        entries: entries ?? [],
        color: lineColor ?? 'var(--pastel-blue)',
      },
    ]
  }, [seriesProp, entries, lineColor])

  const resolvedColors = useMemo(
    () => chartSeries.map((s) => resolveCssColor(s.color)),
    [chartSeries],
  )

  const { trendSeries, perTickSeries } = useMemo(() => {
    const { start, end } = getChartTimeRange(
      period,
      period === 'day' ? false : toDate,
    )

    return {
      trendSeries: chartSeries.map((s, i) => ({
        name: seriesProp ? s.name : 'Total',
        color: resolvedColors[i],
        points: buildCumulativeChartSeries(s.entries, start, end),
      })),
      perTickSeries: chartSeries.map((s, i) => ({
        name: seriesProp ? s.name : 'Counts',
        color: resolvedColors[i],
        points: buildPerTickChartSeries(s.entries, start, end, period),
      })),
    }
  }, [chartSeries, resolvedColors, period, toDate, seriesProp])

  const trendOptions = useMemo(
    () =>
      buildChartOptions({
        chartType: 'line',
        series: trendSeries,
        period,
      }),
    [trendSeries, period],
  )

  const perTickOptions = useMemo(
    () =>
      buildChartOptions({
        chartType: 'column',
        series: perTickSeries,
        period,
      }),
    [perTickSeries, period],
  )

  const showToDate = period === 'month' || period === 'year'
  const hasSeries = chartSeries.length > 0

  return (
    <section className="counter-trend-chart" aria-label="Count charts">
      <div className="counter-trend-chart__tabs" role="tablist" aria-label="Time range">
        {PERIOD_TABS.map((tab) => {
          const selected = tab.id === period
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              className={`counter-trend-chart__tab${selected ? ' counter-trend-chart__tab--selected' : ''}`}
              onClick={() => setPeriod(tab.id)}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {showToDate && (
        <label className="counter-trend-chart__to-date">
          <input
            type="checkbox"
            className="counter-trend-chart__to-date-input"
            checked={toDate}
            onChange={(e) => setToDate(e.target.checked)}
          />
          <span className="counter-trend-chart__to-date-label">To date</span>
        </label>
      )}

      <h3 className="counter-trend-chart__heading">Trend</h3>
      <div className="counter-trend-chart__plot">
        {hasSeries ? (
          <HighchartsReact highcharts={Highcharts} options={trendOptions} />
        ) : (
          <p className="counter-trend-chart__empty">No counters selected.</p>
        )}
      </div>

      <h3 className="counter-trend-chart__heading">Per tick</h3>
      <div className="counter-trend-chart__plot">
        {hasSeries ? (
          <HighchartsReact highcharts={Highcharts} options={perTickOptions} />
        ) : (
          <p className="counter-trend-chart__empty">No counters selected.</p>
        )}
      </div>
    </section>
  )
}
