// Required libraries
const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

// Callback function to handle requests
// req: an object that holds information about request that has been received
// res: an object to be used to return the result of the request
function handleRequest(req, res) {
  // What did we request? Find the path from the request
  let pathname = req.url;
 
  // If blank let's ask for index.html
  if (pathname == "/") {
    pathname = "/index.html";
  }
 
  // Ok what's our file extension
  const ext = path.extname(pathname);
 
  // Map extension to file type
  //look at it to see whether the request is for an .html, .js or .css file (the three standard file types that web pages are made out of).
  const typeExt = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css"
  };
 
  // What is it?  Default to plain text
  const contentType = typeExt[ext] || "text/plain";
 
  // Read the file from disk
  //__dirname’ is a variable that holds the name of the current directory that the script is being run in on the server. 
  fs.readFile(__dirname + pathname,
              
    // Callback function for reading
    function(err, data) {
      // if there is an error return error report
      if (err) {
        res.writeHead(500);
        return res.end("Error loading " + pathname);
      }
      
      // Otherwise, send the data, the contents of the file
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    }
  );
  
}

// Start the server
//‘handleRequest’ is a callback
let server = http.createServer(handleRequest);
const port = process.env.PORT || 3000;
server.listen(port);
console.log('Server started on port ' + port); 

// Setup sockets with the HTTP server
const socketio = require('socket.io');
let io = socketio.listen(server);
console.log("Listening for socket connections");


// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
  // Callback function to call whenever a socket connection is made
  function (socket) {
    // Print message to the console indicating that a new client has connected
    console.log("We have a new client: " + socket.id);
 
    // Specify a callback function to run every time we get a message of
    // type 'mousedata' from the client
    socket.on('mousedata',
      function(data) {
        // Data comes in as whatever was sent, including objects
        console.log("Received: 'mousedata' " + data.x + " " + data.y);
      
        // Send it to all other clients
        socket.broadcast.emit('mousedata', data);
      }
    );
    
    // Specify a callback function to run when the client disconnects
    socket.on('disconnect',
      function() {
        console.log("Client has disconnected");
      }
    );
  }
);