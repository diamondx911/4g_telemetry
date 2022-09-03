const socket = io("ws://192.168.193.238:5000");


const interval = setInterval(function() {
   // send a message to the server
    socket.emit("hello", (response) => {
      document.getElementById("altitude").textContent = response.altitude;
      document.getElementById("gps count").textContent = response.num_satellite;
      document.getElementById("airspeed").textContent = response.airspeed;
      document.getElementById("Hdop").textContent = response.hdop;
      document.getElementById("mode").textContent = response.mode;
      document.getElementById("battery").textContent = response.battery;
    
      
      
    //console.log(socket.id.substring(0,2)); // "got it"
});
 }, 500);


 const logging = setInterval(function() {
  // send a message to the server
   socket.emit("doLOGGING", (response) => {
    //const para = document.createElement("p");
    //const node = document.createTextNode(response.logging_message);
    //para.appendChild(node);
    //document.getElementById("logging").appendChild(para);
    var element = document.getElementById("logging");
    element.scrollIntoView({behavior:"smooth",block:"end"});
    var bit = response.logging_message.join('\n');
    document.getElementById("logging").innerText = bit;
    //console.log(response.logging_message.join('\n'));
});
}, 1500);

function myRtl() {
  socket.emit("doRTL", (response) => {
    console.log(response);
});
}

function myTAKEOFF() {
  socket.emit("doTAKEOFF", (response) => {
    console.log(response);
});
}

function myGUIDED() {
  console.log("clicked");
  socket.emit("doGUIDED", (response) => {
    console.log(response);
});
}

function myLOITER() {
  socket.emit("doLOITER", (response) => {
    console.log(response);
});
}

function myAUTO() {
  socket.emit("doAUTO", (response) => {
    console.log(response);
});
}



// receive a message from the server
socket.on("connect", (arg, callback) => {
  console.log("Client Connected"); // "world"
});




/* change progress after 1 second (only for showcase) */




