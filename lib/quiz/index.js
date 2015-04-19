var express = require('express');
var app = module.exports = express();
var images = require('../images-api');

app.set('views', __dirname);
app.set('view engine', 'jade');


app.get('/quiz', function(req, res) {
  res.render('quiz');
});
