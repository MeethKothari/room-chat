const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
let port = 8082 || 8080;



app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
        methods: ["POST", "GET"]
    }
});


io.on("connection", (socket) => {
    console.log(`User Connected : ${socket.id}`);


    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
    })


    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data)
    })


    socket.on("disconnect", () => {
        console.log(`User Disconnected : ${socket.id}`)
    })
})




server.listen( port, () => {
    console.log(`Server running on port: ${port}`)
})








