var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

users = [];
connections = [];

server.listen(process.env.PORT || 3002);
console.log('Server running...');

app.use('/semantic', express.static(__dirname + '/semantic'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket) {
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);

    socket.on('disconnect', function(data) {
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets connected', connections.length);
    });

    socket.on('send figure', function(data) {
        console.log(data);
        io.sockets.emit('new figure', {
            msg: data
        });
    });

    socket.on('send limit', function(data) {
        console.log(data);
        io.sockets.emit('new limit', {
            msg: data
        });
    });

    socket.on('send stop', function(data) {
        console.log(data);
        io.sockets.emit('new stop', {
            msg: data
        });
    });

    socket.on('send transaction', function(data) {
        console.log(data);
        io.sockets.emit('new transaction', {
            msg: data
        });
    });

    socket.on('send currency', function(data) {
        console.log(data);
        io.sockets.emit('new currency', {
            msg: data
        });
    });

});