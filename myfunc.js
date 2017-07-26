var request = require('sync-request');
const MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

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
  var ramalan = [
    "Berhati-hatilah hari ini adalah hari tersial mu",
    "Hari ini mungkin agak menyusahkan bagimu jadi berhati-hatilah",
    "Hari ini mungkin kamu akan menemukan jodohmu",
    "Hari ini mungkin akan sangat menguntungkan bagi keuanganmu",
    "Tiada hari yang lebih baik dari hari ini bagimu"
  ];
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
    var collection = db.collection(type);

    if (type === "userId") {
      return collection.update({
        "userId": id
      }, {
        "userId": id,
        "game": "tekaTeki",
        "gameid": idtekateki
      });
    } else if (type === "groupId") {
      return collection.update({
        "groupId": id
      }, {
        "groupId": id,
        "game": "tekaTeki",
        "gameid": idtekateki
      });
    }
  });
}

var checkTekaTeki = function(idTekateki) {
  return MongoClient.connect('mongodb://rehre:akmal2340@ds059634.mlab.com:59634/katou').then(function(db) {
    var collection = db.collection('tekateki');

    return collection.find(ObjectId(idTekateki)).toArray();
  });
}

var hapusIdGame = function(type, id) {
  return MongoClient.connect('mongodb://rehre:akmal2340@ds059634.mlab.com:59634/katou').then(function(db) {
    var collection = db.collection(type);

    if (type === 'userId') {
      return collection.update({
        "userId": id
      }, {
        "userId": id,
        "game": "",
        "gameid": ""
      });
    } else if (type === 'groupId') {
      return collection.update({
        "groupId": id
      }, {
        "groupId": id,
        "game": "",
        "gameid": ""
      });
    }
  });
}

var stalkIg = function(keyword) {
  var jsonIg;
  var url = "https://www.instagram.com/" + keyword + "/?__a=1"
  var response = request(
    'GET',
    url
  );
  if (response.statusCode == 200) {
    var json = JSON.parse(response.getBody('utf8'));
    var user = json.user;
    var media = json.user.media;
    var nodes = media.nodes;

    var count = media.count;
    var username = user.username;
    var followers = user.followed_by;
    var follows = user.follows;
    var followers = followers.count;
    var following = follows.count;
    var profile_pic = user.profile_pic_url;
    var is_private = user.is_private;
    var profile_url = "https://www.instagram.com/" + username;

    var deskripsi_profil = "Follow : " + following + "/nFollowers : " + followers;

    if (count != '0' && is_private != 'true') {
      for (i in nodes) {
        var items = nodes[0];
        var src = items.thumbnail_src;
        var code = "https://www.instagram.com/p/" + items.code;
        var commentCount = items.comments.count;
        var likeCount = items.likes.count;
        var deskripsi_post = "Likes : " + likeCount + "\nComments : " + commentCount;
      }

      jsonIg = {
        type: "template",
        altText: "Stalk",
        template: {
          type: "carousel",
          columns: [{
              thumbnailImageUrl: profile_pic,
              title: username,
              text: deskripsi_profil,
              actions: [{
                  type: "uri",
                  label: "Ke profil",
                  data: profile_url
                },
                {
                  type: "uri",
                  label: "Ke postingan",
                  data: code
                },
                {
                  type: "uri",
                  label: "Download gambar post",
                  uri: src
                }
              ]
            },
            {
              thumbnailImageUrl: src,
              title: "Postingan Terakhir",
              text: deskripsi_post,
              actions: [{
                  type: "uri",
                  label: "Ke profil",
                  data: profile_url
                },
                {
                  type: "uri",
                  label: "Ke postingan",
                  data: code
                },
                {
                  type: "uri",
                  label: "Download gambar post",
                  uri: src
                }
              ]
            }
          ]
        }
      };
    } else {
      jsonIg = {
        "type": "template",
        "altText": "Stalk",
        "template": {
          "type": "carousel",
          "columns": [{
            "thumbnailImageUrl": profile_pic,
            "title": "this is menu",
            "text": "description",
            "actions": [{
                "type": "postback",
                "label": "Buy",
                "data": "action=buy&itemid=111"
              },
              {
                "type": "postback",
                "label": "Add to cart",
                "data": "action=add&itemid=111"
              },
              {
                "type": "uri",
                "label": "View detail",
                "uri": "http://example.com/page/111"
              }
            ]
          }]
        }
      };
    }
    return jsonIg;
  }
}

// var data = stalkIg('lalala');
//
//
// console.log(data.template.columns[0].actions);

exports.stalkIg = stalkIg;
exports.tekaTeki = tekaTeki;
exports.addidTekaTeki = addidTekaTeki;
exports.checkTekaTeki = checkTekaTeki;
exports.hapusIdGame = hapusIdGame;
exports.checkId = checkId;
exports.cariLokasi = cariLokasi;
exports.ramal = ramal;
exports.wiki = wiki;
