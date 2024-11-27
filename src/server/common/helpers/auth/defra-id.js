import fetch from 'node-fetch'
import jwt from '@hapi/jwt'
import bell from '@hapi/bell'

import { config } from '~/src/config/config.js'

// class OidcConfigurationResponseType {
//   authorization_endpoint = undefined
//   token_endpoint = undefined
//   end_session_endpoint = undefined
// }

const defraId = {
  plugin: {
    name: 'defra-id',
    register: async (server) => {
      const oidcConfigurationUrl = config.get('defraId.oidcConfiguration.url')
      const serviceId = config.get('defraId.serviceId')
      const clientId = config.get('defraId.clientId')
      const clientSecret = config.get('defraId.clientSecret')
      const authCallbackUrl = config.get('appBaseUrl') + '/auth/callback'

      await server.register(bell)

      // TODO : This oidcConf not being typed is causing a problem - unsure why
      /**
       * @returns {{authorization_endpoint: string, token_endpoint: string, end_session_endpoint: string}}
       */
      const oidcConf = await fetch(oidcConfigurationUrl).then((res) =>
        res.json()
      )

      server.auth.strategy('defra-id', 'bell', {
        location: (request) => {
          if (request.info.referrer) {
            request.yar.flash('referrer', request.info.referrer)
          }

          return authCallbackUrl
        },
        provider: {
          name: 'defra-id',
          protocol: 'oauth2',
          useParamsAuth: true,

          // @ts-expect-error erorring due to oidcConf format above
          auth: oidcConf.authorization_endpoint,
          // @ts-expect-error erorring due to oidcConf format above
          token: oidcConf.token_endpoint,
          scope: ['openid', 'offline_access'],
          profile: function (credentials, params) {
            const payload = jwt.token.decode(credentials.token).decoded.payload
            const displayName = [payload.firstName, payload.lastName]
              .filter((part) => part)
              .join(' ')

            credentials.profile = {
              id: payload.sub,
              correlationId: payload.correlationId,
              sessionId: payload.sessionId,
              contactId: payload.contactId,
              serviceId: payload.serviceId,
              firstName: payload.firstName,
              lastName: payload.lastName,
              displayName,
              email: payload.email,
              uniqueReference: payload.uniqueReference,
              loa: payload.loa,
              aal: payload.aal,
              enrolmentCount: payload.enrolmentCount,
              enrolmentRequestCount: payload.enrolmentRequestCount,
              currentRelationshipId: payload.currentRelationshipId,
              relationships: payload.relationships,
              roles: payload.roles,
              idToken: params.id_token,
              jwt: credentials.token,
              jwt_contents: JSON.stringify(payload),
              // @ts-expect-error erorring due to oidcConf format above
              tokenUrl: oidcConf.token_endpoint,
              // @ts-expect-error erorring due to oidcConf format above
              logoutUrl: oidcConf.end_session_endpoint
            }
          }
        },
        password: config.get('session.cookie.password'),
        clientId,
        clientSecret,
        cookie: 'bell-defra-id',
        isSecure: false,
        providerParams: {
          serviceId
        }
      })
    }
  }
}

export { defraId }
