import { get as httpsGet } from 'https'
import { get as httpGet } from 'http'
import { createLogger } from '~/src/server/common/helpers/logging/logger.js'
import { config } from '~/src/config/config.js'

const authenticatedProxyController = {
  handler: async (request) => {
    const logger = createLogger()
    const requested = { params: request.params, query: request.query }
    logger.info(
      `Authenticated proxy received request: ${JSON.stringify(requested)}`
    )

    const authedUser = await request.getUserSession()
    const backendApi = new URL(config.get('coreBackend.apiUrl'))
    const searchParams = new URLSearchParams(request.query)
    const qs = searchParams.size ? `?${searchParams.toString()}` : ''
    return new Promise((resolve, reject) => {
      const options = {
        hostname: backendApi.hostname,
        port: backendApi.port,
        path: `/${request.params.path}${qs}`,
        query: request.query,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authedUser.jwt}` // token
        }
      }

      const get = backendApi.protocol === 'https:' ? httpsGet : httpGet

      logger.info(
        `Authenticated proxy protocol=${backendApi.protocol} options: ${JSON.stringify(options)}`
      )

      get(options, (res) => {
        const data = []
        logger.info('Status Code:', res.statusCode)

        if (res.statusCode === 200) {
          res.on('data', (chunk) => {
            data.push(chunk)
          })

          res.on('end', () => {
            logger.info('Response ended: ')

            const body = Buffer.concat(data).toString()
            let res = JSON.parse(body)

            if (typeof res !== 'object') {
              res = { responseBody: res }
            }

            res.originalQuery = requested
            resolve(res)
          })
        } else {
          logger.info(`Non 200 status received : ${res.statusCode}`)
          resolve({
            originalQuery: requested,
            error: `Proxied API returned ${res.statusCode}`
          })
          // reject(`Non 200 status received : ${res.statusCode}`)
        }
      }).on('error', (err) => {
        logger.error('Authenticated Proxy Error: ', err.message)
        reject(err)
      })
    })
  }
}

export { authenticatedProxyController }
