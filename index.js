'use strict';

//importing library
const express = require('express');
const line = require('@line/bot-sdk');
const MongoClient = require('mongodb').MongoClient;
var myfunc = require('./myfunc');

//configure the bot information and adding express to app variable
const config = {
  channelAccessToken: 'Us6h+bLUpILGmXlwQLeKQbUt3rwsM9a9ZQDPu2J/oTVM1fgk6l8jVMzj3VMZmv5Kh01EfFdd3w/LB/ami46wRdRZUGZPf0HvjVGo4C4mo+oR3paKPGLlcQmyoTEuJ5UakqZuD4p9XZdWSZuuWQBiIwdB04t89/1O/w1cDnyilFU=',
  channelSecret: '1d9404227cd61b49a81864ec9b47a877'
};
const app = express();

//webhook handler
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result));
});

//create a new LINE Client object
const client = new line.Client(config);
//handling the event
function handleEvent(event) {
  //this is where you write all your code....
  //define variable with event value
  var token = event.replyToken;

  if (event.type === 'join') {
    if (event.source.type === 'group') {
      return client.replyMessage(token, {
        type: 'text',
        text: 'Halo Semuanya silahkan ketik \'Katou keyword\' untuk melihat keyword :D \n\nJika ada masalah silahkan kontak :\nCreated by : Rehre(id:akl2340) 18 tahun ig: _rehre\nBot ini diciptakan untuk memenuhi kebutuhan personal'
      });
    } else if (event.source.type === 'room') {
      return client.replyMessage(token, {
        type: 'text',
        text: 'Halo Semuanya silahkan ketik \'Katou keyword\' untuk melihat keyword :D \n\nJika ada masalah silahkan kontak :\nCreated by : Rehre(id:akl2340) 18 tahun ig: _rehre\nBot ini diciptakan untuk memenuhi kebutuhan personal'
      });
    }
  } else if (event.type === 'message') {
    //define variable with event value
    var msgText = event.message.text;


    //periksa source
    var source = event.source.type;
    var id;
    var userType;
    if (source === 'user') {
      userType = 'userId';
    } else if (source === 'group') {
      userType = 'groupId';
    } else if (source === 'room') {
      userType = 'roomId';
    }
    if (source === 'user') {
      id = event.source.userId;
    } else if (source === 'group') {
      id = event.source.groupId;
    } else if (source === 'room') {
      id = event.source.roomId;
    }
    var data;
    //ambil id source
    myfunc.checkId(source, id).then(function(items) {
      //return kosong bila msg type selain text
      if (event.message.type !== 'text') {
        return Promise.resolve(null);
      }

      data = items;
      if (data[0].game !== "") {
        if (data[0].game === "tekaTeki") {
          var jawabanTekaTeki;
          var jawabanAlasan;
          if (msgText.indexOf('Katou jawab') > -1) {
            var jawabanUser = msgText.substr(12);
            jawabanUser = jawabanUser.toLowerCase();
            myfunc.checkTekaTeki(data[0].gameid).then(function(jawaban) {
              jawabanTekaTeki = jawaban[0].jawaban;
              jawabanAlasan = jawaban[0].alasan;
              if (jawabanUser === jawabanTekaTeki.toLowerCase()) {
                myfunc.hapusIdGame(userType, data[0][userType]).then(function(data) {
                  return client.replyMessage(token, [{
                    type: 'text',
                    text: 'yey jawaban mu benar : ' + jawabanTekaTeki.toLowerCase()
                  }, {
                    type: 'text',
                    text: jawabanAlasan
                  }, {
                    type: 'text',
                    text: 'jika ingin bermain lagi ketik Katou main tekateki'
                  }]);
                });
              } else {
                return client.replyMessage(token, {
                  type: 'text',
                  text: 'Jawaban mu salah'
                });
              }
            });
          } else if (msgText === 'Katou nyerah') {
            myfunc.checkTekaTeki(data[0].gameid).then(function(jawaban) {
              jawabanTekaTeki = jawaban[0].jawaban;
              jawabanAlasan = jawaban[0].alasan;
              myfunc.hapusIdGame(userType, data[0][userType]).then(function(data) {
                return client.replyMessage(token, [{
                  type: 'text',
                  text: 'jawaban yang benar adalah : ' + jawabanTekaTeki.toLowerCase()
                }, {
                  type: 'text',
                  text: jawabanAlasan
                }, {
                  type: 'text',
                  text: 'jika ingin bermain lagi ketik Katou main tekateki'
                }]);
              });
            });
          } else {
            if (msgText.indexOf('Katou') > -1) {
              return client.replyMessage(token, {
                type: 'text',
                text: 'dijawab dulu teka teki diatas atau ketik Katou nyerah'
              });
            }
          }
        }
      } else {
        //katou merespon
        if (msgText === 'Katou') {
          return client.replyMessage(token, {
            type: 'text',
            text: 'iya'
          });
        }

        //checkId
        if (msgText === 'Katou id') {
          return client.replyMessage(token, {
            type: 'text',
            text: source + " : " + data[0][userType]
          });
        }

        //games tekateki
        var itemtekaTeki;
        if (msgText === 'Katou main tekateki') {
          myfunc.tekaTeki().then(function(itemGame) {
            itemtekaTeki = itemGame;
            myfunc.addidTekaTeki(userType, data[0][userType], itemtekaTeki[0]._id).then(function(database) {
              return client.replyMessage(token, [{
                type: 'text',
                text: itemtekaTeki[0].tekateki
              }, {
                type: 'text',
                text: itemtekaTeki[0].teks
              }]);
            }, function(err) {
              console.error('The promise was rejected', err, err.stack);
            });
          }, function(err) {
            console.error('The promise was rejected', err, err.stack);
          });
        }

        //kalkulator
        if (msgText.indexOf('Katou berapa') > -1) {
          var angka = msgText.substr(13);

          return client.replyMessage(token, {
            type: 'text',
            text: 'Hasil dari ' + angka + ' adalah ' + eval(angka)
          });
        }

        //ramal
        if (msgText === 'Katou ramal') {
          return client.replyMessage(token, {
            type: 'text',
            text: myfunc.ramal()
          });
        }

        //selamat ulang tahun
        if (msgText.indexOf('Katou ucapkan selamat ulang tahun ke') > -1) {
          var nama = msgText.substr(37);
          return client.replyMessage(token, {
            type: 'text',
            text: 'Selamat Ulang Tahun ' + nama + ' :D'
          });
        }

        //wikipedia
        if (msgText.indexOf('Katou apa itu') > -1) {
          var keyword = msgText.substr(14);
          return client.replyMessage(token, {
            type: 'text',
            text: myfunc.wiki(keyword)
          });
        }

        //cari lokasi
        if (msgText.indexOf('Katou cari lokasi') > -1) {
          var keyword = msgText.substr(18);
          var location = myfunc.cariLokasi(keyword);
          if (location.err === undefined) {
            return client.replyMessage(token, {
              type: "location",
              title: keyword,
              address: location.address,
              latitude: location.latitude,
              longitude: location.longitude
            });
          } else {
            return client.replyMessage(token, {
              type: 'text',
              text: location.kata
            });
          }
        }

        //katou tulis
        if (msgText.indexOf('Katou tulis') > -1) {
          var keyword = msgText.substr(12);
          keyword = encodeURI(keyword);
          return client.replyMessage(token, {
            type: "image",
            originalContentUrl: "https://chart.apis.google.com/chart?chs=300x50&cht=p3&chtt=" + keyword + "&chts=FFFFFF,24&chf=bg,s,000000",
            previewImageUrl: "https://chart.apis.google.com/chart?chs=300x50&cht=p3&chtt=" + keyword + "&chts=FFFFFF,24&chf=bg,s,000000"
          });
        }

        //katou stalk ig
        if (msgText.indexOf('Katou stalk') > -1) {
          var keyword = msgText.substr(12);
          var objectIg = myfunc.stalkIg(keyword);
          if (objectIg.err === undefined) {
            return client.replyMessage(token, objectIg);
          } else {
            return client.replyMessage(token, {
              type: 'text',
              text: objectIg.kata
            });
          }

        }

        //katou ubah alay
        if (msgText.indexOf('Katou ubah alay') > -1) {
          var keyword = msgText.substr(16);
          return client.replyMessage(token, {
            type: 'text',
            text: myfunc.ubahAlay(keyword)
          });
        }

        //katou terjemahkan alay
        if (msgText.indexOf('Katou terjemahkan alay') > -1) {
          var keyword = msgText.substr(23);
          return client.replyMessage(token, {
            type: 'text',
            text: myfunc.translateAlay(keyword)
          });
        }

        //katou terjemahkan
        if (msgText.indexOf('Katou terjemahkan') > -1) {
          var lang = msgText.substr(18, 5);
          var keyword = msgText.substr(24);
          var terjemahan = myfunc.terjemahkan(keyword, lang);
          return client.replyMessage(token, {
            type: 'text',
            text: terjemahan
          });
        }

        //katou cuaca
        if (msgText.indexOf('Katou cuaca') > -1) {
          var keyword = msgText.substr(12);
          return client.replyMessage(token, {
            type: 'text',
            text: myfunc.weather(keyword)
          });
        }

        //katou 9gag keyword
        if (msgText.indexOf('Katou 9gag') > -1) {
          var keyword = msgText.substr(11);
          var items9gag = myfunc.search9gag(keyword);
          if (items9gag.err === undefined) {
            return client.replyMessage(token, [{
              type: 'text',
              text: items9gag.memeTitle
            }, {
              type: 'image',
              originalContentUrl: items9gag.memeImg,
              previewImageUrl: items9gag.memeImg
            }]);
          } else {
            return client.replyMessage(token, {
              type: 'text',
              text: items9gag.kata
            });
          }
        }

        //katou 9gag
        if (msgText === 'Katou 9gag') {
          var items9gag = myfunc.search9gag('hot');
          return client.replyMessage(token, [{
            type: 'text',
            text: items9gag.memeTitle
          }, {
            type: 'image',
            originalContentUrl: items9gag.memeImg,
            previewImageUrl: items9gag.memeImg
          }]);
        }

        //katou download musik
        if (msgText.indexOf('Katou download musik') > -1) {
          var keyword = msgText.substr(21);
          var itemsMusic = myfunc.youtubeMusic(keyword);
          if (itemsMusic.err === undefined) {
            var linkDownload = "Link : http://mp3you.tube/get/?direct=https://www.youtube.com/watch?v=" + itemsMusic.id;
            var messageLink = itemsMusic.judul + "\n\n" + linkDownload;
            return client.replyMessage(token, {
              type: 'text',
              text: messageLink
            });
          } else {
            return client.replyMessage(token, {
              type: 'text',
              text: itemsMusic.kata
            });
          }
        }

        //katou cari video
        if (msgText.indexOf('Katou cari video') > -1) {
          var keyword = msgText.substr(17);
          var itemsVideo = myfunc.youtubeGetUrlVideo(keyword);
          if (itemsVideo.err === undefined) {
            return client.replyMessage(token, {
              type: 'video',
              "originalContentUrl": itemsVideo.video,
              "previewImageUrl": itemsVideo.thumbnail
            });
          } else {
            return client.replyMessage(token, {
              type: 'text',
              text: itemsVideo.kata
            });
          }
        }

        //katou cari gambar
        if (msgText.indexOf('Katou cari gambar') > -1) {
          var keyword = msgText.substr(18);
          var itemsGambar = myfunc.searchImg(keyword);
          if (itemsGambar.err === undefined) {
            return client.replyMessage(token, {
              type: 'image',
              originalContentUrl: itemsGambar,
              previewImageUrl: itemsGambar
            });
          } else {
            return client.replyMessage(token, {
              type: 'text',
              text: itemsGambar.kata
            });
          }
        }

        //katou osuprofile
        if (msgText.indexOf('Katou osuprofile') > -1) {
          var keyword = msgText.substr(17);
          var profile;
          var recent;
          var beatmap;
          var deskripsi_profil;
          var deskripsi_recent;
          myfunc.osuProfile(keyword, 0).then(function(hasil_profile) {
            profile = hasil_profile;
            myfunc.osuRecent(keyword, 0).then(function(hasil_recent) {
              recent = hasil_recent;
              myfunc.osuBeatmap(recent[0].beatmap_id).then(function(hasil_beatmap) {
                beatmap = hasil_beatmap;
                // deskripsi_profil = "Level : " + profile[0].level + "/n/nPP : " + profile[0].pp_rank + "/n/nTotal Score : " + profile[0].total_score;
                // deskripsi_recent = "Judul : " + beatmap[0].title;
                return client.replyMessage(token, {
                  "type": "template",
                  "altText": "Stalk",
                  "template": {
                    "type": "carousel",
                    "columns": [{
                        "thumbnailImageUrl": "https://example.com/bot/images/item2.jpg",
                        "title": profile[0].username,
                        "text": "deskripsi_profil",
                        "actions": [{
                          "type": "uri",
                          "label": "Ke Profil",
                          "uri": "https://example.com/bot/images/item2.jpg"
                        }, {
                          "type": "uri",
                          "label": "Download Recent Beatmap",
                          "uri": "https://example.com/bot/images/item2.jpg"
                        }]
                      }
                      // {
                      //   "thumbnailImageUrl": "https://b.ppy.sh/thumb/" + recent[0].beatmap_id + ".jpg",
                      //   "title": "Lagu Terakhir Dimainkan",
                      //   "text": deskripsi_best,
                      //   "actions": [{
                      //     "type": "uri",
                      //     "label": "Ke Profil",
                      //     "uri": "https://osu.ppy.sh/u/" + profile[0].user_id
                      //   }, {
                      //     "type": "uri",
                      //     "label": "Download Recent Beatmap",
                      //     "uri": "https://osu.ppy.sh/d/" + recent[0].beatmap_id
                      //   }]
                      // }
                    ]
                  }
                });
              });
            });
          });
        }

      }
    }, function(err) {
      console.error('The promise was rejected', err, err.stack);
    });
  }
}

//running the server
app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function() {
  console.log('listening on : ' + app.get('port'));
});
