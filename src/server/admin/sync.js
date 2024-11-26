import { createLogger } from '~/src/server/common/helpers/logging/logger.js'
import { config } from '~/src/config/config.js'
import axios from 'axios'

const syncController = {
  handler: async (request, h) => {
    const logger = createLogger()
    const requested = {
      params: request.params,
      query: request.query,
      form: request.form
    }
    logger.info(`Sync received request: ${JSON.stringify(requested)}`)

    const backendApi = config.get('coreBackend.apiUrl')
    const authedUser = await request.getUserSession()
    const url = `${backendApi}/sync/${request.query.resource}?syncPeriod=${request.query.period}`

    logger.info(`Making API call to ${url}`)

    await axios.get(url, {
      headers: {
        Authorization: `Bearer ${authedUser.jwt}`
      }
    })

    return h.redirect(`/admin`)
  }
}

export { syncController }
