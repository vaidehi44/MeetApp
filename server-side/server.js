const express = require('express');
const app = express();
const server = require('http').createServer(app);
const cors = require('cors');

const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ['GET', 'POST']
    }
})

app.use(cors());

app.get('/', (req, res) => {
    res.send('Backend server is running here.');
});

const users = {}// { roomId: [ {userId, userName }] }

io.on("connection", (socket) => {

    socket.on("join-room", (data) => {
       if (users[data.roomId]) {
        users[data.roomId].push( { "userName": data.userName, "userId": data.userId } );
       }else {
           users[data.roomId] = [{ "userName":data.userName, "userId": data.userId}];
       }
       socket.join(data.roomId);

       socket.to(data.roomId).emit("user-connected", data.userId);
       console.log("User ",data.userName, "with id - ",data.userId,  "joined room - ", data.roomId);
    });

    socket.on("getAllUsers", (roomId) => {
        io.in(roomId).emit("all-users", users[roomId]);
        console.log('sent all users',users[roomId]);
    });

    socket.on("disconnect", (roomId, userId) => {
        socket.to(roomId).emit("user-disconnected", userId);
    })
})


const PORT = process.env.PORT || 5000;
server.listen(PORT, (req, res) => console.log(`Server running on port - ${PORT}`));


