import uuidv4 from 'uuid/v4'
import cors from 'cors'
import express from 'express'
import { placesModel } from '../MongoDB'

const app = express()

app.use(cors())
app.use(express.json()) 

app.get('/places', async (req, res) => {
  const places = await placesModel.find({})
  return await res.status(200).send(places)
})

app.post('/places', async (req, res) => {
  const { city, areas } = req.query
  await placesModel.create({ city, areas })
  return await res.status(200).send('Succesfuly created!')
})

app.delete('/places', async (req, res) => {
  const { city, areas } = req.query
  await placesModel.deleteMany({ city, areas })
  return await res.status(200).send('Successfully deleted!')
})

app.put('/places', async (req, res) => {
  const oldData = JSON.parse(req.query.old)
  const newData = JSON.parse(req.query.new)
  await placesModel.updateMany({ city: oldData.city, areas: oldData.areas }, { city: newData.city, areas: newData.areas })
  return await res.status(200).send('Successfully updated!')
})

let userToken;

app.post('/auth/user', async (req, res) => {
  const userEmail = req.body.email
  const userPassword = req.body.password
  console.log(userEmail, userPassword)
  userToken = uuidv4()
  return await res.status(200).send({ status: 200, data: { token: userToken } })
})

app.post('/auth/logout', async (req, res) => {
  userToken = null
  return await res.status(200).send({ status: 200 })
})

export { app }