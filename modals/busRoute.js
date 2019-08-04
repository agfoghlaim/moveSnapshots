const mongoose = require('mongoose');
const config = require('../config.js');
const originalConnection = mongoose.createConnection(config.MONGO_URI_DONT_WRITE,{useNewUrlParser:true})

const busTimesSchema = mongoose.Schema({
  bus: String,
  time: String,
})

const snapshotSchema = mongoose.Schema(
  
  {
    _id:Number,
    queryScheduledTime: String,
    dayOfWeek: String,
    queryDateTime: String,
    forBusDue: String,
    route: String,
    direction: String,
    stop: String,
    bestopid: String,
    busname: String,
    timetabled: String,
    actual: String,
    earlyOrLate: String,
    minutesOff: String
  }
  
  )


const busStopSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  bestopid: String,
  stop_sequence: String,
  bus_times_week:[busTimesSchema],
  bus_times_sat: [busTimesSchema],
  bus_times_sun:[busTimesSchema],
  snapshots:[snapshotSchema]
})

const busRoutesSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  route: String,
  routename: String,
  direction: String,
  stops: [busStopSchema]
})


module.exports = originalConnection.model('BusRoute', busRoutesSchema);