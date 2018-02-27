'use strict';

var config   = require('config.json')('./config.json'),
	util = require('util'),
	raids = require('../raids'),
	pokedex = require('../pokedex2'),
    logger = require('winston');



var defaultKeyboard = [
				[ { 'text' : '/raid list' }, { 'text' : '/raid add' } ],
   				[ { 'text' : '/raid remove' }, { 'text' : '/raid ignore' } ]
];

/**
 * Start command
 * @module command/start
 */
module.exports = {

    /** Command name */
    name: '/raid',

    /** Command regex pattern */
    pattern: /\/raid[ ]?([^ ]*)[ ]?([^ ]*)[ ]?([^ ]*)/i,

    /** Command's description to be listed in /help */
    description: '/raid - Allows you to watch for raids',

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
   		if(match[1] == '')
   		{
   		
   			return { 'msg' : "What would you like to do?", "keyboard" : defaultKeyboard };
   		}
   		if(match[1] == 'list')
   		{
   			var msg = '';
			for(var i = 0; i < user.raidwatchlist.length; i++)
			{
				var txt = user.raidwatchlist[i].positive ? 'Showing ' : 'Ignoring ';

				if(user.raidwatchlist[i].type == 'level')
					txt += 'all level ' + user.raidwatchlist[i].level + ' raids';
				else if(user.raidwatchlist[i].type == 'pokemon')
					txt += 'all ' + pokedex.findById(user.raidwatchlist[i].id).name + ' raids';

				msg += "\n" + txt;
			}
   			return { 'msg' : "your raid filters: " + msg, "keyboard" : defaultKeyboard };
   		}
   		else if (match[1] == 'add' || match[1] == 'ignore')
   		{
   			if(match[2] == '')
   			{
	   			var keyboard = [];

	   			for(var i = 1; i <= 5; i++)
	   				keyboard.push( [ { 'text' : '/raid ' + match[1] + ' level ' + i } ] );
	   			for(var i = 0; i < raids.raids.length; i++)
	   			{
	   				keyboard.push( [ { 'text' : '/raid ' + match[1] + ' poke ' + pokedex.findById(raids.raids[i].pokemon_id).name } ] );
				}

			    for(var i = 0; i < keyboard.length-1; i++)
	    	    {
	    	        keyboard[i].push(keyboard[i+1][0]);
			        keyboard.splice(i+1,1);
			    }
	   			return { 'msg' : "What would you like to "+match[1]+"?", "keyboard" : keyboard };
			}
			
			if(match[2] == 'level')
			{
				var filter = 
				{
					'type' : 'level',
					'level' : match[3],
					'positive' : match[1] == 'add',
				};
				user.addRaidFilter(filter);
				return { 'msg' : "Raid filter added", "keyboard" : defaultKeyboard };
			}
			else if(match[2] == 'poke' || match[2] == 'pokemon')
			{
				var pokies = pokedex.find(match[3]);
				if(pokies.length != 1)
					return { 'msg' : 'Error adding raid filter', 'keyboard' : defaultKeyboard };
				var filter = 
				{
					'type' : 'pokemon',
					'id' : pokies[0],
					'positive' : match[1] == 'add'
				};
				user.addRaidFilter(filter);
				return { 'msg' : "Raid filter added", "keyboard" : defaultKeyboard };
			}
   		}
   		else if(match[1] == 'remove')
		{
			if(match[2] == '')
			{
				var keyboard = [];
				for(var i = 0; i < user.raidwatchlist.length; i++)
				{
					var txt = user.raidwatchlist[i].positive ? 'Showing ' : 'Ignoring ';
					
					if(user.raidwatchlist[i].type == 'level')
						txt += 'all level ' + user.raidwatchlist[i].level + ' raids';
					else if(user.raidwatchlist[i].type == 'pokemon')
						txt += 'all ' + pokedex.findById(user.raidwatchlist[i].id).name + ' raids';
				
					keyboard.push([{ 'text' : '/raid remove ' + i + ' '+ txt }]);
				}
	   			return { 'msg' : "Which filter would you like to remove?", "keyboard" : keyboard };
			}
			else
			{
				user.raidwatchlist.splice(match[2],1);
				user.save();
				return { 'msg' : 'Removed...', defaultKeyboard };
			}
			
		}
   		
   		
   		
    	logger.info(util.inspect(match));
    
        return 'Sorry, this feature is not working yet. Please bother Johan about it';
    }

};
