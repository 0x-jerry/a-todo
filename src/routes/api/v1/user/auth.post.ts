import { prisma } from '@/database'
import { APP_REFRESH_SECRET, APP_SECRET } from '@/env'
import { kv } from '@/services/kv'
import { defineRoute } from '@/define'
import dayjs from 'dayjs'
import { decode, sign } from 'hono/jwt'

interface RequestParams {
  body: {
    refreshToken: string
  }
}

export default defineRoute(async ({ body }: RequestParams, ctx) => {
  const { refreshToken } = body
  if (!refreshToken) {
    throw new Error('Exchange failed: 0x00')
  }

  if ((await kv.get(refreshToken)) !== true) {
    throw new Error('Exchange failed: 0x00')
  }

  const data = decode(refreshToken)

  const userId = data.payload.id as number

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  })

  if (!user) {
    throw new Error('Exchange failed: 0x01')
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
  const newRefreshToken = await sign(
    {
      id: user.id,
      exp: expDate.valueOf(),
    },
    APP_REFRESH_SECRET,
  )

  await kv.remove(refreshToken)
  await kv.set(newRefreshToken, true, { expireIn: expDate.toDate() })

  return {
    user,
    token,
    newRefreshToken,
  }
})
