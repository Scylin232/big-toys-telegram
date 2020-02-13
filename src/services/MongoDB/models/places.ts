import { Schema } from 'mongoose'

const PlacesSchema: Schema = new Schema({
  city: String,
  areas: String,
})

export { PlacesSchema }