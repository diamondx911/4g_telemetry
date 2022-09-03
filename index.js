const express = require('express')
const app = express();
var cors = require('cors')
const fs = require('fs')
var http = require('http').Server(app);
const io = require('socket.io')(http);
var bodyParser = require('body-parser');
var ProgressBar = require('progressbar.js');
const port = 3000;
app.set('view engine', 'ejs');

// start capture
const videoStream = require('./videoStream');
videoStream.acceptConnections(app, {
        width: 320,
        height: 180,
        fps: 23,
        encoding: 'JPEG',
        quality: 10 // lower is faster, less quality
    }, 
    '/stream.mjpg', true);

app.use(express.static(__dirname+'/public'));
app.use(express.static(__dirname+'/views'));

app.get('/', function(req, res){

	res.render('index.ejs')

});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

io.on('connection',function(socket){
    console.log('connected');
});
  


app.listen(port, () => console.log(`Example app listening on port ${port}! In your web browser, navigate to http://<IP_ADDRESS_OF_THIS_SERVER>:3000`));
