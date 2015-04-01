'use strict';

var express = require('express');
var app = module.exports = express();
var fs = require('fs');
var path = require('path');
var imgPath = path.resolve(__dirname + '/../../public/img/');

app.get('/images-api', function(req, res) {
  scanFolder(imgPath, function(err, data) {
    res.send(data);
  });
});

function scanFolder(dir, callback) {
  var results = [];

  fs.readdir(dir, function(err, list) {
    var pending = list.length;
    if (!pending) return callback(null, results);

    list.forEach(function(file) {
      console.log('for file: ' + file);
      file = path.resolve(dir, file);
      console.log('make newImgPath: ' + file);

      fs.stat(file, function(err, stats) {
        if (stats && stats.isDirectory()) {
          scanFolder(file, function(err, res) {
          res.forEach(function(item) {
            var lol = path.basename(item, '.jpg', '.jpeg', '.png', '.bmp');
            var lol = lol.replace(/_.+/, '');
            var temp = {
              text: lol,
              href: '/img/' + path.basename(file) + '/' + path.basename(item)
            }
            results.push(temp);
          });
          // results = results.concat(res);
          if (!--pending) callback(null, results);
          });
        } else {
          // var wtf = {
          //   text: path.basename(file, '.jpg', '.jpeg', '.png', '.bmp'),
          //   href: '/img/' + path.basename(file)
          // }
          results.push(file);
          if (!--pending) callback(null, results);
        }
      });
    });
  });
}

function getAll(err, data) {
  var shuffled = data;
  var json = [];
  for (item in shuffled) {
    json.push( {
      text: path.basename(shuffled[item], '.jpg', 'jpeg', '.png', '.bmp'),
      href: 'img/' + shuffled[item]
    });
  }
  return json;
}
