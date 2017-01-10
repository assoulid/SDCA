var express = require('express');
var app = express();
var path = require('path');
var request = require("request")


var DNSAddr = "http://localhost:8500/v1/catalog/service/"



app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/play/:id', function(req, res) {

    console.log('play : '+req.params.id);
    var id = req.params.id;
    request(DNSAddr + "b", function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body); // Show the HTML for the Modulus homepage.
            if(body && body.length > 0){
                var addrB = body[0]["Address"]
                var portB = body[0]["ServicePort"]
                request('http://'+addrB+":"+portB+'/play/'+id, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        console.log(body); // Show the HTML for the Modulus homepage.
                        res.send(body)
                    }else{
                        console.log(error)
                        res.send(error)
                    }
                });
            }
        }else{
            console.log(error)
            res.send(error)
        }
    });
});

app.get('/login/:id/:password', function(req, res) {

    console.log('login : '+req.params.name+ ' '+ req.params.password);
    var name = req.params.name
    var password = req.params.password
    request(DNSAddr + "i", function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body); // Show the HTML for the Modulus homepage.
            if(body && body.length > 0){
                var addrI = body[0]["Address"]
                var portI = body[0]["ServicePort"]
                request('http://'+addrI+":"+portI+'/login/'+name+'/'+password, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        console.log(body); // Show the HTML for the Modulus homepage.
                        res.send(body)
                    }else{
                        console.log(error)
                        res.send(error)
                    }
                });
            }
        }else{
            console.log(error)
            res.send(error)
        }
    });
});


app.get('/status/:id', function(req, res) {

    console.log('status : '+req.params.id);
    var id = req.params.id;
    request(DNSAddr + "s", function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body); // Show the HTML for the Modulus homepage.
            if(body && body.length > 0){
                var addrS = body[0]["Address"]
                var portS = body[0]["ServicePort"]
                request('http://'+addrS+":"+portS+'/status/'+id, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        console.log(body); // Show the HTML for the Modulus homepage.
                        res.send(body)
                    }else{
                        console.log(error)
                        res.send(error)
                    }
                });
            }
        }else{
            console.log(error)
            res.send(error)
        }
    });
});


app.get('/picture/:id', function(req, res) {

    console.log('picture : '+req.params.id);
    var id = req.params.id;
    request(DNSAddr + "p", function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body); // Show the HTML for the Modulus homepage.
            if(body && body.length > 0){
                var addrP = body[0]["Address"]
                var portP = body[0]["ServicePort"]
                request('http://'+addrP+":"+portP+'/'+id, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        console.log(body); // Show the HTML for the Modulus homepage.
                        res.send(body)
                    }else{
                        console.log(error)
                        res.send(error)
                    }
                });
            }
        }else{
            console.log(error)
            res.send(error)
        }
    });
});


app.use(express.static(__dirname));

console.log('Server up and running on http://localhost:3000/');
app.listen(3000);