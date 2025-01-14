import { IS_DEV_MODE } from '@/env'
import pino from 'pino'

export const appLogger = pino({
  transport: IS_DEV_MODE
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          singleline: true,
        },
      }
    : undefined,
})
