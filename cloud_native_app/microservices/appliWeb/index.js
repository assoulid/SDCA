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
/*
    var treatement = function(status,obj){
        if(obj!=null && obj.length > 0){
            var id = req.params.id;
            console.log(obj[0]["Address"]+':'+obj[0]["ServicePort"]+'/'+id)
            var options = {
                host: obj[0]["Address"],
                port: obj[0]["ServicePort"],
                path: '/play/'+id,
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            };
        }            
        httpRequest(options, function(status,obj){res.send(obj)}, function(error){console.log(JSON.stringify(error))})
    }
    var optionsDns = getOptionsDNS('b');
    console.log("http : "+JSON.stringify(optionsDns))
    httpRequest(getOptionsDNS('b'), treatement, function(error){console.log(JSON.stringify(error))})

*/
    request(DNSAddr + "b", function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body); // Show the HTML for the Modulus homepage.
            if(b && b.length > 0){
                var addrB = b[0]["Address"]
                var portB = b[0]["ServicePort"]
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
        }
    });


});

app.use(express.static(__dirname));

console.log('Server up and running on http://localhost:3000/');
app.listen(3000);