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
  Title,
  DoughnutController,
  ArcElement
} from 'chart.js'

import ChartDataLabels from 'chartjs-plugin-datalabels';

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
  Title,
  DoughnutController,
  ArcElement
)

const colourMap = {
  'Cveda Linked': 'rgb(128,0,128)',
  'Cveda Not Linked': 'rgb(218,112,214)',
  'Ced Linked': 'rgb(0,0,255)',
  'Ced Not Linked': 'rgb(0,191,255)',
  'Cvedp Linked': 'rgb(139,69,19)',
  'Cvedp Not Linked': 'rgb(244,164,96)',
  'Cvedpp Linked': 'rgb(0,255,0)',
  'Cvedpp Not Linked': 'rgb(173,255,47)',
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

    createLast7DaysImportNotificationsLinkingStatus(result.data.last7DaysImportNotificationsLinkingStatus.values)
    createLast24HoursImportNotificationsLinkingStatus(result.data.last24HoursImportNotificationsLinkingStatus.values)
  })()
}

function createLast7DaysImportNotificationsLinkingStatus(data) {

  // data =  {'Cveda Linked': 300, 'Cvedp Linked': 50,'Cveda Not Linked':  100};

  const chartData = {
    labels: Object.keys(data),
    datasets: [{
      label: 'Import Notification Linking By CHED Type & Match Status',
      data: Object.values(data),
      backgroundColor:
        Object.keys(data).map(k => colourMap[k]),
      hoverOffset: 4
    }]
  }
  createImportLinkingStatus('last7DaysImportNotificationsLinkingStatus', 'Last 7 Days Import Notification Linking By CHED Type & Match Status', chartData)
}

function createLast24HoursImportNotificationsLinkingStatus(data) {
  // data =  {'Cveda Linked': 39, 'Cvedp Linked': 10,'Cveda Not Linked':  11};

  const chartData = {
    labels: Object.keys(data),
    datasets: [{
      label: 'Import Notification Linking By CHED Type & Match Status',
      data: Object.values(data),
      backgroundColor:
        Object.keys(data).map(k => colourMap[k]),
      hoverOffset: 4
    }]
  }
  createImportLinkingStatus('last24HoursImportNotificationsLinkingStatus2', 'Last 24 Hours Import Notification Linking By CHED Type & Match Status', chartData)
}


/**
 * @param {any} data
 */
function createImportNotificationsLinkingByCreated(data) {
  createImportNotificationsLinkingByDate(
    'importNotificationsLinkingByCreated',
    'Import Notification Linking By CHED Type & Match Status',
    'Created Date',
    data
  )
}

/**
 * @param {any} data
 */
function createImportNotificationsLinkingByArrival(data) {
  createImportNotificationsLinkingByDate(
    'importNotificationsLinkingByArrival',
    'Import Notification Linking By CHED Type & Match Status',
    'Arrival Date',
    data
  )
}

/**
 * @param {string} elementId
 * @param {string} title
 * @param {string} dateFieldLabel
 * @param {any[]} data
 */
function createImportNotificationsLinkingByDate(
  elementId,
  title,
  dateFieldLabel,
  data
) {
  const datasets = data.map((r) => ({
    label: r.name,
    borderColor: colourMap[r.name],
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
function createImportLinkingStatus(elementId, title, data) {
  /* eslint-disable no-new */ // @ts-expect-error: code from chart.js
  new Chart(document.getElementById(elementId), {
    type: 'doughnut',
    data: data,
    plugins: [ChartDataLabels],
    options: {
      maintainAspectRatio: false,
      responsive: true,

      plugins: {
        datalabels: {
          color: '#ffffff'
        },
        title: {
          display: true,
          position: 'top',
          text: title
        }
      }
    }
  })
}

