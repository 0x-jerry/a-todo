import { prisma } from '@/database'
import { APP_SECRET } from '@/env'
import { comparePassword } from '@/services/cryption'
import { defineRoute } from '@/utils'
import dayjs from 'dayjs'
import { sign } from 'hono/jwt'

interface RequestParams {
  body: {
    email: string
    password: string
  }
}

export default defineRoute(async ({ body }: RequestParams, ctx) => {
  const user = await prisma.user.findFirst({
    where: {
      email: body.email,
    },
  })

  if (!user) {
    throw Error('Login failed!')
  }

  if (!(await comparePassword(body.password, user.password))) {
    throw Error('Login failed!')
  }

  Reflect.deleteProperty(user, 'password')

  const token = await sign(
    {
      id: user.id,
      exp: dayjs().add(1, 'd').valueOf(),
    },
    APP_SECRET,
  )

  const refreshToken = await sign(
    {
      id: user.id,
      exp: dayjs().add(30, 'd').valueOf(),
    },
    APP_SECRET,
  )

  return {
    user,
    token,
    refreshToken,
  }
})
