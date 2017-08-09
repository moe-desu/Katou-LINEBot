const request = require('sync-request');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const cheerio = require('cheerio');
const osu = require("osu")("d6e3cd4bc2c0b845e76c79fe58b0acedaec9381a");
const jsdom = require('jsdom');
const {
  JSDOM
} = jsdom;

// function shuffle(array) {
//   var currentIndex = array.length,
//     temporaryValue, randomIndex;
//
//   // While there remain elements to shuffle...
//   while (0 !== currentIndex) {
//
//     // Pick a remaining element...
//     randomIndex = Math.floor(Math.random() * currentIndex);
//
//     currentIndex -= 1;
//
//     // And swap it with the current element.
//     temporaryValue = array[currentIndex];
//
//     array[currentIndex] = array[randomIndex];
//     array[randomIndex] = temporaryValue;
//   }
//
//   return array;
// }

var ramal = function() {
  var ramalan = [
    "Berhati-hatilah hari ini adalah hari tersial mu",
    "Hari ini mungkin agak menyusahkan bagimu jadi berhati-hatilah",
    "Hari ini mungkin kamu akan menemukan jodohmu",
    "Hari ini mungkin akan sangat menguntungkan bagi keuanganmu",
    "Tiada hari yang lebih baik dari hari ini bagimu"
  ];
  randomIndex = Math.floor(Math.random() * ramalan.length);
  return ramalan[randomIndex];
}

var getResponse = function(userDisplayName) {
  var teksRespon = [
    "Iya, " + userDisplayName + " ?",
    "Ada apa " + userDisplayName + " ?",
    "Ada yang bisa dibantu " + userDisplayName + " ?"
  ];
  randomIndex = Math.floor(Math.random() * teksRespon.length);
  return teksRespon[randomIndex];
}

