var fs = require('fs');
var Geocodio = require('geocodio');

var config = {
    api_key: process.env.geocodio
};

var geocodio = new Geocodio(config);
var cities = [];

var input = fs.createReadStream('ubercities.csv');
readLines(input, func);

function func(line) {
  cities.push(line);
}

function readLines(input, func) {
  var remaining = '';

  input.on('data', function(data) {
    remaining += data;
    var index = remaining.indexOf('\n');
    var last  = 0;
    while (index > -1) {
      var line = remaining.substring(last, index);
      last = index + 1;
      func(line);
      index = remaining.indexOf('\n', last);
    }

    remaining = remaining.substring(last);
  });

  input.on('end', function() {
    if (remaining.length > 0) {
      func(remaining);
    }
    //geocode(cities);
  });
}
