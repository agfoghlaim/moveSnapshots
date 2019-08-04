
//const mongoose = require('mongoose');
//const config = require('./config');
const BusRoute = require('./modals/busRoute');
const newDBFile = require('./newDBFile');
const timetablesOut = require('./timetablesOut');

//mongoose.connect(config.MONGO_URI_DONT_WRITE,{useNewUrlParser:true})


async function getSnapsTest(){
   //405/E/525741 = Seamus Quirke Rd (Westside Shopp Cent)
   let route = '405';
   let direction = 'E';
   let bestopid = '525741';
  let theBusStop = await BusRoute.aggregate([
    {$match: {route:route,direction:direction}},
    {$unwind: '$stops'},
    {$match: {'stops.bestopid':bestopid}},
    {$replaceRoot: { newRoot: "$stops" }}
 ])
 console.log("snaps ",theBusStop[0].snapshots.length, theBusStop[0].snapshots[0])

}

//getSnapsTest();


/*

= getAllSnaps uses a json file which lists routes and stops (corresponding to the db data);
= it loops through each route & each stop
= for each stop - get it's snapshots from the old db
= for each stop - look up it's _id in the new db
= add _id of stop as 'stopRef' to the snapshots
= save snapshots to new db snapshots collection

= my computer runs out of memory when all this is done together so run the routes one @ a time
= ie timetablesOut[0], timetablesOut[1]...etc

*/

async function getAllSnaps(){
  
  //timetablesOut.forEach(rt=>{

    let {route,direction} = timetablesOut[9];

    timetablesOut[9].stops.forEach(async stop=>{

      let bestopid = stop.bestopid;

      //get snapshots from old db
      let theBusStop = await BusRoute.aggregate([
        {$match: {route:route,direction:direction}},
        {$unwind: '$stops'},
        {$match: {'stops.bestopid':bestopid}},
        {$replaceRoot: { newRoot: "$stops" }}
      ])

      //avoid errors there's no time for!
      if(theBusStop[0]){
          if(!theBusStop[0].snapshots.length){
            //console.log("empty")
            return;
          }
    
        //here it will be the snapshots array from the old db route.stops[x].snapshots... need to go through each one and add the stopref.

        //the stopRef is the _id of the busstop (in the new db), get that first
        let stopRef = await newDBFile.getUnderscoreIdOfStop(route,direction,bestopid);

        //add the stop ref as a field in the snapshot
        let newSnapshots = theBusStop[0].snapshots;
        newSnapshots.map(async snap=>{
          snap.stopRef = stopRef;

          //save the snapshot
          let fingersCrossed = await newDBFile.saveNewSnap(snap);
          //console.log(fingersCrossed)
        })

      }else{
        console.log(route,direction,bestopid + ' no snaps ')
      }
      console.log("saving... ", route,direction,stop.name)
    })
  //})

}

//getAllSnaps()

