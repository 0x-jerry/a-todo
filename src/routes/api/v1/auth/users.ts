import { prisma } from '@/database'
import { defineRoute } from '@/utils'

interface RequestParams {
  query: {
    page?: number
    size?: number
  }
}

export default defineRoute(async ({ query }: RequestParams, ctx) => {
  const { size = 20, page = 0 } = query

  const users = await prisma.user.findMany({
    omit: {
      password: true,
    },
    skip: size * page,
    take: size,
  })

  return users
})
