import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { UsersSchema } from './models/users'
import { PlacesSchema } from './models/places'

dotenv.config()

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
const usersModel = mongoose.model('Users', UsersSchema, 'users')
const placesModel = mongoose.model('Places', PlacesSchema, 'places')

export { usersModel, placesModel }