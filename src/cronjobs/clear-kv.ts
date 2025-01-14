import { prisma } from '@/services/database'
import dayjs from 'dayjs'
import { createCron } from './_utils'

export default createCron('0 2 * * *', { name: 'clear kv storage' }, async () => {
  await prisma.kv.deleteMany({
    where: {
      expireIn: {
        lte: dayjs().toDate(),
      },
    },
  })
})
