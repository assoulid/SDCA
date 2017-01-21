var express = require('express');
var app = express();
var mysql = require('mysql');
var cors = require('cors');
var request = require("request");

/********** HEADER **********/
app.use(function (req, res, next) {
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
    var result = {"id": null, "hasPlayed": null, "hasWon": null};
    var id = req.params.id;
    console.log("requete GET : status/" + id)

    // Loading database IP and port
    request("http://localhost:8500/v1/health/service/mysql", function (error, response, body) {

        console.log(body);
        var service_health_info = JSON.parse(body);
        var passing_hosts = service_health_info.filter(function (x) {
            return x["Checks"].filter(function (y) {
                    return ((y["ServiceName"] === "mysql") && (y["Status"] === "passing"))
                }).length != 0
        });
        if (error) {
            console.log(error)
        } else {
            host = passing_hosts[0].Node.Address;
            port = passing_hosts[0].Service.Port;

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
            connection.query('SELECT * FROM has_played WHERE id_customer=' + id, function (err, rows, fields) {
                // Closing connection
                connection.end();
                if (!err) {
                    // console.log(rows[0].has_played);
                    hasPlayed = rows[0].has_played;
                    result.hasPlayed = !!+hasPlayed; // Converts int to boolean
                    hasWon = rows[0].has_won;
                    result.hasWon = !!+hasWon; // Converts int to boolean
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
    console.log('DemoServiceStatus listening on port ' + port);
});
