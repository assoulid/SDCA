var express = require('express');
var app = express();
var cors = require('cors');

app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});
app.use(cors());

app.get('/', function (req, res) {
  res.send('Service Status');
});

var listPers = ["Antoine","Bob","Alice","Robert","Oscar","Felix","Claire"];

app.get('/status/:id', function (req, res) {
  var result = {"id":"","name":"", "aJoue":""};
  var id = req.params.id;
  console.log("requete GET : status/"+id)
  if(id < 7 && id > -1){
      result.id = id;
      result.name = listPers[id];
      result.aJoue = true;
  }else{
    result.aJoue = false;
  }
  res.send(JSON.stringify(result));
});

var port = 3220
app.listen(port, function () {
  console.log('DemoServiceStatus listening on port '+ port);
});

