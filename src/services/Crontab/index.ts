import schedule from 'node-schedule'
import axios from 'axios'

let easyPayData = { pageId: null, appId: null, bearerToken: null }
let counter = 0

const scheduler = () => {
  schedule.scheduleJob('*/10 * * * *', () => {
    axios.get('http://0.tcp.ngrok.io:16410/').then(res => {
      easyPayData = res.data
      counter += 1
      console.log('Completed: ', counter)
    })
  })
}

export { scheduler, easyPayData }