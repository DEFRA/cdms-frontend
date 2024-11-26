import { authCallbackController } from '~/src/server/auth/callback-controller.js'
import { homeController } from '~/src/server/auth/controller.js'
import { authenticatedProxyController } from '~/src/server/auth/authenticated-proxy.js'
const auth = {
  plugin: {
    name: 'auth',
    register: (server) => {
      server.route([
        {
          method: 'GET',
          path: '/auth/proxy/{path*}',
          ...authenticatedProxyController
        },
        {
          method: 'GET',
          path: '/auth',
          options: {
            auth: { mode: 'try' }
          },
          ...homeController
        },
        {
          method: ['GET', 'POST'],
          path: '/auth/callback',
          ...authCallbackController
        }
      ])
    }
  }
}

export { auth }
