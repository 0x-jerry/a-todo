import { prisma } from '@/services/database'
import { defineRoute } from '@/define'
import type { IPagination } from '@/types'
import { getPrismaPaginationQuery } from '@/utils/pagination'

interface RequestParams {
  body: IPagination
}

/**
 * @api.name list todos
 */
export default defineRoute(async ({ body }: RequestParams, ctx) => {
  const userId = ctx.get('jwtPayload').id

  const todos = await prisma.todo.findMany({
    where: {
      userId,
    },
    ...getPrismaPaginationQuery(body),
  })

  const total = await prisma.todo.count({
    where: {
      userId,
    },
  })

  return {
    total,
    data: todos,
  }
})
