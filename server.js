const express = require('express');
const app = express();
const port = 3000;
const jsonfile = require('jsonfile')

app.get('/', (request,response) => {
    response.send('bounds services');
});

app.get('/:locId', (request, response) => {
    response.set('Content-Type', 'application/json');

    jsonfile.readFile('data/coords.json', (err,coords) => {
        const _cord = coords.filter(c => c.id === Number(request.params.locId));
        if(_cord.length === 0) {
            response.statusCode = 404;  response.send({message: 'not found'});
            return;
        }
        Object.assign(_cord[0], { multi_coords: Array.isArray(_cord[0].coordinates[0]) ? true : false });
        response.send(_cord[0]);
    })
});

app.listen(port, (err) => {
    if (err) {
        return console.log('error:', err)
    }
    console.log(`server is listening on ${port}`)
})