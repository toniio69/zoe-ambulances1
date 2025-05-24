var tls = require('tls');
var fs = require('fs');

const port = 5501;
const host = '127.0.0.1';

var options ={
    key: fs. readFilesync('private-key.pem'),
    cert: fs.readFilesync('public-cert.pem')

};

var server = tls.createServer(options, function(socket) {
    socket.write("hello.");
    socket.on('data', function(data){
        console.log('Received: %s[it is %d bytes long]',
            data.toString().replace(/(\n)/gm,""),
            data.length);
    });
    socket.on('end', function(){
        console.log('EOT (End Of Tranmission)')
    });
});

server.listen(port,host, function(){
    console.log("I'm listening at %s on port %s, host,port");
});

server.on('error', function(error) {
    console.error(error);

    server.destroy();
});
