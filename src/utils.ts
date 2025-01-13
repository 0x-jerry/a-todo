import type { Handler, Context } from 'hono'

export const defineRoute = <Req, Resp>(route: RouteDefinition<Req, Resp>) => {
  const handler: Handler = async (ctx) => {
    const isSimpleRequest = (method: string) =>
      ['get', 'delete'].includes(method.toLowerCase())

    const requestParams = {
      query: ctx.req.query(),
      params: ctx.req.param(),
      body: isSimpleRequest(ctx.req.method) ? {} : await ctx.req.json()
    }

    try {
      const resp = await route(requestParams as any, ctx)

      if (resp instanceof Response) {
        return resp
      }

      return ctx.json({ data: resp })
    } catch (error) {
      console.error(error)
      return ctx.json({
        error: String(error)
      })
    }
  }

  return handler
}

export interface RouteDefinition<Req, Resp> {
  (req: Req, ctx: Context): Resp | Promise<Resp>
}
