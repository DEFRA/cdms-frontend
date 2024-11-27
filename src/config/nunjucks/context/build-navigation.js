/**
 * @param {Partial<Request> | null} request
 */
export function buildNavigation(request) {
  return [
    {
      text: 'Home',
      url: '/',
      isActive: request?.path === '/'
    },
    {
      url: '/analytics',
      text: 'Analytics',
      isActive: request?.path === '/analytics'
    },
    {
      url: '/admin',
      text: 'Admin',
      isActive: request?.path === '/admin'
    },
    {
      url: '/auth',
      text: 'Auth',
      isActive: request?.path === '/auth'
    },
    {
      text: 'About',
      url: '/about',
      isActive: request?.path === '/about'
    }
  ]
}

/**
 * @import { Request } from '@hapi/hapi'
 */
