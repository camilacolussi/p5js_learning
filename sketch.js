let socket; // global variable to hold the socket connection
let slider;

function setup() {
  createCanvas(windowWidth, windowHeight);
 
  slider = createSlider(0, 255, 100);
  slider.position(10, 10);
  slider.style('width', '80px');
  
  
  //open a socket connection to the server.
  //we need the address of the server on the web (the URL) that we want to connect to.
  socket = io.connect('https://developing-shining-dew.glitch.me/');
  
  // Specify a function to call every time 'mousedata'
  // packets are received over the socket
  //listen for data coming from the server indicating that other people are also interacting with the application
  // this is a callback function to be run every time a ‘mousedata’ message is received on the socket. 
  socket.on('mousedata', //on()’ function, allows us to declare a function to run every time a packet of data with a given name is received. 
    function(data) {
      // When we receive data draw a blue circle
      console.log("Got: " + data.x + " " + data.y);
    
      fill(0, 0, 255);
      noStroke();
      ellipse(data.x, data.y, 80, 80);
    }
  );
}

function draw() {
}

function mouseDragged() {
  let val = slider.value();
  
  // User is drawing a circle
    let r = val;
    let g = 30;
    let b = 100;
    let size = 50;
  fill(r, g, b);
  noStroke();
  ellipse(mouseX, mouseY, size, size);
  
    // Send the mouse data to the server
  // call sendMouseData function to send the current mouse position every time we draw a circle.
  sendMouseData(mouseX, mouseY); 
}

// Function for sending data to the socket
//send a packet of data to the server every time we draw a circle with the mouse. 
//This packet of data will be a JavaScript object containing the x and y position for the circle. 
function sendMouseData(xpos, ypos) {
  console.log("sendmouse: " + xpos + " " + ypos);
 
  // Make a JS object with the x and y data
  const data = {
    x: xpos,
    y: ypos
  };
 
  // Send that object to the socket
  //each packet of data sent using socket.emit has a name, in this case ‘mousedata’. 
  //This can be used to tell the server what type of data it is, so that it can do different things with different types of data.
  socket.emit('mousedata', data);
}