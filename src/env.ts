import 'dotenv/config'

export const IS_DEV_MODE = process.env.NODE_ENV === 'development'

// todo, check value
export const APP_SECRET = process.env.APP_SECRET!
