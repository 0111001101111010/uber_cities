var fs = require('fs');
var _ = require('lodash');
var Geocodio = require('geocodio');

var config = {
    api_key: process.env.GEOCODIO
};

console.log(config);
var geocodio = new Geocodio(config);
var cities = [];
var decoded = [];

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
    geocode(cities);
  });
}

function geocode(cities) {
  // _.each(cities, function (city) {
  //   geocodio.geocode(city, function(err, res){
  //     if (err) {
  //       console.log(err.stack);
  //     }
  //     console.log(city);
  //     decoded.push({
  //       city: city,
  //       location: res.results[0].response.results[0].location
  //     });
  //
  //   });
  // });
  geocodio.geocode(cities, function(err, res){
    if (err) {
      console.log(err.stack);
    }
    _.each(res.results,function(city){
      console.log(city.query);
      if (typeof city.response !== undefined){
      decoded.push({
        city: city.query,
        location: res.results[0].response.results[0].location
      });
      }
      else {
        decoded.push({
          city: city.query,
          location: null
        });
      }
      console.log(decoded);
    });
  });
}
