import { prisma } from '@/database'

export interface FetchWithCacheOption {
  /**
   * Seconds, default is 30 days
   *
   * @default 30 * 24 * 60 * 60 * 1000
   */
  ttl: number
}

export async function fetchContentWithCache<T = unknown>(
  url: string,
  opt?: FetchWithCacheOption
): Promise<T | null> {
  const cache = await prisma.cache.findFirst({
    where: {
      key: url
    }
  })

  const ttl = opt?.ttl ?? 30 * 24 * 60 * 60 * 1000

  // 30 days
  const isExpired = cache ? Date.now() - cache.updatedAt.getTime() > ttl : true

  let result = cache?.value

  if (!cache || isExpired) {
    result = await (await fetch(url)).text()

    await prisma.cache.upsert({
      update: {
        value: result
      },
      create: {
        key: url,
        value: result
      },
      where: {
        key: url
      }
    })
  }

  return result ? JSON.parse(result) : null
}
