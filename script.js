const cloudinary = require('cloudinary');
const env = require('env2');
const fs = require('fs');
const request = require('request');
env('config.env');


cloudinary.config({
    cloud_name: 'faceit',
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

//main function
fs.readFile(process.env.LOCAL_PATH_DATA, (error, data) => {
    fs.readdir(process.env.LOCAL_PATH, (err, files) => {
        let picturesArray = [];
        let count = 0;
        let cleanFiles = cleanFilenames(files)
        let newImages = findNewImages(JSON.parse(data), cleanFiles)
        console.log(newImages.length + ' new images');
        upload(newImages, count, picturesArray, JSON.parse(data))
    })
})


//write function
const write = (array) => {
    fs.writeFile('images.json', JSON.stringify(array, null, 2), 'utf8', (err) => {
        if (err) throw err;
        console.log('It\'s saved!');
    });
}

//upload function
const upload = (array, index, endArray, endObject) => {
    const filename = array[index]
    cloudinary.uploader.upload(`${process.env.LOCAL_PATH + filename + '.jpg'}`, (result) => {
        apiRequest(array, index, endArray, result, endObject)
    }, {
        public_id: filename
    });
}

//request function
const apiRequest = (array, index, endArray, result, endObject) => {
    const filename = array[index]
    request({
        url: 'https://api.projectoxford.ai/emotion/v1.0/recognize',
        method: 'POST',
        headers: {
            'Ocp-Apim-Subscription-Key': process.env.API_EMOTION_KEY
        },
        body: JSON.stringify({url: result.url})
    }, function(error, response, body){
        if(error) {
            console.log(error);
        } else {
            console.log('uploaded ' + (index + 1))
            let tempArray = JSON.parse(body)
            tempArray[0].cloudinary = result
            endObject[filename] = tempArray
            array.length - 1 === index ? write(endObject): upload(array, (index + 1), endArray, endObject)
        }
    });
}

const findNewImages = (data, array) => {
    let oldArray = Object.keys(data)
    let newPhotos = array.filter((el) => {
        return oldArray.indexOf( el ) < 0;
    });
    return newPhotos
}

const cleanFilenames = (array) => {
    var tarray = []
    for(i = 0; i < array.length; i++) {
        if(array[i].includes('.jpg') || array[i].includes('.JPG') || array[i].includes('.png') || array[i].includes('.gif')) {
            tarray.push(array[i].substring(0, array[i].length -4))
        }
    }
    return tarray;
}
