var http    = require("http");
var mysql      = require('mysql');
var url        = require('url');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'prestashop'
});


connection.connect(function(err){
	if(!err) {
		console.log("Database is connected ... nn");    
	} else {
	    	console.log("Error connecting database ... nn");    
	}
});

var serveur = http.createServer(function(req,res){
	var requete = url.parse(req.url).pathname;
	requete = requete.substring(1)
	console.log(requete); 
	console.log(parseInt(requete,10));
	if (!isNaN(parseInt(requete,10)) ){
		connection.query('SELECT * from has_played WHERE id_profile=' + requete, function(err, rows, fields) {
			connection.end();
			if (!err){
				console.log('The solution is: ', rows);
				res.end('The solution is OK.\n');
			} else {
				console.log('Error while performing Query.');
				res.end('Error while performing Query.\n');
			}
		});
	} else 
		//si l'url n'est pas de la forme /i
		res.end('Error while performing Query (url non valide)\n');
});




serveur.listen(3000);
