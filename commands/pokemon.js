const Discord = require('discord.js');
const proper = require('./properCase');
const Pokedex = require('pokedex-promise-v2');
const P = new Pokedex();
const DEFAULT_ERROR = "Invalid entry. Maybe you misspelt something?";
const DONT_ENTER_FORM_ERROR = DEFAULT_ERROR + "\n*(For this command, please just enter the pokemon name, regardless of form)*";
const NEED_FORM_ERROR = DEFAULT_ERROR + "\n*(If you wish to see a pokemon's specific form, please enter in the format `[name]-[form]`, or type `forms` to see a list of possible forms)*";
const COLOR_MAP = new Map([["red", [255, 0, 0]], ["blue", [0, 0, 255]], ["yellow", [255, 247, 0]], ["green", [0, 255, 0]], ["black", [0, 0, 0]], ["brown", [140, 90, 40]], ["purple", [200, 0, 255]], ["gray", [120, 120, 120]], ["white", [254, 254, 254]], ["pink", [255, 180, 220]]])

exports.getDexEntry = function (name, channel) {
    P.getPokemonSpeciesByName(name)
        .then(function (pokemon) {
            //Get all the necessary pokemon values
            var pkmnGenus = pokemon.genera[2].genus; //Index 2 of the genera array is the english translation
            var pkmnId = pokemon.id;
            var pkmnName = proper.properCase(pokemon.name);
            var pkmnColor = pokemon.color.name;
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
                    channel.send(makeEmbed(pkmnName, pkmnId, pkmnGenus, pkmnImage, pkmnTypes, pkmnHeight, pkmnWeight, pkmnAbilities, pkmnHiddenAbility, pkmnColor));
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
                            var pkmnColor = pokemon.color.name;
                            //Now that we have all the data, send it off!
                            channel.send(makeEmbed(pkmnName, pkmnId, pkmnGenus, pkmnImage, pkmnTypes, pkmnHeight, pkmnWeight, pkmnAbilities, pkmnHiddenAbility, pkmnColor));
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
                            channel.send("Stats for **" + proper.properCase(pokemon.species.name) + "**:\n```HP \n" + drawStatBar(pokemon.stats[5].base_stat) +
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

exports.getHeight = function (name, channel) {
    P.getPokemonByName(name)
        .then(function (pokemon) {
            var height = pokemon.height / 10;   //Height in metres
            channel.send(twoLineEmbed(proper.properCase(pokemon.name), height + " metres\n" + m2feet(height), pokemon.sprites.front_default));
        })
        .catch(function () {
            //Check if just a pokemon name and not form was entered
            P.getPokemonSpeciesByName(name)
                .then(function (maybePokemon) {
                    P.getPokemonByName(maybePokemon.varieties[0].pokemon.name)
                        .then(function (pokemon) {
                            var height = pokemon.height / 10;   //Height in metres
                            channel.send(twoLineEmbed(proper.properCase(pokemon.species.name), height + " metres\n" + m2feet(height), pokemon.sprites.front_default));
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

exports.getWeight = function (name, channel) {
    P.getPokemonByName(name)
        .then(function (pokemon) {
            var weight = pokemon.weight / 10;   //Weight in kilograms
            channel.send(twoLineEmbed(proper.properCase(pokemon.name), weight + " kg\n" + kg2lbs(weight) + "lbs", pokemon.sprites.front_default));
        })
        .catch(function () {
            //Check if just a pokemon name and not form was entered
            P.getPokemonSpeciesByName(name)
                .then(function (maybePokemon) {
                    P.getPokemonByName(maybePokemon.varieties[0].pokemon.name)
                        .then(function (pokemon) {
                            var weight = pokemon.weight / 10;   //Weight in kilograms
                            channel.send(twoLineEmbed(proper.properCase(pokemon.species.name), weight + " kg\n" + kg2lbs(weight) + " lbs", pokemon.sprites.front_default));
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

exports.getType = function (name, channel) {
    P.getPokemonByName(name)
        .then(function (pokemon) {
            var pkmnTypes = [];
            for (var i in pokemon.types) {
                pkmnTypes[i] = proper.properCase(pokemon.types[i].type.name);   //Types is an array of 1-2 items entered in reverse order
            }
            pkmnTypes = pkmnTypes.reverse().join("/");
            channel.send(twoLineEmbed(proper.properCase(pokemon.name), pkmnTypes, pokemon.sprites.front_default));
        })
        .catch(function () {
            //Check if just a pokemon name and not form was entered
            P.getPokemonSpeciesByName(name)
                .then(function (maybePokemon) {
                    P.getPokemonByName(maybePokemon.varieties[0].pokemon.name)
                        .then(function (pokemon) {
                            var pkmnTypes = [];
                            for (var i in pokemon.types) {
                                pkmnTypes[i] = proper.properCase(pokemon.types[i].type.name);   //Types is an array of 1-2 items entered in reverse order
                            }
                            pkmnTypes = pkmnTypes.reverse().join("/");
                            channel.send(twoLineEmbed(proper.properCase(pokemon.species.name), pkmnTypes, pokemon.sprites.front_default));
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

exports.getEffectiveness = function (name, channel) {
    P.getPokemonByName(name)
        .then(function (pokemon) {
            var typeEffectiveness = new Map([["normal", 1], ["fire", 1], ["water", 1], ["grass", 1], ["electric", 1], ["ice", 1], ["fighting", 1], ["poison", 1],
            ["ground", 1], ["flying", 1], ["psychic", 1], ["bug", 1], ["rock", 1], ["ghost", 1], ["dark", 1], ["dragon", 1], ["steel", 1], ["fairy", 1]]);
            //Figure out how many types the pokemon has first
            switch (true) {
                case (pokemon.types.length == 1):    //Pokemon only has one type
                    P.getTypeByName(pokemon.types[0].type.name)
                        .then(function (type) {
                            typeEffectiveness = multiplyEffectiveness(typeEffectiveness, type.damage_relations.no_damage_from, type.damage_relations.half_damage_from, type.damage_relations.double_damage_from);
                            channel.send("Type effectiveness against **" + proper.properCase(pokemon.name) + "**\n" + listEffectiveness(typeEffectiveness));
                        })
                        .catch(function (error) {
                            channel.send(DEFAULT_ERROR, error);
                        })
                    break;
                case (pokemon.types.length == 2):    //Pokemon has two different types
                    P.getTypeByName(pokemon.types[0].type.name)
                        .then(function (type1) {
                            typeEffectiveness = multiplyEffectiveness(typeEffectiveness, type1.damage_relations.no_damage_from, type1.damage_relations.half_damage_from, type1.damage_relations.double_damage_from);
                            P.getTypeByName(pokemon.types[1].type.name)
                                .then(function (type2) {
                                    typeEffectiveness = multiplyEffectiveness(typeEffectiveness, type2.damage_relations.no_damage_from, type2.damage_relations.half_damage_from, type2.damage_relations.double_damage_from);
                                    channel.send("Type effectiveness against **" + proper.properCase(pokemon.name) + "**\n" + listEffectiveness(typeEffectiveness));
                                })
                                .catch(function (error) {
                                    channel.send(DEFAULT_ERROR, error);
                                })
                        })
                        .catch(function (error) {
                            channel.send(DEFAULT_ERROR, error);
                        })
                    break;
                default:                            //This line should theoretically never run but just in case
                    channel.send(DEFAULT_ERROR);
                    break;
            }
        })
        .catch(function () {
            //Check if just a pokemon name and not form was entered
            P.getPokemonSpeciesByName(name)
                .then(function (maybePokemon) {
                    P.getPokemonByName(maybePokemon.varieties[0].pokemon.name)
                        .then(function (pokemon) {
                            var typeEffectiveness = new Map([["normal", 1], ["fire", 1], ["water", 1], ["grass", 1], ["electric", 1], ["ice", 1], ["fighting", 1],
                            ["poison", 1], ["ground", 1], ["flying", 1], ["psychic", 1], ["bug", 1], ["rock", 1], ["ghost", 1], ["dark", 1], ["dragon", 1],
                            ["steel", 1], ["fairy", 1]]);
                            //Figure out how many types the pokemon has first
                            switch (true) {
                                case (pokemon.types.length == 1):    //Pokemon only has one type
                                    P.getTypeByName(pokemon.types[0].type.name)
                                        .then(function (type) {
                                            typeEffectiveness = multiplyEffectiveness(typeEffectiveness, type.damage_relations.no_damage_from, type.damage_relations.half_damage_from, type.damage_relations.double_damage_from);
                                            channel.send("Type effectiveness against **" + proper.properCase(pokemon.species.name) + "**\n" + listEffectiveness(typeEffectiveness));
                                        })
                                        .catch(function (error) {
                                            channel.send(DEFAULT_ERROR, error);
                                        })
                                    break;
                                case (pokemon.types.length == 2):    //Pokemon has two different types
                                    P.getTypeByName(pokemon.types[0].type.name)
                                        .then(function (type1) {
                                            typeEffectiveness = multiplyEffectiveness(typeEffectiveness, type1.damage_relations.no_damage_from, type1.damage_relations.half_damage_from, type1.damage_relations.double_damage_from);
                                            P.getTypeByName(pokemon.types[1].type.name)
                                                .then(function (type2) {
                                                    typeEffectiveness = multiplyEffectiveness(typeEffectiveness, type2.damage_relations.no_damage_from, type2.damage_relations.half_damage_from, type2.damage_relations.double_damage_from);
                                                    channel.send("Type effectiveness against **" + proper.properCase(pokemon.species.name) + "**\n" + listEffectiveness(typeEffectiveness));
                                                })
                                                .catch(function (error) {
                                                    channel.send(DEFAULT_ERROR, error);
                                                })
                                        })
                                        .catch(function (error) {
                                            channel.send(DEFAULT_ERROR, error);
                                        })
                                    break;
                                default:                            //This line should theoretically never run but just in case
                                    channel.send(DEFAULT_ERROR);
                                    break;
                            }
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

exports.getEggGroup = function (name, channel) {
    P.getPokemonSpeciesByName(name)
        .then(function (pokemon) {
            var returnValue = [];
            for (var i in pokemon.egg_groups) {
                returnValue[i] = proper.properCase(pokemon.egg_groups[i].name);
            }
            channel.send("**" + proper.properCase(pokemon.name) + "** is in the `" + returnValue[0] + (returnValue.length == 2 ? "` and `" + returnValue[1] + "` egg groups" : "` egg group"));
        })
        .catch(function (error) {
            channel.send(DONT_ENTER_FORM_ERROR, error);
        })
}

function makeEmbed(pkmnName, pkmnId, pkmnGenus, pkmnImage, pkmnTypes, pkmnHeight, pkmnWeight, pkmnAbilities, pkmnHiddenAbility, pkmnColor) {
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
        )
        .setColor(COLOR_MAP.get(pkmnColor));
}

function twoLineEmbed(topLine, bottomLine, image) {
    return new Discord.MessageEmbed()
        .setTitle(bottomLine)
        .setAuthor(topLine)
        .setThumbnail(image);
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

function m2feet(height) {
    var inches = Math.round(height * 39.37);
    var feet = Math.floor(inches / 12);
    return feet + "'" + (inches % 12 < 10 ? "0" + inches % 12 : inches % 12) + '"';
}

function kg2lbs(weight) {
    return (weight * 2.20462).toFixed(1);
}

/*Pre:  typeEffectiveness is a map of [pokemon type, damage multiplier]
*       noDamage, halfDamage, and doubleDamage are objects with the name of the type */
function multiplyEffectiveness(typeEffectiveness, noDamage, halfDamage, doubleDamage) {
    //No damage
    for (var i in noDamage) {
        typeEffectiveness.set(noDamage[i].name, typeEffectiveness.get(noDamage[i].name) * 0);
    }
    //Half damage
    for (var i in halfDamage) {
        typeEffectiveness.set(halfDamage[i].name, typeEffectiveness.get(halfDamage[i].name) * 0.5);
    }
    //Double damage
    for (var i in doubleDamage) {
        typeEffectiveness.set(doubleDamage[i].name, typeEffectiveness.get(doubleDamage[i].name) * 2);
    }
    return typeEffectiveness;
}

function listEffectiveness(typeEffectiveness) {
    var returnValue = "```";
    for (var [type, effectiveness] of typeEffectiveness.entries()) {
        var type2insert = proper.properCase(type);
        for (var i = 0; type2insert.length < 9; i++) {
            if (type2insert.length != 9) {
                type2insert += " ";
            }
        }
        returnValue += type2insert + " \u00D7 " + (effectiveness == 0.5 ? "\u00BD" : effectiveness == 0.25 ? "\u00BC" : effectiveness) + "\n";
    }
    return returnValue + "```"
}