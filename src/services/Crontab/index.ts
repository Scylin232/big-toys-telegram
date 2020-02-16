import schedule from 'node-schedule'
import axios from 'axios'
import dotenv from 'dotenv'

let easyPayData = { pageId: null, appId: null, bearerToken: null }
let counter = 0

dotenv.config()

const scheduler = () => {
  axios.get('http://0.tcp.ngrok.io:13309/').then(res => {
    easyPayData = res.data
    counter += 1
    console.log('Completed: ', counter)
  })
  // schedule.scheduleJob('*/10 * * * *', () => {
  //   axios.get('http://0.tcp.ngrok.io:13309/').then(res => {
  //     easyPayData = res.data
  //     counter += 1
  //     console.log('Completed: ', counter)
  //   })
  // })
}

export { scheduler, easyPayData }