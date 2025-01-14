import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { Hono, type Context } from 'hono'
import type { RouteConfig, RouteRequestParam } from 'openapi-ts-define'
import { ROUTES_DIR } from './config'
import { IS_DEV_MODE } from './env'
import { pathToFileURL } from 'node:url'
import { swaggerUI } from '@hono/swagger-ui'
import Ajv, { type ErrorObject } from 'ajv'
import type { IRequestParams, RouteHandler } from './define'
import { Prisma } from '@prisma/client'

// biome-ignore lint/suspicious/noExplicitAny: todo, update interface
type JSONSchame = any

const ajv = new Ajv({})

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

    const handler: RouteHandler = (await import(jsFile.toString())).default

    handler._validateQuery = await createValidateParamsFn(route.request?.query)
    handler._validateParams = await createValidateParamsFn(route.request?.params)
    handler._validateBody = await createValidateBodyFn(route.request?.body)

    _app[route.method as 'get'](route.path, async (ctx) => {
      const resp = await catchError(ctx, async () => {
        const requestParams = await getRequestParams(ctx)

        handler._validateParams?.(requestParams.params)
        handler._validateQuery?.(requestParams.query)
        handler._validateBody?.(requestParams.body)

        return handler(requestParams, ctx)
      })

      return resp
    })
  }

  return _app
}

async function catchError(ctx: Context, fn: () => Promise<Response>) {
  try {
    const resp = await fn()

    return resp
  } catch (err) {
    console.error(err)

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return ctx.json({
        error: `prisma error: ${err.code}`,
      })
    }

    if (err instanceof Error) {
      return ctx.json({
        error: err.message,
      })
    }

    return ctx.json({
      error: String(err),
    })
  }
}

async function createValidateBodyFn(bodySchema: JSONSchame) {
  if (!bodySchema) {
    return
  }

  const schema = bodySchema

  const validateFn = ajv.compile(schema)

  return (data: unknown) => {
    if (!validateFn(data)) {
      throw getValidationErrorMsg(validateFn.errors)
    }
  }
}

async function createValidateParamsFn(configs?: RouteRequestParam[]) {
  if (!configs?.length) {
    return
  }

  const schema: JSONSchame = {
    type: 'object',
    properties: {},
    required: [],
    additionalProperties: true,
  }

  for (const item of configs) {
    schema.properties[item.name] = { type: 'string' }
    if (!item.optional) {
      schema.required.push(item.name)
    }
  }

  const validateFn = ajv.compile(schema)

  return (data: unknown) => {
    if (!validateFn(data)) {
      throw getValidationErrorMsg(validateFn.errors)
    }
  }
}

function getValidationErrorMsg(errors?: ErrorObject[] | null) {
  const err = errors?.at(0)
  if (!err) {
    return ''
  }

  const { instancePath, message } = err

  return `${instancePath ? `${instancePath}: ` : ''}${message}`
}

async function getRequestParams(ctx: Context) {
  const isSimpleRequest = ['get', 'delete'].includes(ctx.req.method.toLowerCase())

  const requestParams: IRequestParams = {
    query: ctx.req.query(),
    params: ctx.req.param(),
    body: isSimpleRequest ? {} : await getBody(),
  }

  return requestParams

  async function getBody() {
    let body = {}

    try {
      body = await ctx.req.json()
    } catch (error) {
      console.error(error)
    }

    return body
  }
}
