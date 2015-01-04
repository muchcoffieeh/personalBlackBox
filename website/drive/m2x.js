var util = require('util');
var  express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: false }))

app.listen(9001);

var API_KEY = "KEY",
    M2X = require("m2x"),
    m2xClient = new M2X(API_KEY);
    
app.get('/crash', function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Content-type", "application/json");
  
  var start = new Date().getTime() - 15000;
  var startString =  new Date(start).toISOString();


   m2xClient.devices.streamValues("STREAM", "05-crashid",  {"limit":1, "start":startString}, function(result) {
       
        console.log(result);
        if (result.isError()) {
            // Stop the update loop if an error occurs.

            console.log(result.error());
        }
            res.end(JSON.stringify(result.json));

    });
});


app.post('/sendCarData', function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");

//var car =  {"diagnostic":{"engine":"OK","antilockBrakingSystem":"OK"},"climateControl":{"zones":[{"zone":"front","airflowDirection":"frontpanel"},{"fanSpeedLevel":"0","zone":"front"},{"zone":"front","airConditioning":"false"},{"airRecirculation":"false","zone":"front"},{"heater":"false","zone":"front"},{"zone":"front","seatHeater":"0"},{"seatCooler":"0","zone":"front"}],"steeringWheelHeater":"0","temperature":{"interiorTemperature":"0"}},"vehicleSpeed":{"speed":"30"},"lightStatus":{"rightTurn":"false","parking":"false","break":"false","fog":"false","highBeam":"false","hazard":"false","_break":"false","leftTurn":"false","head":"false"},"ignition":{"vehiclePowerMode":"off"},"door":{"zones":[{"lock":"true","status":"close","zone":"driver"},{"lock":"true","status":"close","zone":"passenger"},{"lock":"true","status":"close","zone":"rear+left"},{"lock":"true","status":"close","zone":"rear+right"},{"lock":"true","status":"open","zone":"trunk"},{"lock":"true","status":"close","zone":"fuel"},{"lock":"true","status":"close","zone":"hood"}]},"fuel":{"level":"20"},"parkingBreak":{"status":"active"},"sideWindow":{"zones":[{"lock":"true","openness":"0","zone":"front+left"},{"lock":"true","openness":"0","zone":"front+right"},{"lock":"true","openness":"0","zone":"rear+left"},{"lock":"true","openness":"0","zone":"rear+right"}]},"transmission":{"transmissionMode":"Drive"},"tire":{"zones":[{"pressure":"0","zone":"front+left"},{"pressure":"0","zone":"front+right"},{"pressure":"0","zone":"rear+left"},{"pressure":"0","zone":"rear+right"}]}};

var car = JSON.parse(req.body.car);
console.log(util.inspect(car));


//m2xClient.devices.view("802f1824496d5ccd64eef6783e915b6b", function(response) {
//    console.log(response.json);
//});

        var at = new Date().toISOString();
        
        var values = {};
        
        //bad code here
        try{ values.speed = [ { value: car.vehicleSpeed.speed, timestamp: at } ] } catch (e){};


            try{ values.speed=  [ { value: car.vehicleSpeed.speed, timestamp: at } ]} catch (e){};
            try{ values.fuel=  [ { value: car.fuel.level, timestamp: at } ]} catch (e){};
            try{ values.engine=  [ { value: convertOK(car.diagnostic.engine), timestamp: at } ]} catch (e){};
            try{ values.antilockBrakingSystem=  [ { value: convertOK(car.diagnostic.antilockBrakingSystem), timestamp: at } ]} catch (e){};
            try{ values.interiorTemperature=  [ { value: car.climateControl.temperature.interiorTemperature, timestamp: at } ]} catch (e){};
            try{ values.lightStatusrightTurn=  [ { value: convertFalse(car.lightStatus.rightTurn), timestamp: at } ]} catch (e){};
            try{ values.lightStatusparking=  [ { value: convertFalse(car.lightStatus.parking), timestamp: at } ]} catch (e){};
            try{ values.lightStatusbreak=  [ { value: convertFalse(car.lightStatus.break), timestamp: at } ]} catch (e){};
            try{ values.lightStatusfog= [ { value: convertFalse(car.lightStatus.fog), timestamp: at } ]} catch (e){};
            try{ values.lightStatushighBeam=  [ { value: convertFalse(car.lightStatus.highBeam), timestamp: at } ]} catch (e){};
            try{ values.lightStatushazard=  [ { value: convertFalse(car.lightStatus.hazard), timestamp: at } ]} catch (e){};
            try{ values.lightStatusleftTurn=  [ { value: convertFalse(car.lightStatus.leftTurn), timestamp: at } ]} catch (e){};
            try{ values.lightStatushead=  [ { value: convertFalse(car.lightStatus.head), timestamp: at } ]} catch (e){};

            try{ values.parkingBreak=  [ { value: convertFalse(car.parkingBreak.status), timestamp: at } ]} catch (e){};
            try{ values.frontleftwindow=  [ { value: car.sideWindow.zones[0].openness, timestamp: at } ]} catch (e){};
            try{ values.frontrightwindow=  [ { value: car.sideWindow.zones[1].openness, timestamp: at } ]} catch (e){};
            try{ values.rearleftwindow=  [ { value: car.sideWindow.zones[2].openness, timestamp: at } ]} catch (e){};
            try{ values.rearrightwindow=  [ { value: car.sideWindow.zones[3].openness, timestamp: at } ]} catch (e){};
            try{ values.transmission=  [ { value: car.transmission.transmissionMode, timestamp: at } ]} catch (e){};

            try{ values.frontlefttire=  [ { value: car.tire.zones[0].pressure, timestamp: at } ]} catch (e){};
            try{ values.frontrighttire=  [ { value: car.tire.zones[1].pressure, timestamp: at } ]} catch (e){};
            try{ values.rearlefttire=  [ { value: car.tire.zones[2].pressure, timestamp: at } ]} catch (e){};
            try{ values.rearrighttire=  [ { value: car.tire.zones[3].pressure, timestamp: at } ]} catch (e){};

            try{ values.latitude=  [ { value: car.position.latitude, timestamp: at } ]} catch (e){};
            try{ values.longitude=  [ { value: car.position.longitude, timestamp: at } ]} catch (e){};
            try{ values.heading=  [ { value: car.position.heading, timestamp: at } ]} catch (e){};

        
console.log(util.inspect(values));

function convertFalse(val){
    var retVal = 0;
    if (val) retVal =1;
    return retVal;
}

function convertOK(val){
    var retVal = 0;
    if (val == "OK") retVal =1;
    return retVal;
}


 m2xClient.devices.postMultiple("STREAM", values, function(result) {
       
        console.log(result);
        if (result.isError()) {
            // Stop the update loop if an error occurs.

            console.log(result.error());
        }
    });
    res.end();
});

app.use(express.static(__dirname, 'html'));

