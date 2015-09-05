var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(serveStatic(__dirname)).listen(8080);

console.log('Server started on port 8080\nPress Ctrl-C to terminate');