var salah = function() {
  var salah = [
    "Jawaban mu salah",
    "Salah ! Ayo coba lagi",
    "SALAH !",
    "Salah ! Ayo teruskan",
    "Salah ! xD"
  ];
  randomIndex = Math.floor(Math.random() * salah.length);
  return salah[randomIndex];
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
        return 'Tidak ditemukan hasil dengan keyword : ' + keyword;
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
    var status = json.status;
    var formatted_address;
    var geometry;
    var lat;
    var lng;
    if (status !== 'ZERO_RESULTS') {
      formatted_address = results[0].formatted_address;
      geometry = results[0].geometry;
      lat = geometry.location.lat;
      lng = geometry.location.lng;

      if (formatted_address.length > 100) {
        formatted_address = formatted_address.substr(0, 90) + '...';
      }

      return {
        address: formatted_address,
        latitude: lat,
        longitude: lng
      };
    } else {
      return {
        err: 'error',
        kata: 'Tidak menemukan lokasi : ' + keyword
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
  } else if (type === 'room') {
    userType = 'roomId';
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
            "session": ""
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
            "session": ""
          }).then(function(hasilInsert) {
            return hasilInsert.ops;
          });
        } else {
          return hasil;
        }
      });
    } else if (type === 'room') {
      return collection.find({
        "roomId": id
      }).toArray().then(function(hasil) {
        if (hasil == false) {
          return collection.insert({
            "roomId": id,
            "game": "",
            "gameid": "",
            "session": ""
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

var lanjutTekaTeki = function(keyword) {
  return MongoClient.connect('mongodb://rehre:akmal2340@ds059634.mlab.com:59634/katou').then(function(db) {
    var collection = db.collection('tekateki');

    return collection.aggregate([{
      $match: {
        _id: {
          $ne: ObjectId(keyword)
        }
      }
    }, {
      $sample: {
        size: 1
      },
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
        "gameid": idtekateki,
        "session": ""
      });
    } else if (type === "groupId") {
      return collection.update({
        "groupId": id
      }, {
        "groupId": id,
        "game": "tekaTeki",
        "gameid": idtekateki,
        "session": ""
      });
    } else if (type === "roomId") {
      return collection.update({
        "roomId": id
      }, {
        "roomId": id,
        "game": "tekaTeki",
        "gameid": idtekateki,
        "session": ""
      });
    }
  });
}

var addLanjutTekaTeki = function(type, id, idtekateki) {
  return MongoClient.connect('mongodb://rehre:akmal2340@ds059634.mlab.com:59634/katou').then(function(db) {
    var collection = db.collection(type);

    if (type === "userId") {
      return collection.update({
        "userId": id
      }, {
        "userId": id,
        "game": "tekaTeki",
        "gameid": idtekateki,
        "session": "Lanjut"
      });
    } else if (type === "groupId") {
      return collection.update({
        "groupId": id
      }, {
        "groupId": id,
        "game": "tekaTeki",
        "gameid": idtekateki,
        "session": "Lanjut"
      });
    } else if (type === "roomId") {
      return collection.update({
        "roomId": id
      }, {
        "roomId": id,
        "game": "tekaTeki",
        "gameid": idtekateki,
        "session": "Lanjut"
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
        "gameid": "",
        "session": ""
      });
    } else if (type === 'groupId') {
      return collection.update({
        "groupId": id
      }, {
        "groupId": id,
        "game": "",
        "gameid": "",
        "session": ""
      });
    } else if (type === 'roomId') {
      return collection.update({
        "roomId": id
      }, {
        "roomId": id,
        "game": "",
        "gameid": "",
        "session": ""
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
    if (json !== null) {
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

      var deskripsi_profil = "Following : " + following + "\nFollowers : " + followers;

      if (count != 0 && is_private != true) {
        for (i in nodes) {
          var items = nodes[0];
          var src = items.thumbnail_src;
          var code = "https://www.instagram.com/p/" + items.code;
          var commentCount = items.comments.count;
          var likeCount = items.likes.count;
          var deskripsi_post = "Likes : " + likeCount + "\nComments : " + commentCount;
        }

        jsonIg = {
          "type": "template",
          "altText": "Stalk",
          "template": {
            "type": "carousel",
            "columns": [{
                "thumbnailImageUrl": profile_pic,
                "title": username,
                "text": deskripsi_profil,
                "actions": [{
                    "type": "uri",
                    "label": "Ke Profil",
                    "uri": profile_url
                  },
                  {
                    "type": "uri",
                    "label": "Ke Post",
                    "uri": code
                  },
                  {
                    "type": "uri",
                    "label": "Download Gambar Post",
                    "uri": src
                  }
                ]
              },
              {
                "thumbnailImageUrl": src,
                "title": "Postingan Terakhir",
                "text": deskripsi_post,
                "actions": [{
                    "type": "uri",
                    "label": "Ke Profil",
                    "uri": profile_url
                  },
                  {
                    "type": "uri",
                    "label": "Ke Post",
                    "uri": code
                  },
                  {
                    "type": "uri",
                    "label": "Download Gambar Post",
                    "uri": src
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
              "title": username,
              "text": deskripsi_profil,
              "actions": [{
                "type": "uri",
                "label": "Ke Profil",
                "uri": profile_url
              }]
            }]
          }
        };
      }
      return jsonIg;
    }
  } else {
    return {
      err: 'error',
      kata: 'Gagal menemukan user instagram dengan id : ' + keyword
    };
  }
}

var ubahAlay = function(teks) {
  var teksKeyword = teks.toLowerCase();

  var abjadBener = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z"
  ];

  var abjadAlay = [
    "4",
    "6",
    "c",
    "D",
    "3",
    "F",
    "9",
    "H",
    "!",
    "j",
    "k",
    "1",
    "m",
    "11",
    "0",
    "p",
    "Q",
    "12",
    "s",
    "7",
    "v",
    "V",
    "w",
    "*",
    "y",
    "z"
  ];

  var hasilConvert;

  hasilConvert = teksKeyword
    .replace(abjadBener[0], abjadAlay[0])
    .replace(abjadBener[1], abjadAlay[1])
    .replace(abjadBener[2], abjadAlay[2])
    .replace(abjadBener[3], abjadAlay[3])
    .replace(abjadBener[4], abjadAlay[4])
    .replace(abjadBener[5], abjadAlay[5])
    .replace(abjadBener[6], abjadAlay[6])
    .replace(abjadBener[7], abjadAlay[7])
    .replace(abjadBener[8], abjadAlay[8])
    .replace(abjadBener[9], abjadAlay[9])
    .replace(abjadBener[10], abjadAlay[10])
    .replace(abjadBener[11], abjadAlay[11])
    .replace(abjadBener[12], abjadAlay[12])
    .replace(abjadBener[13], abjadAlay[13])
    .replace(abjadBener[14], abjadAlay[14])
    .replace(abjadBener[15], abjadAlay[15])
    .replace(abjadBener[16], abjadAlay[16])
    .replace(abjadBener[17], abjadAlay[17])
    .replace(abjadBener[18], abjadAlay[18])
    .replace(abjadBener[19], abjadAlay[19])
    .replace(abjadBener[20], abjadAlay[20])
    .replace(abjadBener[21], abjadAlay[21])
    .replace(abjadBener[22], abjadAlay[22])
    .replace(abjadBener[23], abjadAlay[23])
    .replace(abjadBener[24], abjadAlay[24])
    .replace(abjadBener[25], abjadAlay[25]);


  return hasilConvert;
}

var translateAlay = function(teks) {
  var teksKeyword = teks.toLowerCase();

  var abjadAlay = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z"
  ];

  var abjadBener = [
    "4",
    "6",
    "c",
    "D",
    "3",
    "F",
    "9",
    "H",
    "!",
    "j",
    "k",
    "1",
    "m",
    "11",
    "0",
    "p",
    "Q",
    "12",
    "s",
    "7",
    "v",
    "V",
    "w",
    "*",
    "y",
    "z"
  ];

  var hasilConvert;

  hasilConvert = teksKeyword
    .replace(abjadBener[0], abjadAlay[0])
    .replace(abjadBener[1], abjadAlay[1])
    .replace(abjadBener[2], abjadAlay[2])
    .replace(abjadBener[3], abjadAlay[3])
    .replace(abjadBener[4], abjadAlay[4])
    .replace(abjadBener[5], abjadAlay[5])
    .replace(abjadBener[6], abjadAlay[6])
    .replace(abjadBener[7], abjadAlay[7])
    .replace(abjadBener[8], abjadAlay[8])
    .replace(abjadBener[9], abjadAlay[9])
    .replace(abjadBener[10], abjadAlay[10])
    .replace(abjadBener[11], abjadAlay[11])
    .replace(abjadBener[12], abjadAlay[12])
    .replace(abjadBener[13], abjadAlay[13])
    .replace(abjadBener[14], abjadAlay[14])
    .replace(abjadBener[15], abjadAlay[15])
    .replace(abjadBener[16], abjadAlay[16])
    .replace(abjadBener[17], abjadAlay[17])
    .replace(abjadBener[18], abjadAlay[18])
    .replace(abjadBener[19], abjadAlay[19])
    .replace(abjadBener[20], abjadAlay[20])
    .replace(abjadBener[21], abjadAlay[21])
    .replace(abjadBener[22], abjadAlay[22])
    .replace(abjadBener[23], abjadAlay[23])
    .replace(abjadBener[24], abjadAlay[24])
    .replace(abjadBener[25], abjadAlay[25]);


  return hasilConvert;
}

var terjemahkan = function(keyword, lang) {
  var key = "trnsl.1.1.20170707T101448Z.97d0be7226643896.37de4347e7f5ac433179a779aadeb974e50247b7";
  var url = "https://translate.yandex.net/api/v1.5/tr/translate?key=" + key + "&text=" + keyword + "&lang=" + lang + "&format=plain&option="
  var response = request(
    'GET',
    url
  );
  if (response.statusCode == 200) {
    const $ = cheerio.load(response.getBody('utf8'));
    return $("Translation text").text();
  }
}

var weather = function(keyword) {
  var url = "http://api.openweathermap.org/data/2.5/weather?q=" + keyword + "&units=metric&APPID=2505c1215671faf783b59b44620d4218";
  var response = request(
    'GET',
    url
  );
  if (response.statusCode == 200) {
    var json = JSON.parse(response.getBody('utf8'));

    var name = json.name;
    var suhu = json.main.temp + ' C';
    var kelembaban = json.main.humidity + ' %';
    var tekanan = json.main.pressure + ' HPa';
    var kecepatan_angin = json.wind.speed + ' C';

    var cuaca = "Temperatur di kota " + name + " : " + suhu + ", Kelembaban : " + kelembaban + ", Tekanan udara : " + tekanan + ", dan Kecepatan angin : " + kecepatan_angin;
    return cuaca;
  } else {
    return 'Tidak ditemukan daerah dengan nama : ' + keyword;
  }
}

var search9gag = function(keyword) {
  var url = "https://9gag.com/" + keyword;
  var response = request(
    'GET',
    url
  );
  if (response.statusCode == 200) {
    var dom = new JSDOM(response.body);
    const bodyEl = dom.window.document.body;
    var image = bodyEl.querySelectorAll(".badge-item-img");
    var title = [];
    var img = [];

    for (i = 0; i < image.length; i++) {
      title.push(image[i].getAttribute('alt'));
    }

    for (i = 0; i < image.length; i++) {
      img.push(image[i].getAttribute('src'));
    }

    var rand = Math.floor(Math.random() * image.length);

    return {
      memeTitle: title[rand],
      memeImg: img[rand]
    };
  } else {
    return {
      err: 'error',
      kata: 'Section : ' + keyword + ' tidak ditemukan'
    };
  }
}

var youtubeMusic = function(keyword) {
  var replaced = keyword.replace(/ /g, '+');
  var url = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&order=relevance&q=" + replaced + "&type=video&key=AIzaSyDlrK6kokD3dDhSoWQKCz3oMAaJMCqaQqM";
  var response = request(
    'GET',
    url
  );
  if (response.statusCode == 200) {
    var json = JSON.parse(response.getBody('utf8'));
    var totalResults = json.pageInfo.totalResults;
    if (totalResults !== 0) {
      var videoId = json.items[0].id.videoId;
      var title = json.items[0].snippet.title;

      return {
        id: videoId,
        judul: title
      };
    } else {
      return {
        err: 'error',
        kata: 'Musik dengan judul : ' + keyword + ' tidak ditemukan'
      };
    }
  } else {
    return {
      err: 'error',
      kata: 'Musik tidak ditemukan atau LIMIT'
    };
  }
}

function youtubeVideo(key) {
  var replaced = key.replace(/ /g, '+');
  var url = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&order=relevance&q=" + replaced + "&type=video&safeSearch=strict&key=AIzaSyDlrK6kokD3dDhSoWQKCz3oMAaJMCqaQqM";
  var response = request(
    'GET',
    url
  );
  var videoId = [];
  var thumbnails = [];
  if (response.statusCode == 200) {
    var json = JSON.parse(response.getBody('utf8'));
    var totalResults = json.pageInfo.totalResults;
    if (totalResults !== 0) {
      var items = json.items;
      for (i in items) {
        videoId.push(json.items[i].id.videoId);
        thumbnails.push(json.items[i].snippet.thumbnails.default.url);
      }

      var rand = Math.floor(Math.random() * items.length);
      return {
        id: videoId[rand],
        gambar: thumbnails[rand]
      };
    } else {
      return {
        err: 'error',
        kata: 'Video dengan judul : ' + key + ' tidak ditemukan'
      };
    }
  } else {
    return {
      err: 'error',
      kata: 'Video tidak ditemukan atau LIMIT'
    };
  }
}

var youtubeGetUrlVideo = function(keyword) {
  var itemsVideo = youtubeVideo(keyword);
  if (itemsVideo.err === undefined) {
    var url = "http://keepvid.com/?url=http%3A%2F%2Fyoutube.com%2Fwatch%3Fv%3D" + itemsVideo.id;
    var response = request(
      'GET',
      url
    );
    if (response.statusCode == 200) {
      const $ = cheerio.load(response.getBody('utf8'));
      var linkVideo = $('td:contains(480p)').parent().children().last().children().attr('href');
      return {
        video: linkVideo,
        thumbnail: itemsVideo.gambar
      };
    }
  } else {
    return {
      err: 'error',
      kata: itemsVideo.kata
    };
  }
}

var searchImg = function(keyword) {
  var replaced = keyword.replace(/ /g, '+');
  var key = "AIzaSyDlrK6kokD3dDhSoWQKCz3oMAaJMCqaQqM";
  var qry = replaced;
  var cx = "016498147224075515320:ukepxzq_vus";
  var fileType = "png,jpg";
  var searchType = "image";
  var url = "https://www.googleapis.com/customsearch/v1?key=" + key + "&cx=" + cx + "&q=" + qry + "&fileType=" + fileType + "&searchType=" + searchType + "&num=10&safe=high&alt=json";
  var response = request(
    'GET',
    url
  );
  if (response.statusCode == 200) {
    var json = JSON.parse(response.getBody('utf8'));
    var items = json.items;
    var totalResults = json.searchInformation.totalResults
    if (totalResults !== "0") {
      var link = [];
      for (i in items) {
        link.push(items[i].link);
      }

      var rand = Math.floor(Math.random() * items.length);
      var urlImg = link[rand];
      var httpnya = urlImg.substr(0, 5);
      if (httpnya === "http:") {
        urlImg = urlImg.replace('http', 'https');
      }

      return urlImg;
    } else {
      return {
        err: 'error',
        kata: 'Gambar dengan keyword : ' + keyword + ' gagal ditemukan'
      };
    }
  } else {
    return {
      err: 'error',
      kata: 'Gambar gagal ditemukan atau LIMIT'
    };
  }
}

var osuProfile = function(keyword, mode) {
  return osu.get_user({
    "u": keyword,
    "m": mode
  }).then(function(results) {
    return results;
  });
}

var osuBest = function(keyword, mode) {
  return osu.get_user_best({
    "u": keyword,
    "m": mode,
    "limit": 1
  }).then(function(results) {
    return results;
  });
}

var osuBeatmap = function(keyword) {
  return osu.get_beatmaps({
    "b": keyword,
    "limit": 1
  }).then(function(results) {
    return results;
  });
}

var games = function() {
  return {
    "type": "template",
    "altText": "Games",
    "template": {
      "type": "carousel",
      "columns": [{
        "thumbnailImageUrl": "https://image.ibb.co/nvvA9v/W3PmGlV.jpg",
        "title": "Teka teki",
        "text": "Bermain teka teki dengan katou :D",
        "actions": [{
            "type": "message",
            "label": "Mulai",
            "text": "Katou main tekateki"
          },
          {
            "type": "message",
            "label": "Bantuan",
            "text": "Katou help tekateki"
          },
          {
            "type": "uri",
            "label": "Tambahkan teka teki",
            "uri": "http://example.com/page/111"
          }
        ]
      }]
    }
  }
}

//fungsi normal
exports.getResponse = getResponse;
exports.searchImg = searchImg;
exports.youtubeGetUrlVideo = youtubeGetUrlVideo;
exports.youtubeMusic = youtubeMusic;
exports.search9gag = search9gag;
exports.weather = weather;
exports.terjemahkan = terjemahkan;
exports.ubahAlay = ubahAlay;
exports.translateAlay = translateAlay;
exports.stalkIg = stalkIg;
exports.checkId = checkId;
exports.cariLokasi = cariLokasi;
exports.ramal = ramal;
exports.wiki = wiki;

//fungsi game
exports.tekaTeki = tekaTeki;
exports.addidTekaTeki = addidTekaTeki;
exports.addLanjutTekaTeki = addLanjutTekaTeki;
exports.checkTekaTeki = checkTekaTeki;
exports.lanjutTekaTeki = lanjutTekaTeki;
exports.games = games;
exports.salah = salah;
exports.hapusIdGame = hapusIdGame;

//fungsi osu
exports.osuProfile = osuProfile;
exports.osuBest = osuBest;
exports.osuBeatmap = osuBeatmap;
