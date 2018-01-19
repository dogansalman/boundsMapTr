const jsonfile = require('jsonfile');
const fs = require('fs');

// Database Source
const town =  require('../data/src/towns');
const cities =  require('../data/src/cities');

// Bounds Cordinates Data
const cities_coord =  require('../data/src/cities_coords');
const towns_coord =  require('../data/src/towns_coords');

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
      path = path + d + '/'
      if (!fs.existsSync(path))  fs.mkdirSync(path);
    })

}

// Save JSON
function save(path, filename, data) {

jsonfile.writeFile(path + '/' + filename + '.json' , data, function (err) {
    if(err) console.log(path + '/' + filename + '.json' + ' is not saved');
})
}

/*
 Build cities bounds coordinates
* */

// create city dir
createDir('map-bounds/cities');


// cities temp array

cities_coord.forEach(_cc => {
    const citySource =  cities.find(cs => toEng(cs.name) === toEng(_cc.name));
    if(!citySource) console.error(_cc.name + ' ' + _cc.id + ' cities not found');
    if(citySource) {

        //create city directory
        const city_dir = 'map-bounds/cities';
        createDir(city_dir);

        //change property
        _cc.id = citySource.id;
        Object.assign(_cc, {multi_coords: Array.isArray(_cc.coordinates) ? true : false});

        //save city
        save(city_dir, _cc.id, _cc);
    }
});

