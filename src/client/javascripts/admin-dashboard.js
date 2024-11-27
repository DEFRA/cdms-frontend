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
  Legend,
  Title
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
  Legend,
  Title
)

function createImportNotificationsLinkingByCreated(data) {
  createImportNotificationsLinkingByDate(
    'importNotificationsLinkingByCreated',
    'Import Notification Linking By CHED Type & Match Status',
    'Created Date',
    data
  )
}
function createImportNotificationsLinkingByArrival(data) {
  createImportNotificationsLinkingByDate(
    'importNotificationsLinkingByArrival',
    'Import Notification Linking By CHED Type & Match Status',
    'Arrival Date',
    data
  )
}
function createImportNotificationsLinkingByDate(
  elementId,
  title,
  dateFieldLabel,
  data
) {
  const datasets = data.map((r) => ({
    label: r.name,
    data: r.dates.map((d) => d.value)
  }))

  /* eslint-disable no-new */ // @ts-expect-error: code from chart.js
  new Chart(document.getElementById(elementId), {
    type: 'line',
    data: {
      labels: data[0].dates.map((d) => d.date),
      datasets
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          position: 'top',
          text: title
        }
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: dateFieldLabel
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'Count'
          }
        }
      }
    }
  })
}

export const setup = async function () {
  await (async function () {
    const url = `/auth/proxy/analytics/get-dashboard`

    const result = await axios.get(url)

    createImportNotificationsLinkingByArrival(
      result.data.importNotificationLinkingByArrival
    )
    createImportNotificationsLinkingByCreated(
      result.data.importNotificationLinkingByCreated
    )
  })()
}
