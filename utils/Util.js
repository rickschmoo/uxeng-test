var fs = require('fs');
var path = require('path');

/*
 *   @type: the type of icon to generate (e.g. standard, custom, doctype, etc.)
 *   @dir: location of the destination directory that the css files will be placed
 *   @iconsLoc: location of the icon folder RELATIVE to the ouput (.css) files    
 */
var toCSS = function(type, dir, iconsLoc) {
  iconsLocation = iconsLoc;
  
};

var generateIcons = function(file) {
  var icons = [];
  var content_json = JSON.parse(fs.readFileSync(file));
  content_json.theme.properties.forEach(function(icon) {
    icons.push({
      "fileName": icon.name
    });
  });
  return icons;
};

var generateIconFonts = function(file) {
  var iconFonts = [];
  var iconFontJSON = JSON.parse(fs.readFileSync(file).toString());
  iconFontJSON.glyphs.forEach(function(iconFont) {
    iconFonts.push({
      "fileName": iconFont.css.length > iconFont.search.length ? iconFont.search : iconFont.css
    });
  });
  return iconFonts;
};

module.exports = {
  generateIcons: generateIcons,
  generateIconFonts: generateIconFonts
};