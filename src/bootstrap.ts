import Telegraf from 'telegraf'
import dotenv from 'dotenv'
import { scheduler } from './services/Crontab'
import { app } from './services/Api'

dotenv.config()

const bot = new Telegraf(process.env.BOT_TOKEN)

try {
  bot.telegram.setWebhook(process.env.EXPOSE_URL)
  bot.startWebhook('/', null, Number(process.env.PORT))
  app.listen(4615, () => {
    console.log('Example app listening on port 4615!')
  })
  console.log('Bot started on PORT: ', process.env.PORT)
} catch (err) {
  console.log(err)
}

scheduler()

export { bot }