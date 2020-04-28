const Discord = require('discord.js');
const proper = require('./properCase');
const Pokedex = require('pokedex-promise-v2');
const P = new Pokedex();
const DEFAULT_ERROR = "Invalid entry. Maybe you misspelt something?";
const DONT_ENTER_FORM_ERROR = DEFAULT_ERROR + "\n*(For this command, please just enter the pokemon name, regardless of form)*";
const NEED_FORM_ERROR = DEFAULT_ERROR + "\n*(If you wish to see a pokemon's specific form, please enter in the format `[name]-[form]`, or type `forms` to see a list of possible forms)*";

exports.getDexEntry = function (name, channel) {
    P.getPokemonSpeciesByName(name)
        .then(function (pokemon) {
            //Get all the necessary pokemon values
            var pkmnGenus = pokemon.genera[2].genus; //Index 2 of the genera array is the english translation
            var pkmnId = pokemon.id;
            var pkmnName = proper.properCase(pokemon.name);
            P.getPokemonByName(pokemon.varieties[0].pokemon.name)
                .then(function (specificPokemon) {
                    var pkmnHeight = specificPokemon.height / 10; //Height in metres
                    var pkmnWeight = specificPokemon.weight / 10; //Weight in kilograms
                    var pkmnImage = specificPokemon.sprites.front_default;
                    //Pokemon's type(s) is an array with objects in reverse order
                    var pkmnTypes = [];
                    for (var i = 0; i < specificPokemon.types.length; i++) {
                        pkmnTypes[i] = proper.properCase(specificPokemon.types[i].type.name);
                    }
                    pkmnTypes = pkmnTypes.reverse().join("/");
                    //Pokemon's abilit(y/ies) are also an array in reverse order than we'd like it
                    var pkmnAbilities = [];
                    var pkmnHiddenAbility = "None";
                    for (var i = 0; i < specificPokemon.abilities.length; i++) {
                        if (!specificPokemon.abilities[i].is_hidden) {
                            pkmnAbilities[i] = proper.properCase(specificPokemon.abilities[i].ability.name);
                        } else {
                            pkmnHiddenAbility = proper.properCase(specificPokemon.abilities[i].ability.name);
                        }
                    }
                    pkmnAbilities = pkmnAbilities.filter(function (i) {
                        return i != null;
                    });
                    pkmnAbilities = pkmnAbilities.join("/");
                    //Now we must format all the information correctly in an embed to send
                    channel.send(makeEmbed(pkmnName, pkmnId, pkmnGenus, pkmnImage, pkmnTypes, pkmnHeight, pkmnWeight, pkmnAbilities, pkmnHiddenAbility));
                })
                .catch(function (error) {
                    channel.send('There was an ERROR', error);
                });
        })
        .catch(function () {
            //Maybe the person wants to see a specific form of a pokemon?
            P.getPokemonByName(name)
                .then(function (specificPokemon) {
                    var pkmnHeight = specificPokemon.height / 10; //Height in metres
                    var pkmnWeight = specificPokemon.weight / 10; //Weight in kilograms
                    var pkmnImage = specificPokemon.sprites.front_default;
                    //Pokemon's type(s) is an array with objects in reverse order
                    var pkmnTypes = [];
                    for (var i = 0; i < specificPokemon.types.length; i++) {
                        pkmnTypes[i] = proper.properCase(specificPokemon.types[i].type.name);
                    }
                    pkmnTypes = pkmnTypes.reverse().join("/");
                    //Pokemon's abilit(y/ies) are also an array in reverse order than we'd like it
                    var pkmnAbilities = [];
                    var pkmnHiddenAbility = "None";
                    for (var i = 0; i < specificPokemon.abilities.length; i++) {
                        if (!specificPokemon.abilities[i].is_hidden) {
                            pkmnAbilities[i] = proper.properCase(specificPokemon.abilities[i].ability.name);
                        } else {
                            pkmnHiddenAbility = proper.properCase(specificPokemon.abilities[i].ability.name);
                        }
                    }
                    pkmnAbilities = pkmnAbilities.filter(function (i) {
                        return i != null;
                    });
                    pkmnAbilities = pkmnAbilities.join("/");
                    P.getPokemonSpeciesByName(specificPokemon.species.name)
                        .then(function (pokemon) {
                            var pkmnGenus = pokemon.genera[2].genus; //Index 2 of the genera array is the english translation
                            var pkmnId = pokemon.id;
                            var pkmnName = proper.properCase(pokemon.name);
                            //Now that we have all the data, send it off!
                            channel.send(makeEmbed(pkmnName, pkmnId, pkmnGenus, pkmnImage, pkmnTypes, pkmnHeight, pkmnWeight, pkmnAbilities, pkmnHiddenAbility));
                        })
                })
                .catch(function (error) {
                    channel.send(NEED_FORM_ERROR, error);
                })
        });
}

