'use strict';

var logger = require('winston'),
	util = require('util');

/**
 * iv command
 * @module command/iv
 */
module.exports = {

    /** Command name */
    name: '/iv',

    /** Command regex pattern */
    pattern: /\/iv[ ]?([^ ]*)[ ]?([^ ]*)/i,

    /** Command's description to be listed in /help */
    description: '/iv',

    /** Is the command listed in Telegram's command list? */
    list: true,

    /**
     * Callback to execute when a user executes the command.
     * @param {Object} msg - The Telegram message object.
     * @param {Array}  match - The regex match result.
     * @param {Object} user - The user's stored Mongoose model.
     * @param {Boolean} created - Was the user created as a result of the command call?
     */
    callback: function(msg, match, user, created, listener) {
    	logger.info("IV: " + util.inspect(match));
		if(match[1] == '')
		{
			return "Please use /iv name <your trainer name> or /iv reset, or /iv stop";
		}
		if(match[1] == 'name')
		{
			if(match[1] == '')
				return "Enter your name behind the /iv name";
			user.ivname = match[2];
			user.ivwatch = [];
			user.save();
			return "Now watching for IVs for your pokemon";
		}
		if(match[1] == 'reset')
		{
			user.ivwatch = [];
			user.save();
			return "Resetted pokemon";
		
		}
		if(match[1] == 'stop')
		{
			user.ivname = '';
			user.save();
			return "Stopped watching for IV";
		}

    }

};
