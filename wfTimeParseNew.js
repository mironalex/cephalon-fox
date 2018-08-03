'use strict';
// Using this for getting the URL to parse
const request = require('request-promise');

// URL to try and parse for the Cetus time
let wfStateURL = 'http://content.warframe.com/dynamic/worldState.php';

const DAY = 0;
const NIGHT = 1;
const cycles = ['Day', 'Night'];
const cyclesEmoji = [':sunny:', ':crescent_moon:'];

/**
 * Get the timestamp of Cetus/Plains of Eidolon
 * @returns {number}
 */
function getCetusTimestamp(){
    return request.get(wfStateURL)
        .then((stateJSON) => {
            let worldState;
            try {
                worldState = JSON.parse(stateJSON);
            } catch (exception) {
                console.log(exception);
            }
            // this syndicate mission is actually the Cetus bounty guy
            let syndicate = worldState["SyndicateMissions"].find(element => (element["Tag"] === "CetusSyndicate"));

            if (syndicate === undefined) {
                console.log(`Could not parse for syndicate bounties`);
            }
            // The activation time, converted to whole seconds
            return Math.floor(syndicate["Expiry"]["$date"]["$numberLong"] / 1000);
        })
}

/**
 * Translates in-game timestamp to IRL information
 * @param timestamp the in-game timestamp
 * @returns {until_h: number, until_m: number, until_s: number, cycle: string}
 */
function translateToIRL(timestamp){
    let currentCycle;
    let next_interval;
    let d = new Date();
    let time = d.getTime() / 1000;
    // This time is the end of night and start of day
    let start_time = (timestamp - 150 * 60);

    let irltime_m = ((time - start_time) / 60) % 150;  // 100m of day + 50m of night

    // Eidolon time is used to calculate the IRL time
    let eidotime_in_h = (irltime_m / 6.25) + 6;
    if (eidotime_in_h < 0) eidotime_in_h += 24;
    if (eidotime_in_h > 24) eidotime_in_h -= 24;
    let eidotime_h = Math.floor(eidotime_in_h);
    let eidotime_m = Math.floor((eidotime_in_h * 60) % 60);
    let eidotime_s = Math.floor((eidotime_in_h * 60 * 60) % 60);

    // Night is from 9pm to 5am
    // Day is from 5am to 9pm
    if (150 - irltime_m > 50) {
        // Time is day
        next_interval = 21;
        currentCycle = DAY;
    } else {
        // Time is night
        next_interval = 5;
        currentCycle = NIGHT;
    }

    let eido_until_h = next_interval - (eidotime_h % 24);
    if (eido_until_h < 0) { eido_until_h += 24; }
    let eido_until_m = 60 - eidotime_m;
    let eido_until_s = 60 - eidotime_s;

    let irl_until_in_m = 150 - irltime_m;

    if (irl_until_in_m > 50) { irl_until_in_m -= 50; }

    let irl_until_h = Math.floor(irl_until_in_m / 60);
    let irl_until_m = Math.floor(irl_until_in_m % 60);
    let irl_until_s = Math.floor((irl_until_in_m * 60) % 60);

    return {
        until_h: irl_until_h,
        until_m: irl_until_m,
        until_s: irl_until_s,
        cycle: currentCycle
    }
}

function getIRLState(){
    return getCetusTimestamp()
        .then(timestamp => {
            return translateToIRL(timestamp);
        })
}

/**
 * Get the Day/Night cycle message (One huge function)
 * @returns {String}
 */
function getTimeMessage() {
    return getCetusTimestamp()
        .then(timestamp =>{
            console.log('Got Cetus time successfully');

            let irl_state = translateToIRL(timestamp);

            let h = irl_state.until_h;
            let m = irl_state.until_m;
            let s = irl_state.until_s;
            let current_cycle = cycles[irl_state.cycle];
            let emoji = cyclesEmoji[irl_state.cycle];
            let next_cycle = cycles[(irl_state.cycle + 1) % 2];

            return `It is currently ${emoji} (${current_cycle}) on Cetus. \n\n` +
                `${h}h ${m}m ${s}s until ${next_cycle}.`;
    });
}

// Export the function
module.exports.getTimeMessage = getTimeMessage;
module.exports.getIRLState = getIRLState;