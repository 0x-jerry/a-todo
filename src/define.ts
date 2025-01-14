import type { Context } from 'hono'
import type { JwtVariables } from 'hono/jwt'

export interface IRequestParams {
  query: Record<string, string>
  params: Record<string, string>
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  body: any
}

export interface RouteHandler {
  (reqParams: IRequestParams, ctx: Context): Promise<Response>

  _validateBody?: (data: unknown) => void
  _validateQuery?: (data: unknown) => void
  _validateParams?: (data: unknown) => void
}

export const defineRoute = <Req, Resp>(route: RouteDefinition<Req, Resp>) => {
  const handler: RouteHandler = async (reqParams: IRequestParams, ctx: Context) => {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const resp = await route(reqParams as any, ctx)

    if (resp instanceof Response) {
      return resp
    }

    return ctx.json({ data: resp })
  }

  return handler
}

type Variables = JwtVariables<{
  /**
   * user id
   */
  id: number
}>

export type RouteDefinition<Req, Resp> = (
  req: Req,
  ctx: Context<{ Variables: Variables }>,
) => Resp | Promise<Resp>
