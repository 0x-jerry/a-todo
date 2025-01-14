import { prisma } from '@/services/database'
import dayjs from 'dayjs'

const utils = {
  serialize(val: unknown) {
    return JSON.stringify(val)
  },
  deserialize(serializedVal: string) {
    return JSON.parse(serializedVal)
  },
}

export interface KVOption {
  expireIn: Date
}

class KV {
  async get<T>(key: unknown): Promise<T | undefined> {
    const serializedKey = utils.serialize(key)
    const kv = await prisma.kv.findUnique({
      where: {
        key: serializedKey,
      },
    })

    if (!kv) {
      return
    }

    const isExpired = kv.expireIn ? dayjs().isAfter(kv.expireIn) : false

    if (isExpired) {
      await prisma.kv.delete({
        where: {
          key: serializedKey,
        },
      })
      return
    }

    return utils.deserialize(kv.value)
  }

  async set(key: unknown, val: unknown, opt?: KVOption) {
    const serializedKey = utils.serialize(key)
    const serializedVal = utils.serialize(val)

    const kv = await prisma.kv.upsert({
      where: {
        key: serializedKey,
      },
      create: {
        key: serializedKey,
        value: serializedVal,
        expireIn: opt?.expireIn,
      },
      update: {
        value: serializedVal,
        expireIn: opt?.expireIn,
      },
    })

    return kv
  }

  async remove(key: unknown) {
    const serializedKey = utils.serialize(key)

    await prisma.kv.delete({
      where: {
        key: serializedKey,
      },
    })
  }
}

export const kv = new KV()
