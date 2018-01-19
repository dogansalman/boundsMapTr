const jsonfile = require('jsonfile');
const fs = require('fs');

console.log('building....');
jsonfile.readFile('data/towns.json', (err,towns) => {
    jsonfile.readFile('data/cities.json', (err,cities) => {
        jsonfile.readFile('data/counties.json', (err,counties) => {
             counties.forEach(c => {
                c.id = cities.find(a => a.name.toLowerCase() === c.name.toLowerCase()).id;

                //check create directory
                 const _dir  = 'bounds/towns/';
                 if (!fs.existsSync(_dir))  fs.mkdirSync(_dir);

                const dir = 'bounds/towns/' + c.id;
                if (!fs.existsSync(dir))  fs.mkdirSync(dir);
                  c.county.forEach(_c => {
                    const x = towns.find(_town => _town.name.toLowerCase() === _c.name.toLowerCase() && Number(c.id) === Number(_town.city_id));
                    if(x) {
                        _c.id = x.id;
                        const dir2 = dir + '/' + _c.id + '.json';
                        jsonfile.writeFile(dir2, _c, function (err) {
                            console.error(err)
                        })
                    }
                })
            });
            console.log('building complate');
        })
    })
});

