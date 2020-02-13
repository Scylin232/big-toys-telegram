import schedule from 'node-schedule'
import axios from 'axios'

let easyPayData = { pageId: null, appId: null, bearerToken: null }

const scheduler = () => {
  // schedule.scheduleJob('*/10 * * * *', () => {
    // axios.get('http://localhost:4515/').then(res => {
    //   easyPayData = res.data
    //   console.log('Completed!')
    // })
  // })
}

export { scheduler, easyPayData }