import anthology from './services/Scenario'
import { availableScenarious } from './helpers/markup'
import { bot } from './bootstrap'
import { session } from './services/Session'

bot.start(async ctx => {
  try {
    await anthology.get('initial')(ctx)
  } catch (err) {
    console.error(err)
  }
})

bot.on('message', async ctx => {
  const userMessage = ctx.message.text
  const scope = await session.getEntity(ctx.from.id, 'scope')
  if (scope === 'enterPromocode') {
    return await anthology.get('applyPromocode')(ctx)(userMessage)
  }
  if (Object.values(availableScenarious).indexOf(userMessage) > -1) {
    for (const prop in availableScenarious) {
        if (availableScenarious.hasOwnProperty(prop)) {
          if (availableScenarious[prop] === userMessage) {
            return await anthology.get(prop)(ctx)
          }
        }
    }
  }
})

bot.on('callback_query', async ctx => {
  const callbackQuery = ctx.callbackQuery.data
  if (callbackQuery.startsWith('getProductsByCity:')) {
    return await anthology.get('getProductsByCity')(ctx)(callbackQuery.substr(18))
  }
  if (Object.values(availableScenarious).indexOf(callbackQuery) > -1) {
    for (const prop in availableScenarious) {
        if (availableScenarious.hasOwnProperty(prop)) {
          if (availableScenarious[prop] === callbackQuery) {
            return await anthology.get(prop)(ctx)
          }
        }
    }
  }
})