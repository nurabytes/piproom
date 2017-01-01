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

    $messageForm.submit(function(e) {
        e.preventDefault();
        socket.emit('send figure', $figure.val());
        $figure.val('');
        socket.emit('send limit', $limit.val());
        $limit.val('');
        socket.emit('send stop', $stop.val());
        $stop.val('');
        socket.emit('send transaction', $transaction.val());
        socket.emit('send currency', $currency.val());
    });


    socket.on('new figure', function(data) {
        $chat.prepend('<div id="pipbox" style="margin-bottom: 0.8em;" class="ui blue inverted link relaxed segment">' + "<p>" + "ENTRY: " + data.msg + "</p>" + '</div>');
    });

    socket.on('new limit', function(data) {
        $(pipbox).append("<p>" + "LIMIT: " + data.msg + "</p>");
    });

    socket.on('new stop', function(data) {
        $(pipbox).append("<p>" + "STOP: " + data.msg + "</p>");
    });

    socket.on('new transaction', function(data) {
        $(pipbox).append("<p>" + "TRANSACTION: " + data.msg + "</p>");
    });

    socket.on('new currency', function(data) {
        $(pipbox).append("<p>" + "CURRENCY: " + data.msg + "</p>");
        $("div").removeAttr('id');
    });

});