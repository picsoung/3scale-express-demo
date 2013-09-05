var express = require('express'),
	Analyser = require('./lib/analyser');
	Client = require('3scale').Client;
    fs = require('fs');
    config = JSON.parse(fs.readFileSync("config.json"));

var app = express();
var analyser = new Analyser();

client = new Client(config['3scale.consumerkey']);

var authenticate = function(request, response, callback){
	var params = request.query;
	var result = false;
	client.authorize({app_id: params['app_id'], app_key: params['app_key']},function(resp){
		if(resp.is_success()){
			callback(null,resp.is_success());
		}else{
			callback(403);
		}
	});
}

app.get('/word/:word',function(req, res) {
    authenticate(req, res, function(err, reply){
        if(err){
           res.send(403, "403 - Unauthorized");
        }
       	res.send(analyser.word(req.params.word));
    });
});

app.get('/sentence/:sentence', function(req, res) {
    authenticate(req, res, function(err, reply){
        if(err){
           res.send(403, "403 - Unauthorized");
        }
        res.send(analyser.sentence(req.params.sentence));
    });
});
 
app.listen(3000);
console.log('Listening    on    port    3000...');