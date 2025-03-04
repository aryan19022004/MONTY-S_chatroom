const express = require("express");
const path = require('path');
const PORT = process.env.PORT || 3000;
const http = require("http");
const { Server } = require("socket.io");
const { v4: uuidv4 } = require("uuid");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.set("view engine", "ejs");
app.set('views',path.resolve('./views'));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index");
});

io.on("connection", (socket) => {
    const userId = uuidv4().slice(0, 5); // Generate a short random user ID
    socket.username = `${userId}`;
    
    // Notify when a user joins
    io.emit("message", { user: "System", text: `${socket.username} joined the chat` });

    // Listen for chat messages
    socket.on("chatMessage", (msg) => {
        io.emit("message", { user: socket.username, text: msg });
    });

    // Notify when a user disconnects
    socket.on("disconnect", () => {
        io.emit("message", { user: "System", text: `${socket.username} left the chat` });
    });
});

server.listen(PORT, () => console.log("Server running on port 3000"));
