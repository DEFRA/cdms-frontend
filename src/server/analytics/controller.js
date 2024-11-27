/**
 * A GDS styled example about page controller.
 * Provided as an example, remove or modify as required.
 * @satisfies {Partial<ServerRoute>}
 */
export const analyticsController = {
  handler(_request, h) {
    return h.view('analytics/index', {
      pageTitle: 'Analytics',
      heading: 'Analytics',
      breadcrumbs: [
        {
          text: 'Home',
          href: '/'
        },
        {
          text: 'Analytics'
        }
      ]
    })
  }
}

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */
