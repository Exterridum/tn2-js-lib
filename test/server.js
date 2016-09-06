var express = require("express");
var app = express();
var expressWs = require('express-ws')(app);
var router = express.Router();





router.ws("some/event", (ws, req) => {
  ws.on('message', function(msg) {
    ws.send(msg);
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});