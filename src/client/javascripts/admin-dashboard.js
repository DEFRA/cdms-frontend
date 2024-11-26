import {
  Chart,
  Colors,
  BarController,
  LineController,
  LineElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  Legend
} from 'chart.js'

import axios from 'axios'

Chart.register(
  Colors,
  BarController,
  LineController,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend
)

export const setup = async function () {
  await (async function () {
    const url = `/auth/proxy/analytics/import-notifications/matching-by-arrival`

    const result = await axios.get(url)

    const datasets = result.data.results.map((r) => ({
      label: r.name,
      data: r.dates.map((d) => d.value)
    }))

    /* eslint-disable no-new */ // @ts-expect-error: code from chart.js
    new Chart(document.getElementById('analytics'), {
      type: 'line',
      data: {
        labels: result.data.results[0].dates.map((d) => d.date),
        datasets
      }
    })
  })()
}
