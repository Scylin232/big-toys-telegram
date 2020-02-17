import schedule from 'node-schedule'
import axios from 'axios'
import dotenv from 'dotenv'
import { settingsModel } from '../MongoDB'

let easyPayData = { pageId: null, appId: null, bearerToken: null }
let counter = 0

dotenv.config()

const scheduler = () => {
  schedule.scheduleJob('*/10 * * * *', async () => {
    try {
      const easyPayUrl = await settingsModel.findById('5e4946e00bf3af40d4150070')
      axios.get(easyPayUrl.value).then(res => {
        easyPayData = res.data
        counter += 1
        console.log('Completed: ', counter)
      })
    } catch(err) {
      console.log('Server is not responding.');
    }
  })
}

export { scheduler, easyPayData }