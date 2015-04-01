
var express = require('express');
var app = express();
var port = 3000;

var quiz = require('./lib/quiz');
var imagesApi = require('./lib/images-api')

app.use(quiz);
app.use(imagesApi);

app.get('/', function(req, res) {
  res.redirect('/quiz');
});

app.use(express.static(__dirname + '/public'));

app.listen(port);
console.log('listening on port ' + port);
