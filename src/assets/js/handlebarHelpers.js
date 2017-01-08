import * as map from './map';

var handlebars  = require('handlebars');

handlebars.registerHelper('link', function(feature, string){
    let text = feature.properties.name;
    let url = map.getPath(feature, string);

    return new handlebars.SafeString(
        "<a href='" + url + "'>" + text + "</a>"
    );
});

handlebars.registerHelper('sortArr', function(arr, key){

    return arr.sort(function(a, b) {
        let x = a.properties[key],
            y = b.properties[key];

        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
});

handlebars.registerHelper('hasValue', function(key, value){
  if(key == value)
    return true
});

handlebars.registerHelper('emptyBemerkung', function(key){
  if(key === " " || key === "")
    return false
});


module.exports = handlebars;
