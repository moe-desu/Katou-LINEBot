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
  var msgText = event.message.text;
  var token = event.replyToken;

  //periksa source
  var source = event.source.type;
  var id;
  var userType;
  if (source === 'user') {
    userType = 'userId';
  } else if (source === 'group') {
    userType = 'groupId';
  }
  if (source === 'user') {
    id = event.source.userId;
  } else if (source === 'group') {
    id = event.source.groupId;
  }
  var data;
  //ambil id source
  myfunc.checkId(source, id).then(function(items) {
    //return kosong bila msg type selain text
    if (event.type !== 'message' || event.message.type !== 'text') {
      return Promise.resolve(null);
    }

    data = items;
    if (data[0].game !== "") {
      if (data[0].game === "tekaTeki") {
        var jawabanTekaTeki;
        var jawabanAlasan;
        if(msgText.indexOf('Katou jawab') > -1){
          var jawabanUser = msgText.substr(12);
          jawabanUser = jawabanUser.toLowerCase();
          myfunc.checkTekaTeki(data[0].gameid).then(function(jawaban){
            jawabanTekaTeki = jawaban[0].jawaban;
            jawabanAlasan = jawaban[0].alasan;
            if(jawabanUser === jawabanTekaTeki.toLowerCase()){
              myfunc.hapusIdGame(userType,data[0][userType]).then(function(data){
                return client.replyMessage(token, [{
                  type: 'text',
                  text: 'yey jawaban mu benar : '+jawabanTekaTeki.toLowerCase()
                },{
                  type: 'text',
                  text: jawabanAlasan
                },{
                  type: 'text',
                  text: 'jika ingin bermain lagi ketik Katou main tekateki'
                }]);
              });
            }else{
              return client.replyMessage(token, {
                type: 'text',
                text: 'Jawaban mu salah'
              });
            }
          });
        }else if(msgText.indexOf('Katou nyerah') > -1){
          myfunc.checkTekaTeki(data[0].gameid).then(function(jawaban){
            jawabanTekaTeki = jawaban[0].jawaban;
            jawabanAlasan = jawaban[0].alasan;
            myfunc.hapusIdGame(userType,data[0][userType]).then(function(data){
              return client.replyMessage(token, [{
                type: 'text',
                text: 'jawaban yang benar adalah : '+jawabanTekaTeki.toLowerCase()
              },{
                type: 'text',
                text: jawabanAlasan
              },{
                type: 'text',
                text: 'jika ingin bermain lagi ketik Katou main tekateki'
              }]);
            });
          });
        }else{
          return client.replyMessage(token, {
            type: 'text',
            text: 'dijawab dulu teka teki diatas atau ketik katou nyerah'
          });
        }
      }
    } else {
      //checkId
      if (msgText.indexOf('Katou id') > -1) {
        return client.replyMessage(token, {
          type: 'text',
          text: source + " : " + data[0][userType]
        });
      }

      //games tekateki
      var itemtekaTeki;
      if (msgText.indexOf('Katou main tekateki') > -1) {
        myfunc.tekaTeki().then(function(itemGame){
          itemtekaTeki = itemGame;
          myfunc.addidTekaTeki(userType,data[0][userType],itemtekaTeki[0]._id).then(function(database){
            return client.replyMessage(token, [{
              type: 'text',
              text: itemtekaTeki[0].tekateki
            },{
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
      if (msgText.indexOf('Katou ramal') > -1) {
        return client.replyMessage(token, {
          type: 'text',
          text: myfunc.ramal
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
        return client.replyMessage(token, {
          type: "location",
          title: keyword,
          address: location.address,
          latitude: location.latitude,
          longitude: location.longitude
        });
      }
    }
  }, function(err) {
    console.error('The promise was rejected', err, err.stack);
  });

}

//running the server
app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function() {
  console.log('listening on : ' + app.get('port'));
});
