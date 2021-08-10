var exphbs = require('express-handlebars');
var path = require('path');

exports.renderfiles = function (expapp) {
	var expressApp = expapp;
	expressApp.engine('.hbs', exphbs({defaultLayout: 'layout', extname: '.hbs'}));
	expressApp.set('views', path.join(__dirname + '/../', 'views'));
	expressApp.set('view engine', '.hbs');
};
