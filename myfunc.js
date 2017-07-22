var request = require('sync-request');
const MongoClient = require('mongodb').MongoClient;

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

var ramal = function() {
  var ramalan = ['halo', 'hehe', 'lala'];
  var ramalanKocok = shuffle(ramalan);
  randomIndex = Math.floor(Math.random() * ramalanKocok.length);
  return ramalan[randomIndex];
}

var wiki = function(keyword) {
  var replaced = keyword.replace(/ /g, '+');
  var url = 'https://id.wikipedia.org/wiki/' + replaced
  var response = request(
    'GET',
    'https://id.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=' + replaced
  );
  if (response.statusCode == 200) {
    var json = JSON.parse(response.getBody('utf8'));
    var pages = json.query.pages;

    for (i in pages) {
      var teksWiki = pages[i].extract;

      if (teksWiki == '') {
        return 'Link dialihkan ke ' + url;
      } else if (teksWiki == null) {
        return 'tidak ditemukan hasil dengan keyword ' + keyword;
      } else if (teksWiki != null) {
        if (teksWiki.length > 1900) {
          teksWiki = teksWiki.substr(0, 1900) + '...';
        }
        return teksWiki + ' Read More: ' + url;
      }
    }
  }
}

var cariLokasi = function(keyword) {
  var replaced = keyword.replace(/ /g, '+');
  var key = 'AIzaSyDlrK6kokD3dDhSoWQKCz3oMAaJMCqaQqM';
  var response = request(
    'GET',
    'https://maps.googleapis.com/maps/api/geocode/json?address=' + replaced + '&key=' + key
  );
  if (response.statusCode == 200) {
    var json = JSON.parse(response.getBody('utf8'));
    var results = json.results;

    for (i in results) {
      var formatted_address = results[i].formatted_address;
      var geometry = results[i].geometry;
      var lat = geometry.location.lat;
      var lng = geometry.location.lng;

      if (formatted_address.length > 100) {
        formatted_address = formatted_address.substr(0, 90) + '...';
      }

      return {
        address: formatted_address,
        latitude: lat,
        longitude: lng
      };
    }
  }
}

var checkId = function(type, id) {
  var userType;
  if (type === 'user') {
    userType = 'userId';
  } else if (type === 'group') {
    userType = 'groupId';
  }
  return MongoClient.connect('mongodb://rehre:akmal2340@ds059634.mlab.com:59634/katou').then(function(db) {
    var collection = db.collection(userType);
    if (type === 'user') {
      return collection.find({
        "userId": id
      }).toArray().then(function(hasil) {
        if (hasil == false) {
          return collection.insert({
            "userId": id,
            "game": "",
            "gameid": "",
          }).then(function(hasilInsert) {
            return hasilInsert.ops;
          });
        } else {
          return hasil;
        }
      });
    } else if (type === 'group') {
      return collection.find({
        "groupId": id
      }).toArray().then(function(hasil) {
        if (hasil == false) {
          return collection.insert({
            "groupId": id,
            "game": "",
            "gameid": "",
          }).then(function(hasilInsert) {
            return hasilInsert.ops;
          });
        } else {
          return hasil;
        }
      });
    }
  });
}

var tekaTeki = function() {
  return MongoClient.connect('mongodb://rehre:akmal2340@ds059634.mlab.com:59634/katou').then(function(db) {
    var collection = db.collection('tekateki');

    return collection.aggregate([{
      $sample: {
        size: 1
      }
    }]).toArray();
  });
}

var addidTekaTeki = function(type, id, idtekateki) {
  return MongoClient.connect('mongodb://rehre:akmal2340@ds059634.mlab.com:59634/katou').then(function(db) {
    var collection = db.collection('userId');

    return collection.update({
      "userId": id
    }, {
      "userId": id,
      "game": "tekaTeki",
      "gameid": idtekateki
    });
  });
}

var hapusIdGame = function(type, id) {
  return MongoClient.connect('mongodb://rehre:akmal2340@ds059634.mlab.com:59634/katou').then(function(db) {
    var collection = db.collection('userId');

    return collection.update({
      "userId": id
    }, {
      "userId": id,
      "game": "",
      "gameid": ""
    });
  });
}

var data;
var data2;
checkId('user','123').then(function(hasil){
  tekaTeki().then(function(items) {
    data = items;
    console.log(items[0].tekateki);
    data2 = addidTekaTeki('user','123',items[0]._id).then(function(items){
      console.log(data2);
    }, function(err) {
      console.error('The promise was rejected', err, err.stack);
    });
  }, function(err) {
    console.error('The promise was rejected', err, err.stack);
  });
}, function(err) {
  console.error('The promise was rejected', err, err.stack);
});


exports.tekaTeki = tekaTeki;
exports.addidTekaTeki = addidTekaTeki;
exports.hapusIdGame = hapusIdGame;
exports.checkId = checkId;
exports.cariLokasi = cariLokasi;
exports.ramal = ramal;
exports.wiki = wiki;
