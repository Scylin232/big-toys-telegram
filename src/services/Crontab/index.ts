import schedule from 'node-schedule'
import axios from 'axios'
import dotenv from 'dotenv'
import { settingsModel } from '../MongoDB'

let easyPayData = { pageId: null, appId: null, bearerToken: null }
let counter = 0

dotenv.config()

const scheduler = () => {
  schedule.scheduleJob('*/10 * * * *', async () => {
    const easyPayUrl = await axios.get('https://big-toys-easypay-returner.herokuapp.com/')
    axios.get(easyPayUrl.data).then(res => {
      easyPayData = res.data
      counter += 1
      console.log('Completed: ', counter)
    }).catch(err => {
      console.log('Not ready. Most likely you do it at night, wait until the morning. EasyPay services cannot finish work now.')
    })
  })
}

export { scheduler, easyPayData }