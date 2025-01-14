import type { IPagination } from '@/types'

export function getPrismaPaginationQuery(param: IPagination) {
  let { page = 0, size = 20 } = param
  if (page < 0) page = 0
  if (size <= 0) size = 20

  return {
    skip: page * size,
    take: size,
  }
}
