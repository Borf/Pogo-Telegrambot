'use strict';

/**
 * Pokedex module
 * @module pokedex
 */

var fs = require('fs'),
    _ = require('lodash'),
    logger = require('winston'),
    util = require('util'),
    pokedex = _.filter(_.map(JSON.parse(fs.readFileSync(__dirname + '/../db/pokemon.json')), function(el, id) { el.id = id; return el; }), e => e.id < 386);

exports.pokedex = pokedex;

exports.findById = function(id)
{
	return _.find(pokedex, pokemon => pokemon.id == id);
	return pokedex[id];
};

exports.findByName = function(name)
{
	return _.find(pokedex, pokemon => name && pokemon && pokemon.name && pokemon.name.toLowerCase() == name.toLowerCase());
};

exports.searchByName = function(name)
{
	if(!name || typeof(name) != 'string')
		return [];
	return _.filter(pokedex, pokemon => name && pokemon && pokemon.name && pokemon.name.toLowerCase().indexOf(name.toLowerCase()) >= 0);
}

exports.find = function(data)
{
    var args = data.split(/[\s,]/).filter(function(value) {
        return value !== '';
    });


	var ret = [];
	_.forEach(args, el =>
	{
		if(isNaN(Number(el)))
		{
			var searchResults = this.searchByName(el);
			if(searchResults.length == 1)
				ret.push(searchResults[0].id);
		}
		else
			ret.push(el);
	
	});

	return ret;
}
