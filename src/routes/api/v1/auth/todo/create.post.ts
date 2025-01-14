import { prisma } from '@/database'
import { defineRoute } from '@/define'

interface RequestParams {
  body: {
    title: string
  }
}

export default defineRoute(async ({ body }: RequestParams, ctx) => {
  const { title } = body

  const userId = ctx.get('jwtPayload').id

  const todo = await prisma.todo.create({
    data: {
      userId,
      title,
    }
  })

  return todo
})
