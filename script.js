const cloudinary = require('cloudinary');
const env = require('env2');
const fs = require('fs');
const imageList = require('./images.json')

env('config.env');

cloudinary.config({
    cloud_name: 'faceit',
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

fs.readdir(process.env.LOCAL_PATH, (err, files) => {
    let picturesArray = [];
    let count = 0;
    files.forEach((filename, index, array) => {
        if(filename.includes('.jpg') || filename.includes('.JPG') || filename.includes('.png') || filename.includes('.gif')) {
            cloudinary.uploader.upload(`${process.env.LOCAL_PATH + filename}`, function(result) {
                picturesArray.push(result)
                count ++;
                if (count === files.length) write(picturesArray);
            }, {
                public_id: filename.substring(0, filename.length -4)
            });
        } else {
            count ++
            if (count === files.length) write(picturesArray);
        }
    })
})

var write = (array) => {

    fs.writeFile('images.json', JSON.stringify(array, null, 2), 'utf8', (err) => {
        if (err) throw err;
        console.log('It\'s saved!');
    });
}
