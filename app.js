const express = require("express");
const app = express();
const path = require("path");

const http = require("http");

const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname + "/public")));

io.on('connection', (socket) => {
    socket.on('send-location', (data) => {
        console.log("Location received:", data);
        socket.broadcast.emit('recieve-location', {
            id: socket.id,
            latitude: data.latitude,
            longitude: data.longitude
        });
    });
});

app.get("/", function(req, res) {
    res.render("index");
});

app.listen(3000);