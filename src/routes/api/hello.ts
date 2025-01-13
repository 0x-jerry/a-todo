import { defineRoute } from '@/utils'

interface ImgRequest {
  query: { w?: string }
}

export default defineRoute(async ({ query }: ImgRequest, ctx) => {
  return ctx.text(`Hello ${query.w}!`)
})
