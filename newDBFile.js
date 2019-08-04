/*

This file is for the new BusLoad db

*/

const Snapshot = require('./modals/snapshot');
const BusRoute = require('./modals/newDbBusRoute');



module.exports = {
  testNewDb: async function(){
  
    let test;
     try {
      test = await Snapshot.find({_id:'5d2ef0b0913e72273473cd55'})
      console.log("will save...")
     } catch(e){
       console.log("e ", e)
     }
  },
  getUnderscoreIdOfStop: async function(route,direction,bestopid){
    
    let stopRef;
    try{
      stopRef = await BusRoute.aggregate([
        {$match: {route:route,direction:direction}},
        {$unwind: '$stops'},
        {$match: {'stops.bestopid':bestopid}},
        {$replaceRoot: { newRoot: "$stops" }}
      ])
      console.log(stopRef[0]._id);
      return stopRef[0]._id
    }catch(e){
      console.log("e",e)
      return 'stop ref not found'
    }
  },
  saveNewSnap:async function(snap){
    let snapToSave = new Snapshot(snap);
    let snapSaved;
    try{
      snapSaved = await snapToSave.save();
      return ('ok');
    }catch(e){
      console.log("ERR ", e);
      return 'not saved'
    }
    
    
  }
}

// {"_id":{"$oid":"5d2ef0b0913e72273473cd55"},"weather":{"_id":{"$oid":"5d2ef0b0913e72273473cd59"},"lastUpdated":"1563357319","precipIntensity":{"$numberDouble":"0.002"},"summary":"Drizzle","icon":"rain"},"queryScheduledTime":"10:56","dayOfWeek":"Wed","queryDateTime":"Wed Jul 17 2019 10:56:00 GMT+0100 (Irish Standard Time)","forBusDue":"10:58","route":"404","direction":"W","stop":"Thomas Hynes Rd (Ardilaun Road)","bestopid":"524531","busname":"404W1110","timetabled":"17/07/2019 10:59:00","actual":"17/07/2019 11:05:33","earlyOrLate":"late","minutesOff":"6","stopRef":{"$oid":"5d2e4d26f2055e42b85f535a"},"__v":{"$numberInt":"0"}}
