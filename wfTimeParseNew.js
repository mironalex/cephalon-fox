'use strict';

// Using this for getting the URL to parse
const request = require('request-promise');

// URL to try and parse for the Cetus time
let wfStateURL = 'http://content.warframe.com/dynamic/worldState.php';

/**
 * Get the Day/Night cycle message (One huge function)
 * @returns {String} 
 */
function updateTime() {
    // Get the warframe state JSON manifest to get the timestamp of the next night cycle
    return request.get(wfStateURL)
        .then((response) => {
            let worldState;
            try {
                worldState = JSON.parse(response);
            } catch (exception) {
                return `Could not fetch Cetus time: ${exception}`;
            }
            // this syndicate mission is actually the Cetus bounty guy
            let syndicate = worldState["SyndicateMissions"].find(element => (element["Tag"] == "CetusSyndicate"));

            if (syndicate == undefined) {
                return `Could not parse for syndicate bounties`;
            }
            // The activation time, converted to whole seconds
            let timestamp = Math.floor(syndicate["Expiry"]["$date"]["$numberLong"] / 1000);
            console.log('Got Cetus time successfully');

            let untilCycle;
            let currentCycle;
            let next_interval;
            let d = new Date();
            let time = d.getTime() / 1000;
            // This time is the end of night and start of day
            let start_time = (timestamp - 150 * 60)

            let irltime_m = ((time - start_time) / 60) % 150;  // 100m of day + 50m of night

            // Eidolon time is used to calculate the IRL time
            let eidotime_in_h = (irltime_m / 6.25) + 6;
            if (eidotime_in_h < 0) eidotime_in_h += 24;
            if (eidotime_in_h > 24) eidotime_in_h -= 24;
            let eidotime_h = Math.floor(eidotime_in_h);
            let eidotime_m = Math.floor((eidotime_in_h * 60) % 60);
            let eidotime_s = Math.floor((eidotime_in_h * 60 * 60) % 60);

            let wrapped_time = eidotime_in_h - 5;
            if (wrapped_time < 0) { wrapped_time += 24; }

            // Night is from 9pm to 5am
            // Day is from 5am to 9pm
            if (150 - irltime_m > 50) {
                // Time is day
                next_interval = 21;
                currentCycle = 'Day'
                untilCycle = 'Night';
            } else {
                // Time is night
                next_interval = 5;
                currentCycle = 'Night';
                untilCycle = 'Day';
            }

            let eido_until_h = next_interval - (eidotime_h % 24);
            if (eido_until_h < 0) { eido_until_h += 24; }
            let eido_until_m = 60 - eidotime_m;
            let eido_until_s = 60 - eidotime_s;

            let irl_until_in_h = ((eido_until_h + eido_until_m / 60 + eido_until_s / 60 / 60) * 6.25) / 60;

            let irl_until_in_m = 150 - irltime_m;

            if (irl_until_in_m > 50) { irl_until_in_m -= 50; }

            let irl_until_h = Math.floor(irl_until_in_m / 60);
            let irl_until_m = Math.floor(irl_until_in_m % 60);
            let irl_until_s = Math.floor((irl_until_in_m * 60) % 60);

            return `It is ccurently ${currentCycle}. \n\n${irl_until_h}h ${irl_until_m}m ${irl_until_s}s until ${untilCycle}.`;
        })
}

// /**
//  * Get the Day/Night cycle message (One huge function)
//  * @returns {String} 
//  */
// function updateTime() {
//     let untilCycle;
//     let currentCycle;
//     let next_interval;
//     let d = new Date();
//     let time = d.getTime() / 1000;
//     // This time is the end of night and start of day
//     let start_time = 1522764301;
//     let irltime_m = ((time - start_time) / 60) % 150;  // 100m of day + 50m of night

//     // Eidolon time is used to calculate the IRL time
//     let eidotime_in_h = (irltime_m / 6.25) + 6;
//     if (eidotime_in_h < 0) eidotime_in_h += 24;
//     if (eidotime_in_h > 24) eidotime_in_h -= 24;
//     let eidotime_h = Math.floor(eidotime_in_h);
//     let eidotime_m = Math.floor((eidotime_in_h * 60) % 60);
//     let eidotime_s = Math.floor((eidotime_in_h * 60 * 60) % 60);

//     let wrapped_time = eidotime_in_h - 5;
//     if (wrapped_time < 0) { wrapped_time += 24; }

//     // Night is from 9pm to 5am
//     // Day is from 5am to 9pm
//     if (150 - irltime_m > 50) {
//         // Time is day
//         next_interval = 21;
//         currentCycle = 'Day'
//         untilCycle = 'Night';
//     } else {
//         // Time is night
//         next_interval = 5;
//         currentCycle = 'Night';
//         untilCycle = 'Day';
//     }

//     let eido_until_h = next_interval - (eidotime_h % 24);
//     if (eido_until_h < 0) { eido_until_h += 24; }
//     let eido_until_m = 60 - eidotime_m;
//     let eido_until_s = 60 - eidotime_s;

//     let irl_until_in_h = ((eido_until_h + eido_until_m / 60 + eido_until_s / 60 / 60) * 6.25) / 60;

//     let irl_until_in_m = 150 - irltime_m;

//     if (irl_until_in_m > 50) { irl_until_in_m -= 50; }

//     let irl_until_h = Math.floor(irl_until_in_m / 60);
//     let irl_until_m = Math.floor(irl_until_in_m % 60);
//     let irl_until_s = Math.floor((irl_until_in_m * 60) % 60);

//     return `It is ccurently ${currentCycle}. \n\n${irl_until_h}h ${irl_until_m}m ${irl_until_s}s until ${untilCycle}.`;
// }

// Export the function
module.exports.updateTime = updateTime;