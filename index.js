'use strict';

//importing library
const express = require('express');
const line = require('@line/bot-sdk');

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
  //this is where you write all your code
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

}

//running the server
app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function() {
  console.log(`listening on : ` + app.get('port'));
});
