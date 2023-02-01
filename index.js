const http = require('http');
const fs = require('fs');
const https = require('https');
const path = require('path')
const express = require('express');
const bodyParser = require('body-parser');
const querystring = require('querystring');
const {askGPT} =require("./openAi");
var cors = require('cors');
var subscriptions = [];

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({
  origin: function (origin, callback) {
    return callback(null, true);

  }
}
));

app.get(['/'], function (request, reponse) {
  console.log(request.originalUrl);
  reponse.sendFile(path.join(__dirname, './www/index.html'));
  app.use(express.static(path.join(__dirname, './www/')));
});
app.post('/askgpt',async  function (request, reponse) {
  console.log(request.body);
  if(request.body.question)
  {var result = await askGPT(request.body.question);
    reponse.json(result);
  }
  else reponse.json({text: "Bonjour tu peux m'appeler Jeppetto"});
});
const serverhttp = http.createServer(  app );

const port = 5555

serverhttp.listen(port, function () {
  console.log(
    "Example app listening on port " + port + "! Go to http://localhost:" + port + "/"
  );
});


