
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
  res.send('Service Identification');
});

var listPers = ["Antoine","Bob","Alice","Robert","Oscar","Felix","Claire"];

app.get('/login/:id', function (req, res) {
  var result = {"id":"","name":"", "estPresent":""};
  var id = req.params.id;
  console.log("requete GET : login/"+id)
  if(id < 7 && id > -1){
      result.id = id;
      result.name = listPers[id];
      result.estPresent = true;
  }else{
    result.estPresent = false;
  }
  res.send(JSON.stringify(result));
});

var port = 3210
app.listen(port, function () {
  console.log('DemoServiceIdentification listening on port '+ port);
});

