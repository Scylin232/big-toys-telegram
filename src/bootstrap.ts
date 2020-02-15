import Telegraf from 'telegraf'
import dotenv from 'dotenv'
import { scheduler } from './services/Crontab'
import { app } from './services/Api'

dotenv.config()

const bot = new Telegraf(process.env.BOT_TOKEN)

try {
  bot.launch()
  app.listen(4615, () => {
    console.log('Express and Bot listening on port 4615!')
  })
} catch (err) {
  console.log(err)
}

scheduler()

export { bot }