/*
Copyright (c) 2014, salesforce.com, inc. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
Neither the name of salesforce.com, inc. nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
"use strict"

var fs  = require('fs');
var util = require('util');
var path = require('path');
var handlebars = require('handlebars');
var mkdirp = require('mkdirp');

var SPACING_SIZE_LABELS = {
  'XX_SMALL': 'xss',
  'X_SMALL' : 'xs',
  'SMALL'   : 's',
  'MEDIUM'  : 'm',
  'XX_LARGE': 'xx',
  'X_LARGE' : 'x',
  'LARGE'   : 'l',
  'NONE'    : 'n'
};

var SPACING_FORMAT_LABELS = {
  'v' : function(type, value) { return util.format('%s-top: %s; %s-bottom: %s;', type, value, type, value); },
  'h' : function(type, value) { return util.format('%s-left: %s; %s-right: %s;', type, value, type, value); },
  't' : function(type, value) { return util.format('%s-top: %s;', type, value); },
  'b' : function(type, value) { return util.format('%s-bottom: %s;', type, value); },
  'l' : function(type, value) { return util.format('%s-left: %s;', type, value); },
  'r' : function(type, value) { return util.format('%s-right: %s;', type, value); },
  'a' : function(type, value) { return util.format('%s: %s;', type, value); },
  'n' : function(type, value) { return util.format('%s: %s;', type, 0); }
};

/**
 * Return an array of properties that match specfied categories
 *
 * @param {object} json
 * @param {array} categories
 * @return {array}
 */
function getObjectsByCategory(json, categories) {
  return json.theme.properties.filter(function (property) {
    return categories.indexOf(property.category) !== -1;
  });
}

module.exports = function(src, dest) {
  // Get the theme
  var json = JSON.parse(fs.readFileSync(src).toString());
  // Return all the spacing properties that arent borders
  var spacingProperties = getObjectsByCategory(json, ['spacing']).filter(function(property) {
    return !property.name.toLowerCase().match(/(border)/g);
  });
  // Add no spacing
  spacingProperties.push({
    name: 'SPACING_NONE',
    value: 0
  });
  // Save the selectors for use in the template
  var selectors = [];
  // Create selectors for all combinations
  ['padding', 'margin'].forEach(function(spacingPrefix) {
    ['a', 'v', 'h', 'l', 'r', 't', 'b'].forEach(function(positionPrefix) {
      spacingProperties.forEach(function(property) {
	var sizingLabel = SPACING_SIZE_LABELS[property.name.replace('SPACING_', '')];
	selectors.push({
	  selector: spacingPrefix.substr(0, 1) + positionPrefix + sizingLabel,
	  declaration: SPACING_FORMAT_LABELS[positionPrefix](spacingPrefix, property.value)
	});
      });
    });
  });
  // Get the template
  var templateFile = path.resolve(__dirname, 'template.hbs');
  var template = handlebars.compile(fs.readFileSync(templateFile).toString());
  // Execute the template
  var content = template({
    selectors: selectors
  });
  // Make sure the destination directory exists
  mkdirp.sync(path.dirname(dest));
  // Write the file
  fs.writeFileSync(dest, content);
};
