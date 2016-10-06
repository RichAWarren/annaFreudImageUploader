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
        let object = JSON.parse(data);
        upload(files, count, picturesArray, object)
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
    console.log(filename, endObject[filename.substring(0, filename.length -4)]);

    if (!endObject[filename.substring(0, filename.length -4)]) {
        if(filename.includes('.jpg') || filename.includes('.JPG') || filename.includes('.png') || filename.includes('.gif')) {
            cloudinary.uploader.upload(`${process.env.LOCAL_PATH + filename}`, (result) => {
                apiRequest(array, index, endArray, result, endObject)
            }, {
                public_id: filename.substring(0, filename.length -4)
            });
        } else {
            Object.keys(endObject).length === array.length - 1 ? write(endObject): upload(array, (index + 1), endArray, endObject)
        }
    } else {
        console.log('Already saved ' + index);
        Object.keys(endObject).length === array.length - 1 ? write(endObject): upload(array, (index + 1), endArray, endObject)
    }
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
            let tempArray = JSON.parse(body)
            let objectName = filename.substring(0, filename.length -4)
            tempArray[0].cloudinary = result
            endObject[objectName] = tempArray
            console.log('uploaded ' + index)
            Object.keys(endObject).length === array.length - 1 ? write(endObject): upload(array, (index + 1), endArray, endObject)
        }
    });
}
