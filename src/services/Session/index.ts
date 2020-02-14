import dotenv from 'dotenv'
import bluebird from 'bluebird'
import redis from 'redis'

dotenv.config()
bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

function isJson(toParse: string) {
  return !!JSON.parse(toParse)
}

const availableEntities = [
  'scope',
  'product'
]

export const redisClient: any = redis.createClient({
  url: process.env.REDIS_URL,
  retry_strategy: options => {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      return new Error('Redis server access refused.')
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      return new Error('Retry time exhausted')
    }
    if (options.attempt > 10) {
      return undefined
    }
    // reconnect after
    return Math.min(options.attempt * 100, 3000)
  },
})

const getSession = async (userId)  => {
  const userData = await redisClient.hgetAsync(process.env.BOT_ALIAS, userId)
  if (userData && isJson(userData)) {
    return JSON.parse(userData)
  }
  return null
}

export const session = {
  init: async (userId) => {
    const userData = {
      scope: null,
      product: null,
    }
    if (redisClient) {
      const existedUser = await redisClient.hgetAsync(process.env.BOT_ALIAS, userId)
      if (!!existedUser) {
        await redisClient.hdelAsync(process.env.BOT_ALIAS, userId)
      }
      return await redisClient.hsetAsync(process.env.BOT_ALIAS, userId, JSON.stringify(userData))
    }
    throw new Error('redis client is absent')
  },
  destroy: async (userId) => {
    return await redisClient.hdelAsync(process.env.BOT_ALIAS, userId)
  },
  getEntity: async (userId, entity) => {
    if (!userId || !availableEntities.includes(entity)) {
      return false
    }
    const session = await getSession(userId)
    if (!session) {
      return false
    }
    return session[entity]
  },
  update: async (userId, entity, value) => {
    const session = await getSession(userId)
    await redisClient.hdelAsync(process.env.BOT_ALIAS, userId)
    session[entity] = value
    return await redisClient.hsetAsync(process.env.BOT_ALIAS, userId, JSON.stringify(session))
  },
  checkout: async (userId) => {
    const session = await redisClient.hgetAsync(process.env.BOT_ALIAS, userId)
    if (!session) {
      throw new Error('⚠️ Користувач не існує.')
    }
    const userData = {
      scope: null,
      product: null
    }
    return await redisClient.hsetAsync(
      process.env.BOT_ALIAS,
      userId,
      JSON.stringify({ ...session, ...userData }),
    )
  }
}
