const request = require('request');

/**
 * Request the Warframe world state URL (Promise based)
 * @param {String} url 
 * @returns {Promise<Body>}
 */
function requestUrl(url) {
    // set up the options so we don't have to constantly redefine our user agent
    console.log(`URL is: ${url}`);
    let options = {
        uri: url,
        headers: {
            'User-Agent': `Node ${process.version}`
        },
        json: true
    };
    return new Promise((resolve, reject) => {
        request.get(options, function (err, response, body) {
            if (err) {
                return reject(err);
            }
            if (response.statusCode !== 200) {
                return reject('GET did not return OK');
            }
            return resolve(body);
        })
    })
}

// Get the PC data's JSON (All we really need to care about) 
function refreshCetusStartTime() {
    // As of April 3rd, 2018
    let timestamp = 1522764301;
    return requestUrl('http://content.warframe.com/dynamic/worldState.php')
        .then((responseBody) => {
            let worldState = JSON.parse(responseBody);
            let syndicate = worldState["SyndicateMissions"].find(element => (element["Tag"] == "CetusSyndicate"));
            // The activation time, converted to whole seconds
            timestamp = Math.floor(syndicate["Activation"]["$date"]["$numberLong"] / 1000);
            console.log("Fetched Cetus time: ", timestamp);
            return timestamp;
        })
        .catch((err) => {
            console.log(`Error ocurred: ${err}\n\nUsing default timestamp`);
            return timestamp;
        })
}

module.exports.refreshCetusStartTime = refreshCetusStartTime