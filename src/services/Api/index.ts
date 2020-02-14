import uuidv4 from 'uuid/v4'
import cors from 'cors'
import express from 'express'
import { placesModel, productsModel } from '../MongoDB'

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

app.get('/products', async (req, res) => {
  const prdocuts = await productsModel.find({})
  return await res.status(200).send(prdocuts)
})

app.post('/products', async (req, res) => {
  const { title, description, city, area, price } = req.query
  await productsModel.create({ title, description, city, area, price })
  return await res.status(200).send('Succesfuly created!')
})

app.delete('/products', async (req, res) => {
  const { title, description, city, area, price } = req.query
  console.log(title, description, city, area, price)
  await productsModel.deleteMany({ title, description, city, area, price })
  return await res.status(200).send('Successfully deleted!')
})

app.put('/products', async (req, res) => {
  const oldData = JSON.parse(req.query.old)
  const newData = JSON.parse(req.query.new)
  await productsModel.updateMany({ title: oldData.title, description: oldData.description, city: oldData.city, area: oldData.area, price: oldData.price },
  { title: newData.title, description: newData.description, city: newData.city, area: newData.area, price: newData.price})
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