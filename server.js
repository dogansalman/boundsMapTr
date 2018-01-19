const express = require('express');
const app = express();
const port = process.env.PORT || 1331;
const jsonfile = require('jsonfile');
const fs = require('fs');

app.get('/', (request,response) => {
    response.send('bounds services');
});

app.get('/:locId', (request, response) => {
    response.set('Content-Type', 'application/json');
    jsonfile.readFile('bounds/city.json', (err,coords) => {
        const _cord = coords.filter(c => c.id === Number(request.params.locId));
        if(_cord.length === 0) {
            response.statusCode = 404;  response.send({message: 'not found'});
            return;
        }
        Object.assign(_cord[0], { multi_coords: Array.isArray(_cord[0].coordinates[0]) ? true : false });
        response.send(_cord[0]);
    })
});
app.get('/:city_id/:town_id', (request, response) => {
    response.set('Content-Type', 'application/json');

    const _dir  = 'bounds/towns/' + request.params.city_id + '/' + request.params.town_id + '.json';

    if (!fs.existsSync(_dir))  {
        response.statusCode = 404;  response.send({message: 'not found'});
    }


    jsonfile.readFile(_dir, (err,coords) => {
        //TODO kaynaktan düzeltilecek.
        Object.assign(coords, {coordinates: coords.cordinates.coordinates});
        delete coords.cordinates;
        Object.assign(coords, { multi_coords: Array.isArray(coords.coordinates[0]) ? true : false });
        response.send(coords);
    })
});

app.listen(port, (err) => {
    if (err) {
        return console.log('error:', err)
    }
    console.log(`server is listening on ${port}`)
})