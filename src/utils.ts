import { Prisma } from '@prisma/client'
import type { Context, Handler } from 'hono'
import type { JwtVariables } from 'hono/jwt'

export const defineRoute = <Req, Resp>(route: RouteDefinition<Req, Resp>) => {
  const handler: Handler = async (ctx) => {
    const isSimpleRequest = (method: string) => ['get', 'delete'].includes(method.toLowerCase())

    const requestParams = {
      query: ctx.req.query(),
      params: ctx.req.param(),
      body: isSimpleRequest(ctx.req.method) ? {} : await ctx.req.json(),
    }

    try {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      const resp = await route(requestParams as any, ctx)

      if (resp instanceof Response) {
        return resp
      }

      return ctx.json({ data: resp })
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

  return handler
}

type Variables = JwtVariables

export type RouteDefinition<Req, Resp> = (
  req: Req,
  ctx: Context<{ Variables: Variables }>,
) => Resp | Promise<Resp>
