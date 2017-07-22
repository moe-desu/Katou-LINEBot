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
  var data == null;
  //ambil id source
  var db;
  if (source === 'user') {
    id = event.source.userId;
    //check if user already inserted to userId collection
    MongoClient.connect('mongodb://rehre:akmal2340@ds059634.mlab.com:59634/katou', function(err, database) {
      if (err) {
        return client.replyMessage(token, {
          type: 'text',
          text: "Sambungan ke database error"
        });
      } else {
        db = database;
        db.collection('userId').find({
          "userId": id
        }).toArray(function(err, results) {
          if (err) {
            db.collection('userId').insertOne({
              "userId": id,
              "game": "",
              "gameid": ""
            }, function(err, result) {
              if (err) {
                return client.replyMessage(token, {
                  type: 'text',
                  text: "gagal menambahkan id ke database"
                });
              } else {
                data = result;
              }
            });
          } else {
            data = results;
          }
        });
      }
    });
  } else if (source === 'group') {
    id = event.source.groupId;
    //check if user already inserted to groupId collection
    MongoClient.connect('mongodb://rehre:akmal2340@ds059634.mlab.com:59634/katou', function(err, database) {
      if (err) {
        return client.replyMessage(token, {
          type: 'text',
          text: "Sambungan ke database error"
        });
      } else {
        db.collection('groupId').find({
          "groupId": id
        }).toArray(function(err, results) {
          if (err) {
            db.collection('groupId').insertOne({
              "groupId": id,
              "game": "",
              "gameid": ""
            }, function(err, result) {
              if (err) {
                return client.replyMessage(token, {
                  type: 'text',
                  text: "gagal menambahkan id ke database"
                });
              } else {
                data = result;
              }
            });
          } else {
            data = results;
          }
        });
      }
    });
  }

  //check id
  if (msgText.indexOf('Katou id') > -1) {
    if (data) {
      return client.replyMessage(token, {
        type: 'text',
        text: data
      });
    } else {
      return client.replyMessage(token, {
        type: 'text',
        text: 'data kosong'
      });
    }
  }

  //return kosong bila msg type selain text
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
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

//running the server
app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function() {
  console.log('listening on : ' + app.get('port'));
});
