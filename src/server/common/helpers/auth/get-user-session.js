import { createLogger } from '~/src/server/common/helpers/logging/logger.js'

const logger = createLogger()

async function getUserSession() {
  const sessionId = this.state?.userSession?.sessionId
  logger.debug('getUserSession sessionId', sessionId)
  if (sessionId) {
    logger.debug('getUserSession getting session state from app.cache')
    const state = await this.server.app.cache.get(
      this.state.userSession.sessionId
    )
    logger.debug('getUserSession state', state)
    return state
  } else {
    logger.debug(`getUserSession sessionId=${sessionId}`)
    return {}
  }
}

export { getUserSession }
