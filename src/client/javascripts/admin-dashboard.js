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
  ArcElement,
  TimeScale
} from 'chart.js'

import ChartDataLabels from 'chartjs-plugin-datalabels';
import 'chartjs-adapter-date-fns';

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
  ArcElement,
  TimeScale
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
  'Linked': 'rgb(255,153,153)',
}

export const setup = async function () {
  await (async function () {
    const url = `/auth/proxy/analytics/dashboard`

    const result = await axios.get(url)

    createStatusDoughnut('lastMonthImportNotificationsByTypeAndStatus', 'Last Month Import Notifications By CHED Type & Link Status', result.data.lastMonthImportNotificationsByTypeAndStatus.values)
    createStatusDoughnut('lastMonthMovementsByStatus', 'Last Month Movements By Link Status', result.data.lastMonthMovementsByStatus.values)

    createImportNotificationsLinkingByArrival(
      result.data.importNotificationLinkingByArrival
    )
    createImportNotificationsLinkingByCreated(
      result.data.importNotificationLinkingByCreated
    )

    createLineChart(
      'last24HoursImportNotificationsLinkingByCreated',
      'Last 24 Hours Import Notifications By CHED Type & Link Status',
      'Created Time',
      'hour',
      result.data.last24HoursImportNotificationsLinkingByCreated
    )

    createLineChart(
      'last24HoursMovementsLinkingByCreated',
      'Last 24 Hours Movements Link Status',
      'Created Time',
      'hour',
      result.data.last24HoursMovementsLinkingByCreated
    )

    createStatusDoughnut('last7DaysImportNotificationsLinkingStatus', 'Last 7 Days Import Notifications By CHED Type & Link Status', result.data.last7DaysImportNotificationsLinkingStatus.values)
    createStatusDoughnut('last24HoursImportNotificationsLinkingStatus', 'Last 24 Hours Import Notifications By CHED Type & Link Status', result.data.last24HoursImportNotificationsLinkingStatus.values)

    createLineChart(
      'movementsLinkingByCreated',
      'Movements By Link Status',
      'Created Date',
      'day',
      result.data.movementsLinkingByCreated
    )

    createLineChart(
      'movementsLinkingByArrival',
      'Movements By Link Status',
      'Arrival Date',
      'day',
      result.data.movementsLinkingByArrival
    )

  })()
}

/**
 * @param {any} data
 */
function createImportNotificationsLinkingByCreated(data) {
  createLineChart(
    'importNotificationsLinkingByCreated',
    'Import Notifications By CHED Type & Link Status',
    'Created Date',
    'day',
    data
  )
}

/**
 * @param {any} data
 */
function createImportNotificationsLinkingByArrival(data) {
  createLineChart(
    'importNotificationsLinkingByArrival',
    'Import Notifications By CHED Type & Link Status',
    'Arrival Date',
    'day',
    data
  )
}

/**
 * @param {string} elementId
 * @param {string} title
 * @param {string} dateFieldLabel
 * @param {string} xAxisUnit
 * @param {any[]} data
 */
function createLineChart(
  elementId,
  title,
  dateFieldLabel,
  xAxisUnit,
  data
) {

  if (!(data && data.length)) {
    return
  }

  const datasets = data.map((r) => ({
    label: r.name,
    borderColor: colourMap[r.name],
    data: r.periods.map((d) => d.value)
  }))

  /* eslint-disable no-new */ // @ts-expect-error: code from chart.js
  new Chart(document.getElementById(elementId), {
    type: 'line',
    data: {
      labels: data[0].periods.map((d) => d.period),
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
          },
          type: 'time',
          time: {
            unit: xAxisUnit
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
function createStatusDoughnut(elementId, title, data) {

  if (!data) {
    return
  }

  const chartData = {
    labels: Object.keys(data),
    datasets: [{
      label: title,
      data: Object.values(data),
      backgroundColor:
        Object.keys(data).map(k => colourMap[k]),
      hoverOffset: 4
    }]
  }

  /* eslint-disable no-new */ // @ts-expect-error: code from chart.js
  new Chart(document.getElementById(elementId), {
    type: 'doughnut',
    data: chartData,
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

