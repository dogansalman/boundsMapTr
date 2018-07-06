const express = require('express');
const app = express();
const port = process.env.PORT || 1331;
const jsonfile = require('jsonfile');
const fs = require('fs');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(express.static('/'))

app.get('/', (request,response) => {
   response.sendfile("index.html");
});

app.get('/:city_id', (request, response) => {
    response.set('Content-Type', 'application/json');
    jsonfile.readFile('map-bounds/cities/' + request.params.city_id + '.json', (err,coords) => {
       if(err) {
           response.statusCode = 404;  response.send({message: 'not found'});
       } else response.send(coords);
    })
});
app.get('/:city_id/:town_id', (request, response) => {
    response.set('Content-Type', 'application/json');
    jsonfile.readFile('map-bounds/towns/' + request.params.city_id + '/' + request.params.town_id + '.json', (err,coords) => {
        if(err) {
            response.statusCode = 404;  response.send({message: 'not found'});
        } else {
           Object.assign(coords, {coordinates: coords.cordinates.coordinates,multi_coords: Array.isArray(coords.cordinates.coordinates[0])});
           delete coords.cordinates;
            response.send(coords);
        }
    })
});

app.listen(port, (err) => {
    if (err) {
        return console.log('error:', err)
    }
    console.log(`server is listening on ${port}`)
})