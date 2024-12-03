import convict from 'convict'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const fourHoursMs = 14400000
const oneWeekMs = 604800000

const isProduction = process.env.NODE_ENV === 'production'
const isTest = process.env.NODE_ENV === 'test'
const isDevelopment = process.env.NODE_ENV === 'development'

export const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 5001,
    env: 'PORT'
  },
  version: {
    doc: 'The version number of the frontend service',
    format: String,
    default: '0.0.0 (local)',
    env: 'CONTAINER_VERSION'
  },
  staticCacheTimeout: {
    doc: 'Static cache timeout in milliseconds',
    format: Number,
    default: oneWeekMs,
    env: 'STATIC_CACHE_TIMEOUT'
  },
  serviceName: {
    doc: 'Applications Service Name',
    format: String,
    default: 'cdms-frontend'
  },
  root: {
    doc: 'Project root',
    format: String,
    default: path.resolve(dirname, '../..')
  },
  assetPath: {
    doc: 'Asset path',
    format: String,
    default: '/public',
    env: 'ASSET_PATH'
  },
  isProduction: {
    doc: 'If this application running in the production environment',
    format: Boolean,
    default: isProduction
  },
  isDevelopment: {
    doc: 'If this application running in the development environment',
    format: Boolean,
    default: isDevelopment
  },
  isTest: {
    doc: 'If this application running in the test environment',
    format: Boolean,
    default: isTest
  },
  coreBackend: {
    apiUrl: {
      doc: 'The Trade Data Matching json:api backend.',
      format: String,
      default: 'http://cdms-backend.localtest.me:5002',
      env: 'CORE_BACKEND_API_URL'
    },
    exampleNotification: {
      doc: 'An example CHED ID from the backend.',
      format: String,
      default: 'CHEDA.GB.2024.1009875',
      env: 'TDM_API_EXAMPLE_NOTIFICATION'
    },
    apiVersion: {
      doc: 'The version number of the backend service',
      format: String,
      default: '0.0.0 (local)'
    }
  },
  appBaseUrl: {
    doc: 'Application base URL for after we login',
    format: String,
    default: 'http://cdms-frontend.localtest.me:5001',
    env: 'APP_BASE_URL'
  },
  defraId: {
    manageAccountUrl: {
      doc: 'DEFRA ID Manage Account URL, defaults to docker compose defra ID stub',
      format: String,
      env: 'DEFRA_ID_MANAGE_ACCOUNT_URL',
      default:
        'http://cdp-defra-id-stub.localtest.me:9200/cdp-defra-id-stub/login'
    },
    oidcConfiguration: {
      url: {
        doc: 'DEFRA ID OIDC Configuration URL, defaults to docker compose defra ID stub',
        format: String,
        env: 'DEFRA_ID_OIDC_CONFIGURATION_URL',
        default:
          'http://cdp-defra-id-stub.localtest.me:9200/cdp-defra-id-stub/.well-known/openid-configuration'
      }
    },
    serviceId: {
      doc: 'DEFRA ID Service ID',
      format: String,
      env: 'DEFRA_ID_SERVICE_ID',
      default: 'd7d72b79-9c62-ee11-8df0-000d3adf7047'
    },
    clientId: {
      doc: 'DEFRA ID Client ID',
      format: String,
      env: 'DEFRA_ID_CLIENT_ID',
      default: '2fb0d715-affa-4bf1-836e-44a464e3fbea'
    },
    clientSecret: {
      doc: 'DEFRA ID Client Secret',
      format: String,
      sensitive: true,
      env: 'DEFRA_ID_CLIENT_SECRET',
      default: 'test_value'
    }
  },
  log: {
    enabled: {
      doc: 'Is logging enabled',
      format: Boolean,
      default: process.env.NODE_ENV !== 'test',
      env: 'LOG_ENABLED'
    },
    level: {
      doc: 'Logging level',
      format: ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'],
      default: 'info',
      env: 'LOG_LEVEL'
    },
    format: {
      doc: 'Format to output logs in.',
      format: ['ecs', 'pino-pretty'],
      default: isProduction ? 'ecs' : 'pino-pretty',
      env: 'LOG_FORMAT'
    }
  },
  httpProxy: /** @type {SchemaObj<string | null>} */ ({
    doc: 'HTTP Proxy',
    format: String,
    nullable: true,
    default: null,
    env: 'CDP_HTTP_PROXY'
  }),
  httpsProxy: /** @type {SchemaObj<string | null>} */ ({
    doc: 'HTTPS Proxy',
    format: String,
    nullable: true,
    default: null,
    env: 'CDP_HTTPS_PROXY'
  }),
  isSecureContextEnabled: {
    doc: 'Enable Secure Context',
    format: Boolean,
    default: isProduction,
    env: 'ENABLE_SECURE_CONTEXT'
  },
  isMetricsEnabled: {
    doc: 'Enable metrics reporting',
    format: Boolean,
    default: isProduction,
    env: 'ENABLE_METRICS'
  },
  session: {
    cache: {
      engine: {
        doc: 'backend cache is written to',
        format: ['redis', 'memory'],
        default: 'redis',
        env: 'SESSION_CACHE_ENGINE'
      },
      name: {
        doc: 'server side session cache name',
        format: String,
        default: 'session',
        env: 'SESSION_CACHE_NAME'
      },
      ttl: {
        doc: 'server side session cache ttl',
        format: Number,
        default: fourHoursMs,
        env: 'SESSION_CACHE_TTL'
      }
    },
    cookie: {
      ttl: {
        doc: 'Session cookie ttl',
        format: Number,
        default: fourHoursMs,
        env: 'SESSION_COOKIE_TTL'
      },
      password: {
        doc: 'session cookie password',
        format: String,
        default: 'the-password-must-be-at-least-32-characters-long',
        env: 'SESSION_COOKIE_PASSWORD',
        sensitive: true
      },
      secure: {
        doc: 'set secure flag on cookie',
        format: Boolean,
        default: isProduction,
        env: 'SESSION_COOKIE_SECURE'
      }
    }
  },
  redis: /** @type {Schema<RedisConfig>} */ ({
    host: {
      doc: 'Redis cache host',
      format: String,
      default: '127.0.0.1',
      env: 'REDIS_HOST'
    },
    port: {
      doc: 'Redis cache port',
      format: Number,
      default: 6979,
      env: 'REDIS_HOST'
    },

    username: {
      doc: 'Redis cache username',
      format: String,
      default: '',
      env: 'REDIS_USERNAME'
    },
    password: {
      doc: 'Redis cache password',
      format: '*',
      default: '',
      sensitive: true,
      env: 'REDIS_PASSWORD'
    },
    keyPrefix: {
      doc: 'Redis cache key prefix name used to isolate the cached results across multiple clients',
      format: String,
      default: 'cdms-frontend:',
      env: 'REDIS_KEY_PREFIX'
    },
    useSingleInstanceCache: {
      doc: 'Connect to a single instance of redis instead of a cluster.',
      format: Boolean,
      default: !isProduction,
      env: 'USE_SINGLE_INSTANCE_CACHE'
    }
  }),
  nunjucks: {
    watch: {
      doc: 'Reload templates when they are changed.',
      format: Boolean,
      default: isDevelopment
    },
    noCache: {
      doc: 'Use a cache and recompile templates each time',
      format: Boolean,
      default: isDevelopment
    }
  }
})

config.validate({ allowed: 'strict' })

/**
 * @import { Schema, SchemaObj } from 'convict'
 * @import { RedisConfig } from '~/src/server/common/helpers/redis-client.js'
 */
