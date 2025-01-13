import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { serveStatic } from '@hono/node-server/serve-static'
import { registerOpenapiRoutes } from './openapi'

export const app = new Hono()

app.use(logger())

await registerOpenapiRoutes(app)

// relative path
app.use('/*', serveStatic({ root: 'www' }))