exports.getPokemonId = function (name, channel) {
    P.getPokemonSpeciesByName(name)
        .then(function (pokemon) {
            var response = "";
            for (var i = pokemon.pokedex_numbers.length - 1; i > 0; i--) {
                response += 'In the `' + pokemon.pokedex_numbers[i].pokedex.name + '` pokedex, ' + proper.properCase(pokemon.name) + ' is #`' + pokemon.pokedex_numbers[i].entry_number + '`\n';
            }
            response = response == "" ? "In the `national` pokedex, " + proper.properCase(pokemon.name) + " is #`" + pokemon.id + "`" : response;
            channel.send(response);
        })
        .catch(function (error) {
            channel.send(DONT_ENTER_FORM_ERROR, error);
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
            channel.send(DONT_ENTER_FORM_ERROR, error);
        });
}

exports.getForms = function (name, channel) {
    P.getPokemonSpeciesByName(name)
        .then(function (pokemon) {
            var returnValue = "Forms of **" + proper.properCase(pokemon.name) + "**:\n";
            for (var i = 0; i < pokemon.varieties.length; i++) {
                returnValue += "`" + pokemon.varieties[i].pokemon.name + "`\n";
            }
            channel.send(returnValue);
        })
        .catch(function (error) {
            channel.send(DONT_ENTER_FORM_ERROR, error);
        })
}

exports.getStats = function (name, channel) {
    P.getPokemonByName(name)
        .then(function (pokemon) {
            channel.send("Stats for **" + proper.properCase(pokemon.name) + "**:\n```HP \n" + drawStatBar(pokemon.stats[5].base_stat) +
                "\nAttack\n" + drawStatBar(pokemon.stats[4].base_stat) + "\nDefense\n" + drawStatBar(pokemon.stats[3].base_stat) +
                "\nSpecial Attack\n" + drawStatBar(pokemon.stats[2].base_stat) + "\nSpecial Defense\n" + drawStatBar(pokemon.stats[1].base_stat) +
                "\nSpeed\n" + drawStatBar(pokemon.stats[0].base_stat) + "```");
        })
        .catch(function () {
            //Pokemon might just be a generic species
            P.getPokemonSpeciesByName(name)
                .then(function (maybePokemon) {
                    P.getPokemonByName(maybePokemon.varieties[0].pokemon.name)
                        .then(function (pokemon) {
                            channel.send("Stats for **" + proper.properCase(pokemon.name) + "**:\n```HP \n" + drawStatBar(pokemon.stats[5].base_stat) +
                                "\nAttack\n" + drawStatBar(pokemon.stats[4].base_stat) + "\nDefense\n" + drawStatBar(pokemon.stats[3].base_stat) +
                                "\nSpecial Attack\n" + drawStatBar(pokemon.stats[2].base_stat) + "\nSpecial Defense\n" + drawStatBar(pokemon.stats[1].base_stat) +
                                "\nSpeed\n" + drawStatBar(pokemon.stats[0].base_stat) + "```");
                        })
                        .catch(function (error) {
                            channel.send(DEFAULT_ERROR, error);
                        })
                })
                .catch(function (error) {
                    channel.send(NEED_FORM_ERROR, error);
                })
        })
}

function makeEmbed(pkmnName, pkmnId, pkmnGenus, pkmnImage, pkmnTypes, pkmnHeight, pkmnWeight, pkmnAbilities, pkmnHiddenAbility) {
    return new Discord.MessageEmbed()
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
}

function drawStatBar(stat) {
    const fullBlock = '\u2588';
    const threeQuarterBlock = '\u2593';
    const halfBlock = '\u2592';
    const quarterBlock = '\u2591';
    var initialStat = stat;
    var returnValue = "";
    for (var i = 0; i < 32; i++) {
        switch (true) {
            case (stat - 8 >= 0):
                returnValue += fullBlock;
                break;
            case (stat - 8 == -1 || stat - 8 == -2):
                returnValue += threeQuarterBlock;
                break;
            case (stat - 8 == -3 || stat - 8 == -4):
                returnValue += halfBlock;
                break;
            case (stat - 8 == -5 || stat - 8 == -6):
                returnValue += quarterBlock;
                break;
            default:
                returnValue += " ";
                break;
        }
        stat = stat - 8 < 0 ? 0 : stat - 8;
    }
    return returnValue + " " + initialStat;
}