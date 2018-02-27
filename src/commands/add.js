'use strict';

var pokedex = require('../pokedex2'),
    logger = require('winston'),
    util = require('util'),
    _ = require('lodash');

/**
 * Add command
 * @module command/add
 */
module.exports = {

    /** Command name */
    name: '/add',

    /** Command regex pattern */
    pattern: /\/add ?(.*)/i,

    /** Command's description to be listed in /help */
    description: '/add name [name]... - Adds Pokémon to the watchlist',

    /** Is the command listed in Telegram's command list? */
    list: function(user) {
        return user.active === true;
    },

    /**
     * Callback to execute when a user executes the command.
     * @param {Object} msg - The Telegram message object.
     * @param {Array}  match - The regex match result.
     * @param {Object} user - The user's stored Mongoose model.
     * @param {Boolean} created - Was the user created as a result of the command call?
     */
    callback: function(msg, match, user, created) {
		if(match[1] == "" || match[1].substr(0,4) == "page")
		{
			var page = 1;
		    var keyboard = [];
			_.forEach(pokedex.pokedex, function(pokemon, number) {
		        keyboard.push([ { "text" : "/add " + pokemon.name } ]);;
   	         });

			if(match[1].substr(0,4) == 'page' && match[1] != '')
				page = Number(match[1].substr(5));
			if(isNaN(page))
				page = 1;
				
			keyboard.splice(0, (page-1)*150);
			keyboard.splice(150);

	        keyboard.push([ { "text" : "/add page " + (page+1) } ]);;

		    for(var i = 0; i < keyboard.length-1; i++)
			{
				keyboard[i].push(keyboard[i+1][0]);
				keyboard.splice(i+1,1);
			}

		    return { "msg" : "Please add a pokemon name", "keyboard" : keyboard };
		}


		var toAddIds = pokedex.find(match[1]).filter(function(item) {
	    	return !isNaN(item);
		});

		if(_.find(toAddIds, function(item) { return user.watchlist.indexOf(item) === -1; }) === undefined && toAddIds.length == 1)
		    return "This pokemon is already on your list";
	
		toAddIds = toAddIds.filter(function(item) { return user.watchlist.indexOf(item) === -1; });
	

		if(toAddIds.length == 0)
		{
		    toAddIds = pokedex.searchByName(match[1])
		    if(_.find(toAddIds, function(item) { return user.watchlist.indexOf(item) === -1; }) === undefined && toAddIds.length == 1)
				return "This pokemon is already on your list";
		    var lastLength = toAddIds.length;
		    toAddIds = toAddIds.filter(function(item) { 
			if(isNaN(Number(item)))
			    item = pokedex.searchByName(item);
			return user.watchlist.indexOf(item) === -1; 
		    });
		    if(toAddIds.length == 0 && lastLength == 0)
				return "Pokemon " + match[1] + " not found";
		    if(toAddIds.length == 0 && lastLength != 0)
				return "Pokemon " + match[1] + " already on your list";

		    var keyboard = _.map(toAddIds, function(n) { return [ { "text" : "/add " + n } ] });

		    for(var i = 0; i < keyboard.length-1; i++)
			{
				keyboard[i].push(keyboard[i+1][0]);
		        keyboard.splice(i+1,1);
		    }

		    return { "msg" : "Did you mean:", "keyboard" : keyboard };
		}


		user.watchlist = user.watchlist.concat(toAddIds).sort(function(a, b) {
			return a - b;
		});
		user.save();
		return "Added " + toAddIds.length + " pokemon";
	}

};
