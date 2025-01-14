import { prisma } from '@/database'
import { defineRoute } from '@/define'
import type { IPagination } from '@/types'

interface RequestParams {
  body: IPagination
}

export default defineRoute(async ({ body }: RequestParams, ctx) => {
  const { page = 0, size = 20 } = body

  const userId = ctx.get('jwtPayload').id

  const todos = await prisma.todo.findMany({
    where: {
      userId,
    },
    skip: page * size,
    take: size,
  })

  return todos
})
