var express = require('express');
var app = express();
var mysql = require('mysql');
var cors = require('cors');
var request = require("request");

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

  // Loading database IP and port
  request("http://localhost:8500/v1/catalog/service/mysql", function (error, response, body) {

    console.log(body);

    if (error) {
        console.log(error)
    } else {
      host = JSON.parse(body)[0]["Address"];
      port = JSON.parse(body)[0]["ServicePort"];

      console.log(host, port, "\n");

      // Connection to database
      var connection = mysql.createConnection({
        host: host,
        port: port,
        user: 'root',
        password: 'group4',
        database: 'prestashop'
      });

      connection.connect(function (err) {
        if (!err) {
            console.log("Database is connected ... nn");
        } else {
            console.log(err);
        }
      });

      // Executing query
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
});

var port = 3220
app.listen(port, function () {
  console.log('DemoServiceStatus listening on port '+ port);
});
