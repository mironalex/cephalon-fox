'use strict';

// Config file that has the private variables needed
const config = require('./config.js');
const ver = '2.0.0';

// This is the custom parser to get the current time cycle on Cetus
let parser = require('./wfTimeParseNew');

// Node requires
var fs = require('fs');
var os = require('os');

// Initialize the Discord bot using discord.js
const Discord = require('discord.js');
const client = new Discord.Client();

client.login(config.token);

client.on('ready', () => {
    console.log(`Connected to Discord.\nLogged in as ${client.user.username} (${client.user.id})`);

    // Set the topic change timer
    setInterval(() => {
        changeTimeTopic();
    }, 1 * 60000);

    // Set the bot to be 'playing' a game
    client.user.setActivity(`Warframe (Cetus - Level 10-30)`);
});

client.on('message', async message => {
    let prefix = '~';
    // TODO: handle mentions and help messages
    // This event will run on every single message received, from any channel or DM

    // It's good practice to ignore other bots. This also makes your bot ignore itself
    if (message.author.bot) return;
    // Also good practice to ignore any message that does not start with the bot'ss prefix, 
    if (message.content.indexOf(prefix) !== 0) return;

    // Here we separate the 'command' name, and the 'arguments' for the command.
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    switch (command) {
        case 'help':                                            // display the help file
            let helpMsg = fs.readFileSync('./helpNotes.txt');
            message.channel.send('```' + helpMsg.toString() + '```');
            break;
        case 'ver':
            message.channel.send(`Version: ${ver} Running on server: ${os.type()} ${os.hostname()} ${os.platform()} ${os.cpus()[0].model}`);
            break;
        case 'ping':
            // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
            // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
            const m = await message.channel.send('Ping?');
            m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
            break;
        case 'time':
            return getTime(message.channel.id);
        default:
            // If command character + unknown command is given we at least need to let the user know
            let errorEmbed = `Uknown command: **${command}**`;
            return message.channel.send(errorEmbed);
    }
});

// This will send the message after the parser creates the string
function getTime(channelIDArg) {
    parser.updateTime()
        .then((response) => {
            let discordChannel = client.channels.get(channelIDArg);
            discordChannel.send(response);
        })
        .catch((err) => {
            discordChannel.setTopic('Could not fetch Cetus time.');
            console.log(err);
        })
}

// Change the topic of the TS server to show the current time (this doesn't work for mnore than 1 server right now)
function changeTimeTopic() {
    let discordChannel = client.channels.get(config.channelID);
    parser.updateTime()
        .then((response) => {
            discordChannel.setTopic(response);
        })
        .catch((err) => {
            discordChannel.setTopic('Could not fetch Cetus time.');
            console.log(err);
        })
}