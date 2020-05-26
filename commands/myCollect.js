const Discord = require('discord.js');
const BOT_USER_ID = "546043647297060864";

/* Function will collect all messages sent within 10 seconds that contain a specific character
    Pre: s is a string, channel is the channel in which messages are being collected
    Post: After 10 seconds, a message is displayed with all the collected items*/
exports.collectWithSubstring = function (s, channel) {
    const filter = m => m.content.includes(s) && m.author.id != BOT_USER_ID;
    channel.send(`Now collecting all items with substring "${s}" for 10 seconds...`);
    const collector = channel.createMessageCollector(filter, { time: 10000 });
    var results = [];

    collector.on('collect', m => {
        console.log(`Collected "${m.content}"`);
        results.push(m.content);
    })

    collector.on('end', collected => {
        return channel.send(`Collected ${collected.size} items:\n"${results.join('", "')}"`);
    })
}