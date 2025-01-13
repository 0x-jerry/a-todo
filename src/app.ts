import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { jwt } from 'hono/jwt'
import { logger } from 'hono/logger'
import { APP_SECRET } from './env'
import { registerOpenapiRoutes } from './openapi'

export const app = new Hono()

app.use(logger())

app.use('/api/v1/auth/*', jwt({ secret: APP_SECRET }))

await registerOpenapiRoutes(app)

// relative path
app.use('/*', serveStatic({ root: 'www' }))
