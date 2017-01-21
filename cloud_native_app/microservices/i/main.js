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

        request("http://localhost:8500/v1/health/service/mysql", function (error, response, body) {
            console.log(body);

            var service_health_info = JSON.parse(body);

            var passing_hosts = service_health_info.filter(function (x) {
                return x["Checks"].filter(function (y) {
                        return ((y["ServiceName"] === "mysql") && (y["Status"] === "passing"))
                    }).length != 0
            });

            console.log(passing_hosts)

            if (error) {
                console.log(error)
            }
            else {
                host = passing_hosts[0].Node.Address;
                port = passing_hosts[0].Service.Port;

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
                                res.end(JSON.stringify({error: 'Pas de correspondance'}));
                            } else {
                                console.log('The solution is: ', rows);
                                res.end(JSON.stringify(rows));
                            }
                        } else {
                            console.log({error: 'Error while performing Query.'});
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
