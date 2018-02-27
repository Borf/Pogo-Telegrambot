'use strict';

/**
 * Raids module
 * @module raids
 */

var fs = require('fs'),
    _ = require('lodash'),
    logger = require('winston'),
    util = require('util'),
    raids = JSON.parse(fs.readFileSync(__dirname + '/../db/raids.json'));


exports.raids = raids;

