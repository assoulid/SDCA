var http = require("http");
var mysql = require('mysql');
var url = require('url');
var qs = require('querystring');
var request = require('request');
var host = '';
var port = '';

console.log(" test", host, port, "\n");


var serveur = http.createServer(function (req, res) {
    if (req.method === 'POST') {

        request("http://localhost:8500/v1/catalog/service/mysql", function (error, response, body) {

            console.log(body);

            if (error) {
                console.log(error)
            }
            else {
                host = JSON.parse(body)[0]["Address"];
                port = JSON.parse(body)[0]["ServicePort"];

                console.log(host, port, "\n");

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

                var body = '';
                req.on('data', function (data) {
                    body += data;
                });
                req.on('end', function () {
                    var parsedbody = qs.parse(body);
                    var reqSQL = "SELECT * from ps_customer WHERE email='" + parsedbody['login'] + "' AND passwd='" + parsedbody['password'] + "'";
                    console.log(reqSQL);
                    connection.query(reqSQL, function (err, rows, fields) {
                        connection.end();
                        if (!err) {
                            if (rows.length == 0) {
                                console.log('Pas de correspondance: ' + parsedbody['login'] + "/" + parsedbody['password']);
                                res.end('Pas de correspondance.\n');
                            } else {
                                console.log('The solution is: ', rows);
                                res.end(JSON.stringify(rows));
                            }
                        } else {
                            console.log('Error while performing Query.');
                            res.end(err);
                        }
                    });
                });
            }

        });
    } else {
        res.end('La requete doit être une requète POST\n');
    }
});

serveur.listen(3000);
