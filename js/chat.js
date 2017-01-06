$(function() {
    var socket = io.connect();
    var $messageForm = $('#messageForm');
    var $figure = $('#figure');
    var $limit = $('#limit');
    var $stop = $('#stop');
    var $transaction = $('#transaction');
    var $currency = $('#currency');
    var $chat = $('#chat');
    var $pipbox = $('#pipbox');
    var $transac = $('#transac');
    var mySound = new Audio('/sounds/bell.mp3');
    mySound.load();


    $messageForm.submit(function(e) {
        e.preventDefault();
        socket.emit('send transaction', $transaction.val());
        socket.emit('send currency', $currency.val());
        socket.emit('send figure', $figure.val());
        $figure.val('');
        socket.emit('send limit', $limit.val());
        $limit.val('');
        socket.emit('send stop', $stop.val());
        $stop.val('');
    });


    socket.on('new transaction', function(data) {
        $chat.prepend('<div id="pipbox" style="margin-bottom: 0.8em;" class="ui blue inverted link relaxed segment">' + "<h2 id='transac' class='ui center aligned header'>" + data.msg + "&nbsp;&nbsp;" + "</h2>" + '</div>');
    });

    socket.on('new currency', function(data) {
        $(transac).append(data.msg);
        $("h2").removeAttr('id');
    });

    socket.on('new figure', function(data) {
        $(pipbox).append("<center><h4 id='figs'>" + "ENTRY: " + data.msg);
    });

    socket.on('new limit', function(data) {
        $(figs).append("&nbsp;&nbsp;&nbsp;&nbsp;LIMIT: " + data.msg);
    });

    socket.on('new stop', function(data) {
        $(figs).append("&nbsp;&nbsp;&nbsp;&nbsp;STOP: " + data.msg + "</h4></center");
        $("h4").removeAttr('id');
        $("div").removeAttr('id');
        $('#submit').prop("disabled", true);
        mySound.play();
    });

    ////


    // Initial set of notes, loop through and add to list
    socket.on('initial trans', function(data) {
        var html = ''
        for (var i = 0; i < data.length; i++) {
            // We store html as a var then add to DOM after for efficiency
            html += '<p>' + data[i].tran + '</p>'
        }
        $('#notes').append(html)
    })

    // // Initial set of notes, loop through and add to list
    // socket.on('initial curs', function(data) {
    //     var html = ''
    //     for (var i = 0; i < data.length; i++) {
    //         // We store html as a var then add to DOM after for efficiency
    //         html += '<p>' + data[i].cur + '</p>'
    //     }
    //     $('#notes').append(html)
    // })

    // // Initial set of notes, loop through and add to list
    // socket.on('initial figs', function(data) {
    //     var html = ''
    //     for (var i = 0; i < data.length; i++) {
    //         // We store html as a var then add to DOM after for efficiency
    //         html += '<p>' + data[i].fig + '</p>'
    //     }
    //     $('#notes').append(html)
    // })

    // // Initial set of notes, loop through and add to list
    // socket.on('initial lmts', function(data) {
    //     var html = ''
    //     for (var i = 0; i < data.length; i++) {
    //         // We store html as a var then add to DOM after for efficiency
    //         html += '<p>' + data[i].lmt + '</p>'
    //     }
    //     $('#notes').append(html)
    // })

    // // Initial set of notes, loop through and add to list
    // socket.on('initial stps', function(data) {
    //     var html = ''
    //     for (var i = 0; i < data.length; i++) {
    //         // We store html as a var then add to DOM after for efficiency
    //         html += '<p>' + data[i].stp + '</p>'
    //     }
    //     $('#notes').append(html)
    // })

});