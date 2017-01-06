import * as map from './map';

var handlebars  = require('handlebars');

handlebars.registerHelper('link', function(feature, string){

    let text = feature.properties.name;
    let url = map.getPath(feature, string);

    return new handlebars.SafeString(
        "<a href='" + url + "'>" + text + "</a>"
    );
});

module.exports = handlebars;