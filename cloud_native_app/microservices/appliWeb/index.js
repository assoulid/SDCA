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
            var bodyParsed = JSON.parse(body)
            if(body && body.length > 0){
                var addrB = bodyParsed[0]["Address"]
                var portB = bodyParsed[0]["ServicePort"]
                var url = 'http://'+addrB+":"+portB+'/play/'+id;
                console.log("Acces à "+url)
                request(url, function (error, response, body) {
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

app.get('/login/:name/:password', function(req, res) {

    console.log('login : '+req.params.name+ ' '+ req.params.password);
    var name = req.params.name
    var password = req.params.password
    console.log("requete DNS : "+DNSAddr + "i")
    request(DNSAddr + "i", function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body); // Show the HTML for the Modulus homepage.
            var bodyParsed = JSON.parse(body)
            if(body && body.length > 0){
                var addrI = bodyParsed[0]["Address"]
                var portI = bodyParsed[0]["ServicePort"]
                var url = 'http://'+addrI+":"+portI;
                console.log("requete I : "+url)
                request( {
                        url: url, 
                        method: 'POST',
                        //Lets post the following key/values as form
                        form: {
                            login: name,
                            password: password
                        }
                    }, 
                    function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            console.log(body); // Show the HTML for the Modulus homepage.
                            res.send(body)
                        }else{
                            console.log(error)
                            res.send(error)
                        }
                    }
                );
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
            var bodyParsed = JSON.parse(body)
            if(body && body.length > 0){
                var addrS = bodyParsed[0]["Address"]
                var portS = bodyParsed[0]["ServicePort"]
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
            var bodyParsed = JSON.parse(body)
            if(body && body.length > 0){
                var addrP = bodyParsed[0]["Address"]
                var portP = bodyParsed[0]["ServicePort"]
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

var port = 80
console.log('Server up and running on port '+port);
app.listen(port);