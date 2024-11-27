// import { isEmpty } from 'lodash'
// import { isEmpty } from 'lodash'

import { provideAuthedUser } from '~/src/server/logout/prerequisites/provide-authed-user.js'
// const { isEmpty } = lodash

const isEmpty = (prms) => {
  return Object.keys(prms).length === 0 && prms.constructor === Object
}
const logoutController = {
  options: {
    pre: [provideAuthedUser]
  },
  handler: (request, h) => {
    const authedUser = request.pre.authedUser

    if (isEmpty(authedUser)) {
      return h.redirect('/')
    }

    const referrer = request.info.referrer
    const idTokenHint = authedUser.idToken

    const logoutUrl = encodeURI(
      `${authedUser.logoutUrl}?id_token_hint=${idTokenHint}&post_logout_redirect_uri=${referrer}`
    )

    request.dropUserSession()
    request.cookieAuth.clear()

    return h.redirect(logoutUrl)
  }
}

export { logoutController }
