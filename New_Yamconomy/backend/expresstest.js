var express = require('express');
var fs = require('fs');
var app = express();
var indexrouter = require('./index.ejs');

app.use(express.static('public'));

app.use('/index', indexrouter);
app.get('/', function(req, res){
   res.send('/index.html');
});

app.get('/register', function(req, res) {
	res.send('/register.html');
});
 
var server = app.listen(80, function () {
   console.log("Example app listening")
});
console.log('Server Start');

