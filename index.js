'use strict';

//importing library
const express = require('express');
const line = require('@line/bot-sdk');
const MongoClient = require('mongodb').MongoClient;
var myfunc = require('./myfunc');

//configure the bot information and adding express to app variable
const config = {
  channelAccessToken: 'XrScKVvNSdipjnW8vX5TUemKTMdbss9MJ7Z6PulfQwh8yDdWZCVwWoKe5IwR2Tpk8V44lGune039T5Yw4Cl2PEZpiCqyX7QjcrYAgt3z+zeqyIjak0pA5YjuG20eYU0Mj77Pb4jGVjT8dq6fK6EGBQdB04t89/1O/w1cDnyilFU=',
  channelSecret: '094811dcc54bd450fb23cf31f252b200'
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
    // var data;
    //ambil id source
    // myfunc.checkId(source, id).then(function(items) {
    //return kosong bila msg type selain text
    if (event.message.type !== 'text') {
      return Promise.resolve(null);
    }
    //
    //     data = items;
    //     if (data[0].game !== "") {
    //       //games tekateki
    //       if (data[0].game === "tekaTeki") {
    //         var jawabanTekaTeki;
    //         var jawabanAlasan;
    //         if (msgText.indexOf('Katou jawab') > -1) {
    //           var jawabanUser = msgText.substr(12);
    //           jawabanUser = jawabanUser.toLowerCase();
    //           if (data[0].session === "") {
    //             myfunc.checkTekaTeki(data[0].gameid).then(function(jawaban) {
    //               jawabanTekaTeki = jawaban[0].jawaban;
    //               jawabanAlasan = jawaban[0].alasan;
    //               if (jawabanUser === jawabanTekaTeki.toLowerCase()) {
    //                 myfunc.addLanjutTekaTeki(userType, data[0][userType], jawaban[0]._id).then(function(results) {
    //                   return client.replyMessage(token, [{
    //                     type: 'text',
    //                     text: 'Yey, Jawabanmu benar : ' + jawabanTekaTeki.toLowerCase()
    //                   }, {
    //                     type: 'text',
    //                     text: jawabanAlasan
    //                   }, {
    //                     "type": "template",
    //                     "altText": "Konfirmasi lanjut",
    //                     "template": {
    //                       "type": "confirm",
    //                       "text": "Ingin main lagi ?",
    //                       "actions": [{
    //                           "type": "message",
    //                           "label": "Ya",
    //                           "text": "Katou lanjut tekateki"
    //                         },
    //                         {
    //                           "type": "message",
    //                           "label": "Tidak",
    //                           "text": "Katou selesai tekateki"
    //                         }
    //                       ]
    //                     }
    //                   }]);
    //                 });
    //               } else {
    //                 return client.replyMessage(token, {
    //                   type: 'text',
    //                   text: myfunc.salah()
    //                 });
    //               }
    //             });
    //           } else {
    //             return Promise.resolve(null);
    //           }
    //         } else if (msgText === 'Katou nyerah') {
    //           if (data[0].session === "") {
    //             myfunc.checkTekaTeki(data[0].gameid).then(function(jawaban) {
    //               jawabanTekaTeki = jawaban[0].jawaban;
    //               jawabanAlasan = jawaban[0].alasan;
    //               myfunc.addLanjutTekaTeki(userType, data[0][userType], jawaban[0]._id).then(function(results) {
    //                 return client.replyMessage(token, [{
    //                   type: 'text',
    //                   text: 'Jawaban yang benar adalah : ' + jawabanTekaTeki.toLowerCase()
    //                 }, {
    //                   type: 'text',
    //                   text: jawabanAlasan
    //                 }, {
    //                   "type": "template",
    //                   "altText": "Konfirmasi lanjut",
    //                   "template": {
    //                     "type": "confirm",
    //                     "text": "Ingin main lagi ?",
    //                     "actions": [{
    //                         "type": "message",
    //                         "label": "Ya",
    //                         "text": "Katou lanjut tekateki"
    //                       },
    //                       {
    //                         "type": "message",
    //                         "label": "Tidak",
    //                         "text": "Katou selesai tekateki"
    //                       }
    //                     ]
    //                   }
    //                 }]);
    //               });
    //             });
    //           } else {
    //             return Promise.resolve(null);
    //           }
    //         } else if (msgText === 'Katou selesai tekateki') {
    //           myfunc.hapusIdGame(userType, data[0][userType]).then(function(data) {
    //             return client.replyMessage(token, [{
    //               type: 'text',
    //               text: 'Permainan teka teki kamu telah dihentikan'
    //             }]);
    //           });
    //         } else if (msgText === 'Katou lanjut tekateki') {
    //           var itemtekaTeki;
    //           if (data[0].session === "Lanjut") {
    //             myfunc.lanjutTekaTeki(data[0].gameid).then(function(itemGame) {
    //               itemtekaTeki = itemGame;
    //               myfunc.addidTekaTeki(userType, data[0][userType], itemtekaTeki[0]._id).then(function(database) {
    //                 return client.replyMessage(token, [{
    //                   type: 'text',
    //                   text: itemtekaTeki[0].tekateki
    //                 }, {
    //                   type: 'text',
    //                   text: itemtekaTeki[0].teks
    //                 }]);
    //               }, function(err) {
    //                 console.error('The promise was rejected', err, err.stack);
    //               });
    //             }, function(err) {
    //               console.error('The promise was rejected', err, err.stack);
    //             });
    //           } else {
    //             return Promise.resolve(null);
    //           }
    //         } else if (msgText === 'Katou main tekateki') {
    //           return client.replyMessage(token, {
    //             type: 'text',
    //             text: 'Permainan teka teki sedang berlangsung ketik Katou selesai tekateki untuk menreset'
    //           });
    //         } else if (msgText === 'Katou help tekateki') {
    //           return client.replyMessage(token, {
    //             type: 'text',
    //             text: 'Bantuan permainan teka teki\n\nketik : \n-Katou jawab (jawaban mu) untuk menjawab\n-Katou nyerah untuk menyerah'
    //           });
    //         } else {
    //           if (msgText.indexOf('Katou') > -1) {
    //             return client.replyMessage(token, {
    //               type: 'text',
    //               text: 'Dijawab dulu teka teki diatas atau ketik Katou selesai tekateki'
    //             });
    //           }
    //         }
    //       }
    //     } else {
    //katou merespon
    if (msgText === 'Katou') {
      return client.replyMessage(token, {
        type: 'text',
        text: 'Iya'
      });
    }

    //checkId
    if (msgText === 'Katou id') {
      return client.replyMessage(token, {
        type: 'text',
        text: userType + " : " + id
      });
    }

    //games tekateki
    // var itemtekaTeki;
    // if (msgText === 'Katou main tekateki') {
    //   myfunc.tekaTeki().then(function(itemGame) {
    //     itemtekaTeki = itemGame;
    //     myfunc.addidTekaTeki(userType, data[0][userType], itemtekaTeki[0]._id).then(function(database) {
    //       return client.replyMessage(token, [{
    //         type: 'text',
    //         text: 'Permainan dimulai ketik : \n-Katou jawab (jawaban mu) untuk menjawab\n-Katou nyerah untuk menyerah'
    //       }, {
    //         type: 'text',
    //         text: itemtekaTeki[0].tekateki
    //       }, {
    //         type: 'text',
    //         text: itemtekaTeki[0].teks
    //       }]);
    //     }, function(err) {
    //       console.error('The promise was rejected', err, err.stack);
    //     });
    //   }, function(err) {
    //     console.error('The promise was rejected', err, err.stack);
    //   });
    // }
    //
    // //katou list games
    // if (msgText === 'Katou games') {
    //   var items = myfunc.games();
    //   return client.replyMessage(token, items);
    // }

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
      keyword = encodeURI(keyword);
      var terjemahan = myfunc.terjemahkan(keyword, lang);
      return client.replyMessage(token, {
        type: 'text',
        text: 'Hasil terjemahan : \n\n' + terjemahan
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
    if (msgText.indexOf('Katou osu') > -1) {
      var keyword;
      var mode;
      if (msgText.indexOf('Katou osustd') > -1) {
        keyword = msgText.substr(13);
        mode = 0;
      } else if (msgText.indexOf('Katou osutaiko') > -1) {
        keyword = msgText.substr(15);
        mode = 1;
      } else if (msgText.indexOf('Katou osuctb') > -1) {
        keyword = msgText.substr(13);
        mode = 2;
      } else if (msgText.indexOf('Katou osumania') > -1) {
        keyword = msgText.substr(15);
        mode = 3;
      }

      var profile;
      var best;
      var beatmap;
      var deskripsi_profil;
      var deskripsi_best;
      myfunc.osuProfile(keyword, mode).then(function(hasil_profile) {
        profile = hasil_profile;
        if (profile.length === 0) {
          return client.replyMessage(token, {
            type: 'text',
            text: 'User : ' + keyword + " tidak ditemukan"
          });
        } else {
          myfunc.osuBest(keyword, mode).then(function(hasil_best) {
            best = hasil_best;
            if (best.length === 0) {
              deskripsi_profil = "Level : " + Math.floor(parseInt(profile[0].level)) + "    Acc : " + Math.floor(parseInt(profile[0].accuracy)) + "%\nRank : " + profile[0].pp_rank + "\nPP :" + profile[0].pp_raw;
              return client.replyMessage(token, {
                "type": "template",
                "altText": "Osu Profile",
                "template": {
                  "type": "carousel",
                  "columns": [{
                    "thumbnailImageUrl": "https://a.ppy.sh/" + profile[0].user_id,
                    "title": profile[0].username,
                    "text": deskripsi_profil,
                    "actions": [{
                      "type": "uri",
                      "label": "Ke profile",
                      "uri": "https://osu.ppy.sh/u/" + profile[0].user_id
                    }]
                  }]
                }
              });
            } else {
              myfunc.osuBeatmap(best[0].beatmap_id).then(function(hasil_beatmap) {
                beatmap = hasil_beatmap;
                var title = beatmap[0].title;
                if (title.length > 26) {
                  title = title.substr(0, 26) + "...";
                }
                deskripsi_profil = "Level : " + Math.floor(parseInt(profile[0].level)) + "    Acc : " + Math.floor(parseInt(profile[0].accuracy)) + "%\nRank : " + profile[0].pp_rank + "\nPP : " + profile[0].pp_raw;
                deskripsi_best = title + "\nScore : " + best[0].score + "\nPP : " + Math.floor(parseInt(best[0].pp));
                return client.replyMessage(token, {
                  "type": "template",
                  "altText": "Osu Profile",
                  "template": {
                    "type": "carousel",
                    "columns": [{
                        "thumbnailImageUrl": "https://a.ppy.sh/" + profile[0].user_id,
                        "title": profile[0].username,
                        "text": deskripsi_profil,
                        "actions": [{
                            "type": "uri",
                            "label": "Ke profile",
                            "uri": "https://osu.ppy.sh/u/" + profile[0].user_id
                          },
                          {
                            "type": "uri",
                            "label": "Ke beatmap terbaik",
                            "uri": "https://osu.ppy.sh/s/" + beatmap[0].beatmapset_id
                          }
                        ]
                      },
                      {
                        "thumbnailImageUrl": "https://b.ppy.sh/thumb/" + beatmap[0].beatmapset_id + "l.jpg",
                        "title": "Skor Terbaik",
                        "text": deskripsi_best,
                        "actions": [{
                            "type": "uri",
                            "label": "Ke profile",
                            "uri": "https://osu.ppy.sh/u/" + profile[0].user_id
                          },
                          {
                            "type": "uri",
                            "label": "Ke beatmap terbaik",
                            "uri": "https://osu.ppy.sh/s/" + beatmap[0].beatmapset_id
                          }
                        ]
                      }
                    ]
                  }
                });
              });
            }
          });
        }
      });
    }

    //   }
    // },
    // function(err) {
    //   console.error('The promise was rejected', err, err.stack);
    // });
  }
}

//running the server
app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function() {
  console.log('listening on : ' + app.get('port'));
});
