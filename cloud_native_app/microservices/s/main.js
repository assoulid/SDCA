var express = require('express');
var app = express();
var cors = require('cors');
YAML = require('yamljs');

// Loading configuration of database
console.log("Loading configuration of database ...");
config = YAML.load('./config.yml');

/********** DATABASE **********/
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : config.host,
  user     : config.user,
  password : config.password,
  database : config.database
});

connection.connect(function(err){
if(!err) {
    console.log("Database is connected ...");
} else {
    console.log("Error connecting database ...");
}
});

/********** HEADER **********/
app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});
app.use(cors());

/********** ROUTES **********/
app.get('/', function (req, res) {
  res.send('Service Status');
});

app.get('/status/:id', function (req, res) {
  var result = {"id":"", "aJoue":""};
  var id = req.params.id;
  console.log("requete GET : status/"+id)

  if (id < 20002 && id > 0) {
    result.id = id;
    connection.query('SELECT has_played FROM has_played WHERE id_customer='+id, function(err, rows, fields) {
      // Closing connection
      // connection.end();
      if (!err) {
        // console.log(rows[0].has_played);
        aJoue = rows[0].has_played;
        result.aJoue = !!+aJoue; // Converts int to boolean
        res.send(JSON.stringify(result));
      }
      else
        console.log('Error while performing Query.');
    });
  }

});

var port = 3220
app.listen(port, function () {
  console.log('DemoServiceStatus listening on port '+ port);
});
