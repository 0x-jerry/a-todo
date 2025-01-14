import { prisma } from '@/services/database'
import { cryptPassword } from '@/services/cryption'
import { defineRoute } from '@/define'

interface RequestParams {
  body: {
    name?: string
    email: string
    password: string
  }
}

/**
 * @api.name signup
 */
export default defineRoute(async ({ body }: RequestParams, ctx) => {
  await prisma.user.create({
    data: {
      email: body.email,
      password: await cryptPassword(body.password),
    },
  })
})
