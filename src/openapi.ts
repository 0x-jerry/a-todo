import { Hono } from 'hono'
import path from 'path'
import type { RouteConfig } from 'openapi-ts-define'
import { readFile } from 'fs/promises'
import { swaggerUI } from '@hono/swagger-ui'
import { IS_DEV_MODE } from './env'
import { ROUTES_DIR } from './config'

export async function registerOpenapiRoutes(app: Hono) {
  const config = await getOpenapiConfig()
  app.get('/_openapi', (ctx) => ctx.json(config.schema))
  app.get('/_doc', swaggerUI({ url: '/_openapi' }))

  const apiRouter = await registerRoutes(config.routes)

  app.route('/', apiRouter)
}

async function getOpenapiConfig() {
  if (IS_DEV_MODE) {
    // Use a variable to avoid tsup to compile scripts/*.ts
    const makeItOnlyWorksAtDevMode = '../scripts/utils'
    const { generateOpenapiConfig } = await import(makeItOnlyWorksAtDevMode)

    console.log('generating openapi config...')
    const result = generateOpenapiConfig()
    console.log('generate openapi done!')
    return result
  }

  const openapiJsonContent = await readFile('generated/openapi.json', 'utf8')
  const routes: RouteConfig[] = JSON.parse(
    await readFile('generated/routes.json', 'utf8')
  )

  return {
    schema: JSON.parse(openapiJsonContent),
    routes
  }
}

async function registerRoutes(routes: RouteConfig[]) {
  const _app = new Hono()

  for (const route of routes) {
    const jsFile = path.join(
      ROUTES_DIR,
      route.meta.filepath.replace(/\.ts$/, '.js')
    )

    const handler = (await import(jsFile)).default

    _app[route.method as 'get'](route.path, handler)
  }

  return _app
}
