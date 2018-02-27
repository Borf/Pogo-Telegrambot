'use strict';

var pokedex = require('../pokedex2'),
    logger = require('winston'),
    util = require('util'),
	emoji = require('node-emoji'),
    _ = require('lodash');

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

/** Pokedex command
 * @module command/pokedex
 */
module.exports = {

    /** Command name */
    name: '/pokedex',

    /** Command regex pattern */
    pattern: /\/pokedex ?([^ ]*)/i,

    /** Command's description to be listed in /help */
    description: '/pokedex [name]- Searches for a pokemon',

    /** Is the command listed in Telegram's command list? */
    list: true,

    /**
     * Callback to execute when a user executes the command.
     * @param {Object} msg - The Telegram message object.
     * @param {Array}  match - The regex match result.
     * @param {Object} user - The user's stored Mongoose model.
     * @param {Boolean} created - Was the user created as a result of the command call?
     */
    callback: function(msg, match, user, created) {
	var search = "";
	if(match[1])
	    search = match[1];
	    
	    if(search == 'mei')
	    {
	    	return { "msg" : "Name: Mei\nID: " + emoji.get('heart') + "\nType: Fairy, Tiger\nRarity: Ultra Rare", 'img' : __dirname + "/../../db/img/flower.jpg" };
	    }
	    
	    if(pokedex.searchByName(search).length == 1)
	    {
	    	var pokemon = pokedex.searchByName(search)[0];
	    	return { "msg" : "Name: " + pokemon.name + "\nID: " + pokemon.id + "\nType: " + _.join(_.map(pokemon.types, e => e.type), ", ") + "\nRarity: " + pokemon.rarity, 'img' : __dirname + "/../../db/img/" + pad(pokemon.id, 3) + ".png" };
	    }
	    

        var names = [];
		var i = 0;
        _.forEach(pokedex.pokedex, function(pokemon) {
		    if(search != "")
				if(pokemon.name.toLowerCase().indexOf(search.toLowerCase()) == -1)
		    		return;

		    var index = Math.floor(i/100);

		    while(names.length <= index)
				names.push([]);
            names[index].push(pokemon.id + ') ' + pokemon.name);
	    	i++;
        });

		for(var i in names)
		    names[i] = names[i].join("\n");
	
		return names;
    }

};
