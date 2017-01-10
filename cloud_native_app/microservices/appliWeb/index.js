var express = require('express');
var app = express();
var path = require('path');
var http = require("http");


function getOptionsDNS(serviceName){
    return {
        host: 'localhost',
        port: '8500',
        path: '/v1/catalog/service/'+serviceName,
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    };
}

function httpRequest(options, onResult,onError)
{
    var req = http.request(options, function(res)
    {
        var output = '';
        console.log(options.host + ':' + res.statusCode);
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function() {
            var obj = JSON.parse(output);
            onResult(res.statusCode, obj);
        });
    });
    req.on('error', onError);
    req.end();
};



app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/play/:id', function(req, res) {

    console.log('play : '+req.params.id);

    var treatement = function(status,obj){
        if(obj!=null && obj.length > 0){
            var id = req.params.id;
            var options = {
                host: obj[0]["Address"],
                port: obj[0]["ServicePort"],
                path: '/play/'+id,
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            };
        }            
        httpRequest(options, function(status,obj){res.send(obj)}, function(error){console.log("error1")})
    }
    httpRequest(getOptionsDNS('b'), treatement, function(error){console.log("error2")})
});

app.use(express.static(__dirname));

console.log('Server up and running on http://localhost:3000/');
app.listen(3000);