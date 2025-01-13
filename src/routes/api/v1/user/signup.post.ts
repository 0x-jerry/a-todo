import { prisma } from '@/database'
import { cryptPassword } from '@/services/cryption'
import { defineRoute } from '@/utils'

interface RequestParams {
  body: {
    name?: string
    email: string
    password: string
  }
}

export default defineRoute(async ({ body }: RequestParams, ctx) => {
  await prisma.user.create({
    data: {
      email: body.email,
      password: await cryptPassword(body.password),
    },
  })
})
