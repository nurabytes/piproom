var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server)
var mysql = require('mysql')
var trans = []
var isInitTrans = true
var curs = []
var isInitCurs = true
var figs = []
var isInitFigs = true
var stps = []
var isInitStps = true
var lmts = []
var isInitLmts = true


users = [];
connections = [];

var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'bluestork3308',
    database: 'piproom'
});

db.connect(function(err){
    if (err) console.log(err)
})


server.listen(process.env.PORT || 3000  );
console.log('Server running...');

app.use('/semantic',express.static(__dirname + '/semantic'));
app.use('/css',express.static(__dirname + '/css'));
app.use('/sounds',express.static(__dirname + '/sounds'));
app.use('/js',express.static(__dirname + '/js'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);

    socket.on('disconnect', function (data) {
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets connected', connections.length);
    });

    socket.on('send transaction', function (data) {
        console.log(data);
        io.sockets.emit('new transaction', {msg:data});
        db.query('INSERT INTO trans (tran) VALUES (?)', data)
    });

    socket.on('send currency', function (data) {
        console.log(data);
        io.sockets.emit('new currency', {msg:data});
        db.query('INSERT INTO curs (cur) VALUES (?)', data)        
    });

    socket.on('send figure', function (data) {
        console.log(data);
        io.sockets.emit('new figure', {msg:data});
        db.query('INSERT INTO figs (fig) VALUES (?)', data)         
    });

    socket.on('send limit', function (data) {
        console.log(data);
        io.sockets.emit('new limit', {msg:data});
        db.query('INSERT INTO lmts (lmt) VALUES (?)', data)         
    });

    socket.on('send stop', function (data) {
        console.log(data);
        io.sockets.emit('new stop', {msg:data});
        db.query('INSERT INTO stps (stp) VALUES (?)', data)         
    });

    if (isInitTrans === true) {
        db.query('SELECT * FROM trans')
            .on('result', function(data){
                trans.push(data)
            })
            .on('end', function(){
                socket.emit('initial trans', trans)
            })
 
        isInitTrans = true
    } 


    if (isInitCurs === true) {
        db.query('SELECT * FROM curs')
            .on('result', function(data){
                curs.push(data)
            })
            .on('end', function(){
                socket.emit('initial curs', curs)
            })
 
        isInitCurs = true
    } 


    if (isInitFigs === true) {
        db.query('SELECT * FROM figs')
            .on('result', function(data){
                figs.push(data)
            })
            .on('end', function(){
                socket.emit('initial figs', figs)
            })
 
        isInitFigs = true
    } 


    if (isInitLmts === true) {
        db.query('SELECT * FROM lmts')
            .on('result', function(data){
                lmts.push(data)
            })
            .on('end', function(){
                socket.emit('initial lmts', lmts)
            })
 
        isInitLmts = true
    } 


    if (isInitStps === true) {
        db.query('SELECT * FROM stps')
            .on('result', function(data){
                stps.push(data)
            })
            .on('end', function(){
                socket.emit('initial stps', stps)
            })
 
        isInitStps = true
    } 

});