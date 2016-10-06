const request = require('request');
const env = require('env2');
env('config.env');

request({
    url: 'https://api.projectoxford.ai/emotion/v1.0/recognize', //URL to hit
    // qs: , //Query string data
    method: 'POST',
    headers: {
        'Ocp-Apim-Subscription-Key': process.env.API_EMOTION_KEY
    },
    body: JSON.stringify({url: "http://res.cloudinary.com/faceit/image/upload/v1475672094/a70442_1280.jpg"})
}, function(error, response, body){
    if(error) {
        console.log(error);
    } else {
        console.log(response.statusCode, body);
    }
});
