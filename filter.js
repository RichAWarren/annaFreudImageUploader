const env = require('env2');
const fs = require('fs');
env('config.env')

const sortImages = (min, max) => {
    fs.readFile(process.env.LOCAL_PATH_DATA, (error, data) => {
        const object = JSON.parse(data)
        const keyArray = Object.keys(JSON.parse(data))
        const emotionArray = Object.keys(object[keyArray[0]][0].scores)
        let outputObject = {}
        for (i = 0; i < keyArray.length; i++) {
            let topEmotion = 0;
            for (j = 0; j < emotionArray.length; j++) {
                if (object[keyArray[i]][0].scores[emotionArray[j]] > topEmotion) {
                    topEmotion = object[keyArray[i]][0].scores[emotionArray[j]]
                }
            }
            if (topEmotion > min && topEmotion < max) {
                outputObject[keyArray[i]] = object[keyArray[i]]
            }
        }
        return outputObject
    })
}
