import { analyticsController } from '~/src/server/analytics/controller.js'

/**
 * Sets up the routes used in the /about page.
 * These routes are registered in src/server/router.js.
 * @satisfies {ServerRegisterPluginObject<void>}
 */
export const analytics = {
  plugin: {
    name: 'analytics',
    register(server) {
      server.route([
        {
          method: 'GET',
          path: '/analytics',
          options: {
            auth: { mode: 'try' }
          },
          ...analyticsController
        }
      ])
    }
  }
}

/**
 * @import { ServerRegisterPluginObject } from '@hapi/hapi'
 */
