const Discord = require('discord.js');
const weather = require('weather-js');

exports.getWeather = function (location, channel) {
    weather.find({ search: location, degreeType: 'C' }, function (err, result) {
        if (err || result.length == 0) {
            channel.send("Please enter a valid location");
            return;
        }
        //Get the current weather info
        var current = result[0].current;
        //Put the results in an embed so it looks prettier
        const embed = new Discord.MessageEmbed()
            .setDescription("**" + current.skytext + "**")
            .setAuthor("Weather at " + current.observationpoint)
            .setThumbnail(current.imageUrl)
            .setColor("0099ff")
            .addFields(
                { name: "Temperature", value: current.temperature + "\xB0C", inline: true },
                { name: "Feels like", value: current.feelslike + "\xB0C", inline: true },
                { name: "Humidity", value: current.humidity + "%", inline: true },
                { name: "Winds", value: current.winddisplay, inline: true }
            )
            .setFooter("Local time: " + current.observationtime + " on " + current.date);
        channel.send({ embed });
    })
}

exports.getForecast = function (location, channel) {
    weather.find({ search: location, degreeType: 'C' }, function (err, result) {
        if (err || result.length == 0) {
            channel.send("Please enter a valid location");
            return;
        }
        //Get the forecast, which is an array of 5 objects, as well as the observation point
        var myLocation = result[0].current.observationpoint;
        var forecast = result[0].forecast;
        var returnValue = "**5 day forecast in " + myLocation + "**\n";
        for (var i = 0; i < forecast.length; i++) {
            returnValue += "```" + forecast[i].day + " - " + forecast[i].skytextday + "\nLow of " + forecast[i].low + "\xB0C, High of " + forecast[i].high + 
            "\xB0C\n" + (forecast[i].precip == '' ? 0 : forecast[i].precip) + "% chance of precipitation```";
        }
        channel.send(returnValue);
    })
}