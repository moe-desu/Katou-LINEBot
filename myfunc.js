var request = require('sync-request');
const MongoClient = require('mongodb').MongoClient;

// var db;

// var tekaTeki = function(type,id){
//   MongoClient.connect('mongodb://rehre:akmal2340@ds053788.mlab.com:53788/katou',function(err,database){
//     if(err){
//       console.log(err);
//     }else{
//       db = database;
//       //check if its user or group
//       if(type === 'user'){
//         //check if user already inserted to userId collection
//
//       }else if(type === 'group'){
//         //check if user already inserted to userId collection
//
//       }
//
//       db.collection('tekateki').find().toArray(function(err, results) {
//         console.log(results);
//       });
//     }
//   });
// }

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
  if(type === 'user'){
    userType = 'userId';
  }else if(type === 'group'){
    userType = 'groupId';
  }
  return MongoClient.connect('mongodb://rehre:akmal2340@ds059634.mlab.com:59634/katou').then(function(db) {
    var collection = db.collection(userType);

    return collection.find({
      ((userType === 'user') ? 'userId' : 'groupId'): id
    }).toArray().then(function(hasil) {
      if (hasil == false) {
        return collection.insert({
          ((userType === 'user') ? 'userId' : 'groupId'):id,
          "game":"",
          "gameid":""
        }).then(function(hasilInsert){
          return hasilInsert.ops;
        });
      } else {
        return hasil;
      }
    });
  });
}

// checkId(type, id).then(function(items) {
//   data = items;
//   console.log(data);
// }, function(err) {
//   console.error('The promise was rejected', err, err.stack);
// });

exports.checkId = checkId;
exports.cariLokasi = cariLokasi;
exports.ramal = ramal;
exports.wiki = wiki;
