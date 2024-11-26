import path from 'path'
import hapi from '@hapi/hapi'

import { config } from '~/src/config/config.js'
import { nunjucksConfig } from '~/src/config/nunjucks/nunjucks.js'
import { router } from './router.js'
import { requestLogger } from '~/src/server/common/helpers/logging/request-logger.js'
import { catchAll } from '~/src/server/common/helpers/errors.js'
import { secureContext } from '~/src/server/common/helpers/secure-context/index.js'
import { sessionCache } from '~/src/server/common/helpers/session-cache/session-cache.js'
import { getCacheEngine } from '~/src/server/common/helpers/session-cache/cache-engine.js'
import { pulse } from '~/src/server/common/helpers/pulse.js'
import { defraId } from '~/src/server/common/helpers/auth/defra-id.js'
import { sessionCookie } from '~/src/server/common/helpers/auth/session-cookie.js'
import { getUserSession } from '~/src/server/common/helpers/auth/get-user-session.js'
import { dropUserSession } from '~/src/server/common/helpers/auth/drop-user-session.js'

export async function createServer() {
  const server = hapi.server({
    port: config.get('port'),
    routes: {
      auth: {
        mode: 'required'
      },
      validate: {
        options: {
          abortEarly: false
        }
      },
      files: {
        relativeTo: path.resolve(config.get('root'), '.public')
      },
      security: {
        hsts: {
          maxAge: 31536000,
          includeSubDomains: true,
          preload: false
        },
        xss: 'enabled',
        noSniff: true,
        xframe: true
      }
    },
    debug: {
      log: ['*'],
      request: ['*']
    },
    router: {
      stripTrailingSlash: true
    },
    cache: [
      {
        name: config.get('session.cache.name'),
        engine: getCacheEngine(
          /** @type {Engine} */ (config.get('session.cache.engine'))
        )
      }
    ]
  })

  // @ts-expect-error unsure why it's so upset
  server.app.cache = server.cache({
    cache: 'session',
    expiresIn: config.get('session.cache.ttl'),
    segment: 'session'
  })

  server.decorate('request', 'getUserSession', getUserSession)
  server.decorate('request', 'dropUserSession', dropUserSession)

  await server.register([
    requestLogger,
    secureContext,
    pulse,
    sessionCache,
    nunjucksConfig,
    defraId,
    sessionCookie,
    router // Register all the controllers/routes defined in src/server/router.js
  ])

  server.ext('onPreResponse', catchAll)

  return server
}

/**
 * @import {Engine} from '~/src/server/common/helpers/session-cache/cache-engine.js'
 */
