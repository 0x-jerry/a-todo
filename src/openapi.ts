import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { Hono } from 'hono'
import type { RouteConfig } from 'openapi-ts-define'
import { ROUTES_DIR } from './config'
import { IS_DEV_MODE } from './env'
import { pathToFileURL } from 'node:url'
import { swaggerUI } from '@hono/swagger-ui'

export async function registerOpenapiRoutes(app: Hono) {
  const config = await getOpenapiConfig()
  app.get('/_openapi', (ctx) => ctx.json(config.schema))
  app.get('/_doc', swaggerUI({ url: '/_openapi' }))

  const apiRouter = await registerRoutes(config.routes)

  app.route('/', apiRouter)
}

async function getOpenapiConfig() {
  if (IS_DEV_MODE) {
    const utilsFile = pathToFileURL(path.resolve('scripts/utils.ts'))

    const { generateOpenapiConfig } = await import(utilsFile.toString())

    console.log('generating openapi config...')
    const result = generateOpenapiConfig()
    console.log('generate openapi done!')
    return result
  }

  const openapiJsonContent = await readFile('generated/openapi.json', 'utf8')
  const routes: RouteConfig[] = JSON.parse(await readFile('generated/routes.json', 'utf8'))

  return {
    schema: JSON.parse(openapiJsonContent),
    routes,
  }
}

async function registerRoutes(routes: RouteConfig[]) {
  const _app = new Hono()

  for (const route of routes) {
    const jsFile = pathToFileURL(path.join(ROUTES_DIR, route.meta.filepath))

    const handler = (await import(jsFile.toString())).default

    _app[route.method as 'get'](route.path, handler)
  }

  return _app
}
