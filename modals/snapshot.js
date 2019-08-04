const mongoose = require('mongoose');
const config = require('../config.js');
const newConnection = mongoose.createConnection(config.MONGO_URI,{useNewUrlParser:true})

const mongoWeatherSchema = mongoose.Schema(

  {
    _id:mongoose.Types.ObjectId,
    lastUpdated: String,
    precipIntensity: Number,
    summary: String,
    icon: String
  }
    
  )

const snapShotSchema = mongoose.Schema({
  _id:mongoose.Types.ObjectId,
  stopRef:mongoose.Types.ObjectId,
  queryScheduledTime: String,
  dayOfWeek: String,
  queryDateTime: String,
  forBusDue: String,
  route: String,
  direction:String,
  stop: String,
  bestopid: String,
  busname:String,
  timetabled:String,
  actual:String,
  earlyOrLate:String,
  minutesOff:String,
  weather: mongoWeatherSchema
})





module.exports = newConnection.model('Snapshot', snapShotSchema);