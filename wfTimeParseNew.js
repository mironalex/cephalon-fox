'use strict';
/**
 * Get the Day/Night cycle message (One huge function)
 * @returns {String} 
 */
function updateTime() {
    var untilCycle;
    var currentCycle;
    var next_interval;
    var d = new Date();
    var time = d.getTime() / 1000;
    // This time is the end of night and start of day
    var start_time = 1510885052;
    var irltime_m = ((time - start_time) / 60) % 150;  // 100m of day + 50m of night

    // Eidolon time is used to calculate the IRL time
    var eidotime_in_h = (irltime_m / 6.25) + 6;
    if (eidotime_in_h < 0) eidotime_in_h += 24;
    if (eidotime_in_h > 24) eidotime_in_h -= 24;
    var eidotime_h = Math.floor(eidotime_in_h);
    var eidotime_m = Math.floor((eidotime_in_h * 60) % 60);
    var eidotime_s = Math.floor((eidotime_in_h * 60 * 60) % 60);

    var wrapped_time = eidotime_in_h - 5;
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

    var eido_until_h = next_interval - (eidotime_h % 24);
    if (eido_until_h < 0) { eido_until_h += 24; }
    var eido_until_m = 60 - eidotime_m;
    var eido_until_s = 60 - eidotime_s;

    var irl_until_in_h = ((eido_until_h + eido_until_m / 60 + eido_until_s / 60 / 60) * 6.25) / 60;

    var irl_until_in_m = 150 - irltime_m;

    if (irl_until_in_m > 50) { irl_until_in_m -= 50; }

    var irl_until_h = Math.floor(irl_until_in_m / 60);
    var irl_until_m = Math.floor(irl_until_in_m % 60);
    var irl_until_s = Math.floor((irl_until_in_m * 60) % 60);

    return `It is ccurently ${currentCycle}. \n\n${irl_until_h}h ${irl_until_m}m ${irl_until_s}s until ${untilCycle}.`;
}

// Export the function
module.exports.updateTime = updateTime;