const jsonfile = require('jsonfile');
const fs = require('fs');
const rimraf = require('rimraf');

// Database Source
const cities =  require('../data/src/cities');
const towns =  require('../data/src/towns');
const cities_coords =  require('../data/src/cities_coord_zingat');
const towns_coords =  require('../data/src/towns_coord_zingat');

// Char Convert TR TO EN
function toEng(str){
    const charMap = {
        Ç: 'C',
        Ö: 'O',
        Ş: 'S',
        İ: 'I',
        I: 'i',
        Ü: 'U',
        Ğ: 'G',
        ç: 'c',
        ö: 'o',
        ş: 's',
        ı: 'i',
        ü: 'u',
        ğ: 'g'
    };
    str_array = str.split('');
    for (var i = 0, len = str_array.length; i < len; i++) {
        str_array[i] = charMap[str_array[i]] || str_array[i];
    }
    str = str_array.join('');
    return str.replace(/[çöşüğı]/gi, "").toLowerCase();
}

// Create Directory
function createDir(_dir){
    const _dir_arr = _dir.split('/');
    let path = '';
    _dir_arr.forEach(d => {
      path = path + d + '/';
      if (!fs.existsSync(path))  fs.mkdirSync(path);
    })

}

// Save JSON
function save(path, filename, data) {

jsonfile.writeFile(path + '/' + filename + '.json' , data, function (err) {
    if(err) console.log(path + '/' + filename + '.json' + ' is not saved');
})
}

// cities

 let new_coord = [];
cities.forEach(_cc => {

    const cityCoords =  cities_coords.find(cs => toEng(cs.city.name) === toEng(_cc.name));
    if(!cityCoords) console.error(_cc.name + ' ' + _cc.id + ' cities coord not found');
     let coord = [];
     if(cityCoords.coordinates.length > 1) {

         cityCoords.coordinates.forEach(t => {

            t.forEach(t2 => {
                let subCord = [];
                t2.forEach(t3 => {
                    subCord.push({lat: t3[1], lon: t3[0]})
                    //t3.forEach(t4 => {

                    //})
                })
                coord.push(subCord);
            })
         });
     }
     else {
         cityCoords.coordinates[0][0].forEach(t => {
             coord.push({lat: t[1], lon: t[0]})
         });
     }
     new_coord.push({id: _cc.id, name: _cc.name, coordinates: coord});
     console.log(cityCoords.coordinates.length + ' ' + _cc.name);
});

// coords
let towns_coord = [];

towns.forEach((_t, i) => {
    const city = cities.find(_c => _c.id === _t.city_id);
    let coord = [];
    let county = {};



    if(city) {
        const townCoords = towns_coords.find(tc => toEng(tc.town.city_name) == toEng(city.name) && toEng(tc.town.town.name) ==  toEng(_t.name));
        if(!townCoords) console.error(_t.name + ' ' + _t.id + ' towns coord not found');

        if(townCoords.coordinates.length > 1) {
            townCoords.coordinates.forEach(t => {
                t.forEach(t2 => {
                    let subCord = [];
                    t2.forEach(t3 => {
                        subCord.push({lat: t3[1], lon: t3[0]})
                    });
                    coord.push(subCord);
                })
            });
        }
        else {
            townCoords.coordinates[0][0].forEach(t => {
                coord.push({lat: t[1], lon: t[0]})
            });
        }
        county = {
            name: _t.name,
            id: _t.id,
            cordinates: {
                coordinates: coord
            }
        };

        towns_coord.push({id: city.id, name: city.name, county: [county] });
        console.log(townCoords.coordinates.length + ' ' + _t.name);
        delete towns[i];

    }


});



//save coords

//create city directory
const city_dir = 'coord';
createDir(city_dir);
//save city
save(city_dir, 'city', new_coord);
//save towns
save(city_dir, 'towns', towns_coord);






