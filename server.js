var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session')
var mysql = require('mysql');
var trans = [];
var curs = [];
var figs = [];
var stps = [];
var lmts = [];
var times = [];

app.use(bodyParser());
app.use(cookieParser('shhhh, very secret'));
app.use(session());


//// ADMIN LOGIN

function restrictAdmin(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.session.error = 'Access denied!';
    res.redirect('/admin-login');
  }
}

app.post('/admin-login', function(request, response) {
 
    var username = request.body.username;
    var password = request.body.password;
 
    if(username == 'pipmaster' && password == 'pipmaster@2017'){
        request.session.regenerate(function(){
        request.session.user = username;
        response.redirect('/admin');
        });
    }
    else {
       response.redirect('admin-login');
    }    
});

app.get('/admin-logout', function(request, response){
    request.session.destroy(function(){
        response.redirect('/admin-login');
    });
});


// USER LOGIN

function restrict(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.session.error = 'Access denied!';
    res.redirect('/login');
  }
}

app.post('/login', function(request, response) {
 
    var username = request.body.username;
    var password = request.body.password;
 
    if(username in {priority1:1, priority2:1, priority3:1, priority4:1, priority5:1, priority6:1, priority7:1, priority8:1, priority9:1, priority10:1} 
        && password in {priority01:1, priority02:1, priority03:1, priority04:1, priority05:1, priority06:1, priority07:1, priority08:1, priority09:1, priority010:1}){
        request.session.regenerate(function(){
        request.session.user = username;
        response.redirect('/room');
        });
    }
    else {
       response.redirect('login');
    }    
});

app.get('/logout', function(request, response){
    request.session.destroy(function(){
        response.redirect('/login');
    });
});


users = [];
connections = [];

var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'bluestork3308',
    database: 'piproom'
});

db.connect(function(err) {
    if (err) console.log(err)
});


server.listen(process.env.PORT || 3001);
console.log('Server running...');

app.use('/semantic', express.static(__dirname + '/semantic'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/sounds', express.static(__dirname + '/sounds'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/fonts', express.static(__dirname + '/fonts'));
app.use('/img', express.static(__dirname + '/img'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/landing.html');
});

app.get('/landing', function(req, res) {
    res.sendFile(__dirname + '/landing.html');
});

app.get('/admin', restrictAdmin, function(req, res) {
    res.sendFile(__dirname + '/admin.html');
});

app.get('/room', restrict, function(req, res) {
    res.sendFile(__dirname + '/room.html');
});

app.get('/admin-login', function(req, res) {
    res.sendFile(__dirname + '/admin-login.html');
});

app.get('/login', function(req, res) {
    res.sendFile(__dirname + '/login.html');
});

io.sockets.on('connection', function(socket) {
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);

    socket.on('disconnect', function(data) {
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets connected', connections.length);
    });

    socket.on('send time', function(data) {
        console.log(data);
        io.sockets.emit('new time', {
            msg: data
        });
        db.query('INSERT INTO times (time) VALUES (?)', data)
    });

    socket.on('send transaction', function(data) {
        console.log(data);
        io.sockets.emit('new transaction', {
            msg: data
        });
        db.query('INSERT INTO trans (tran) VALUES (?)', data)
    });

    socket.on('send currency', function(data) {
        console.log(data);
        io.sockets.emit('new currency', {
            msg: data
        });
        db.query('INSERT INTO curs (cur) VALUES (?)', data)
    });

    socket.on('send figure', function(data) {
        console.log(data);
        io.sockets.emit('new figure', {
            msg: data
        });
        db.query('INSERT INTO figs (fig) VALUES (?)', data)
    });

    socket.on('send limit', function(data) {
        console.log(data);
        io.sockets.emit('new limit', {
            msg: data
        });
        db.query('INSERT INTO lmts (lmt) VALUES (?)', data)
    });

    socket.on('send stop', function(data) {
        console.log(data);
        io.sockets.emit('new stop', {
            msg: data
        });
        db.query('INSERT INTO stps (stp) VALUES (?)', data)
    });

    socket.on('clear history', function(data) {
        io.sockets.emit('delete history')
        db.query('TRUNCATE TABLE curs');
        db.query('TRUNCATE TABLE figs');
        db.query('TRUNCATE TABLE lmts');
        db.query('TRUNCATE TABLE stps');
        db.query('TRUNCATE TABLE times');
        db.query('TRUNCATE TABLE trans');    
    });

    db.query('SELECT * FROM trans')
        .on('result', function(data) {
            trans.push(data);
            socket.emit('initial trans', trans);
            trans.pop(data);
        });


    db.query('SELECT * FROM curs')
        .on('result', function(data) {
            curs.push(data)
            socket.emit('initial curs', curs)
            curs.pop(data)
        });


    db.query('SELECT * FROM figs')
        .on('result', function(data) {
            figs.push(data)
            socket.emit('initial figs', figs)
            figs.pop(data)
        });


    db.query('SELECT * FROM lmts')
        .on('result', function(data) {
            lmts.push(data)
            socket.emit('initial lmts', lmts)
            lmts.pop(data)
        });


    db.query('SELECT * FROM stps')
        .on('result', function(data) {
            stps.push(data)
            socket.emit('initial stps', stps)
            stps.pop(data)
        });

    db.query('SELECT * FROM times')
    .on('result', function(data) {
        times.push(data);
        socket.emit('initial times', times);
        times.pop(data);
    });
        
});