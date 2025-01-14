import { prisma } from '@/database'
import { APP_REFRESH_SECRET, APP_SECRET } from '@/env'
import { comparePassword } from '@/services/cryption'
import { kv } from '@/services/kv'
import { defineRoute } from '@/define'
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

  const expDate = dayjs().add(30, 'd')
  const refreshToken = await sign(
    {
      id: user.id,
      exp: expDate.valueOf(),
    },
    APP_REFRESH_SECRET,
  )

  await kv.set(refreshToken, true, { expireIn: expDate.toDate() })

  return {
    user,
    token,
    refreshToken,
  }
})
