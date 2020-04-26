const Discord = require('discord.js');
const proper = require('./properCase');
const Pokedex = require('pokedex-promise-v2');
const P = new Pokedex();

exports.getDexEntry = function (name, channel) {
    P.getPokemonByName(name)
        .then(function (pokemon) {
            //Get all the proper values of the pokemon
            var pkmnName = proper.properCase(pokemon.name);
            var pkmnId = pokemon.id;
            var pkmnHeight = pokemon.height / 10; //Height in metres
            var pkmnWeight = pokemon.weight / 10; //Weight in kilograms
            var pkmnImage = pokemon.sprites.front_default;
            //Pokemon's type(s) is an array with objects in reverse order
            var pkmnTypes = [];
            for (var i = 0; i < pokemon.types.length; i++) {
                pkmnTypes[i] = proper.properCase(pokemon.types[i].type.name);
            }
            pkmnTypes = pkmnTypes.reverse().join("/");
            //Pokemon's abilit(y/ies) are also an array in reverse order than we'd like it
            var pkmnAbilities = [];
            var pkmnHiddenAbility = "None";
            for (var i = 0; i < pokemon.abilities.length; i++) {
                if (!pokemon.abilities[i].is_hidden) {
                    pkmnAbilities[i] = proper.properCase(pokemon.abilities[i].ability.name);
                } else {
                    pkmnHiddenAbility = proper.properCase(pokemon.abilities[i].ability.name);
                }
            }
            pkmnAbilities = pkmnAbilities.filter(function (i) {
                return i != null;
            });
            pkmnAbilities = pkmnAbilities.join("/");
            //To access the genus of the pokemon we must use another command in the pokeapi
            var pkmnGenus;
            P.getPokemonSpeciesByName(pokemon.name)
                .then(function (pokemonSpecies) {
                    pkmnGenus = pokemonSpecies.genera[2].genus; //Index 2 of the genera array is the english translation
                    //Now we must format all the information correctly in an embed to send
                    const embed = new Discord.MessageEmbed()
                        .setTitle(pkmnName)
                        .setAuthor("Pokemon #" + pkmnId)
                        .setDescription(pkmnGenus)
                        .setThumbnail(pkmnImage)
                        .addFields(
                            { name: "Type", value: pkmnTypes, inline: true },
                            { name: "Height", value: pkmnHeight + " m", inline: true },
                            { name: "Weight", value: pkmnWeight + " kg", inline: true },
                            { name: "Abilities", value: pkmnAbilities, inline: true },
                            { name: "Hidden Ability", value: pkmnHiddenAbility, inline: true }
                        );
                    channel.send(embed);
                })
                .catch(function (error) {
                    channel.send('There was an ERROR', error);
                });
        })
        .catch(function (error) {
            channel.send('Invalid entry. Maybe you misspelt something?', error);
        });
}

exports.getPokemonId = function (name, channel) {
    P.getPokemonSpeciesByName(name)
        .then(function (pokemon) {
            var response = "";
            for (var i = pokemon.pokedex_numbers.length - 1; i > 0; i--) {
                response += 'In the `' + pokemon.pokedex_numbers[i].pokedex.name + '` pokedex, ' + proper.properCase(pokemon.name) + ' is #`' + pokemon.pokedex_numbers[i].entry_number + '`\n';
            }
            channel.send(response);
        })
        .catch(function (error) {
            channel.send('Invalid entry. Maybe you misspelt something?', error);
        });
}

exports.getFlavorText = function (name, channel) {
    P.getPokemonSpeciesByName(name)
        .then(function (pokemon) {
            var flavorText = [];
            var j = 0;
            for (var i = 0; i < pokemon.flavor_text_entries.length; i++) {
                //Only keep track of the entries that are english
                //Maybe in the future add additional command for other languages?
                if (pokemon.flavor_text_entries[i].language.name == 'en') {
                    flavorText[j] = "```" + pokemon.flavor_text_entries[i].flavor_text + "\n~ PKMN " + proper.properCase(pokemon.flavor_text_entries[i].version.name + "```");
                    j++;
                }
            }
            channel.send(flavorText[Math.floor(Math.random() * flavorText.length)]);
        })
        .catch(function (error) {
            channel.send('Invalid entry. Maybe you misspelt something?', error);
        });
}