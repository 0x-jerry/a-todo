import { appLogger } from '@/services/logger'
import type { Fn } from '@0x-jerry/utils'
import { Cron, type CronOptions } from 'croner'
import dayjs from 'dayjs'

const logger = appLogger.child({
  name: 'cron',
})

export type ICronOptions = Omit<CronOptions, 'name'> & { name: string }

export function createCron(pattern: string, opt: ICronOptions, fn: Fn) {
  const { name } = opt

  logger.info('register cronjob: %s', name)

  return new Cron(
    pattern,
    {
      protect: true,
      ...opt,
    },
    jobFn,
  )

  async function jobFn() {
    const startMs = Date.now()

    try {
      logger.info('cronjob[%s] start', name)

      return fn()
    } catch (error) {
      logger.warn('cronjob[%s] error: %o', error)
    } finally {
      const ms = Date.now() - startMs
      const readableStr = dayjs.duration(ms, 'milliseconds').humanize()

      logger.info('cronjob[%s] done, spend: %s, %s', name, readableStr, ms)
    }
  }
}
