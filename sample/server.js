var express = require("express");
var app = express();
var expressWs = require('express-ws')(app);

app.ws("/some/event", (ws, req) => {
  console.log("connected");
  setInterval(() => {    
    console.log("sending message");
    ws.send("some random text");
  }, 1000);
  
  ws.on('message', function(msg) {    
    ws.send(msg);
  });
});

app.use('/app', express.static('sample/app'));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});