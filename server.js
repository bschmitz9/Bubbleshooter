var http = require('http');
var fs = require('fs');
var path = require('path');

var  mimes = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".png": "image/png",
    ".mp3": "audio/mpeg"
};

var server = http.createServer(function (request, response){
    var filePath = (request.url === '/') ? ('./index.html') : ('.' + request.url);
    var contentType = mimes[path.extname(filePath)];

   fs.exists(filePath, function (file_exists){
        if(file_exists){
            fs.readFile(filePath, function (error, content){
                if(error){
                    response.writeHead(500);
                    response.end();
                } else {
                    response.writeHead(200, {'Content-Type' : contentType});
                    response.end(content, 'utf-8');
                }
            });
        } else {
            response.writeHead(404);
            response.end('No file');
        }
    });
}).listen(8000, function (){
    console.log('on 8000');
});