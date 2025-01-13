import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { serveStatic } from '@hono/node-server/serve-static'
import { registerOpenapiRoutes } from './openapi'
import { jwt } from 'hono/jwt'
import { APP_SECRET } from './env'

export const app = new Hono()

app.use(logger())

app.use(
    '/api/v1/auth/*',
    jwt({ secret: APP_SECRET})
  )

await registerOpenapiRoutes(app)

// relative path
app.use('/*', serveStatic({ root: 'www' }))
