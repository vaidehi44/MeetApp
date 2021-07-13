const express = require('express');
const app = express();
const server = require('http').createServer(app);
const cors = require('cors');
const auth = require('./Auth.js');
const sessionController = require('./session-controller');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Session = require('./models/Session');
require("dotenv").config();


mongoose.connect("mongodb+srv://Vaidehi:VaidehiA@44@meetapp1.7wvfl.mongodb.net/meetappdb?retryWrites=true&w=majority",
{ useNewUrlParser: true, useUnifiedTopology: true } );
const db = mongoose.connection;

db.on('error', () => {
    console.log('Error connecting to db')
});
db.once('open', () => {
    console.log('Connected to meetappdb')
});

const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ['GET', 'POST']
    }
})


app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Backend server is running here.');
});

app.post('/api/register', auth.register);

app.post('/api/login', auth.login);

app.post('/api/sessions-info', auth.verifyToken, sessionController.sendSessionInfo);


const users = {};// { roomId: [ {userId, userName } ] }
const messages = {}; // { roomId: [ { userId, mssg }, ] }
const notes = {}// { roomId: [ { userId, notes }, ] }
const chatroom_users = {};

io.on("connection", (socket) => {

    socket.on("join-room", (data) => {
       if (users[data.roomId]) {
        users[data.roomId].push( { "userName": data.userName, "userId": data.userId } );
       }else {
           users[data.roomId] = [{ "userName":data.userName, "userId": data.userId}];
       }
       if (!messages[data.roomId]) {
           messages[data.roomId] = [];
       }
       socket.join(data.roomId);
       socket.to(data.roomId).emit("user-connected", data.userId);
       console.log("User ",data.userName, "with id - ",data.userId,  "joined room - ", data.roomId);
    });

    socket.on("join-chat-room", (data) => {
        if (chatroom_users[data.roomId]) {
         chatroom_users[data.roomId].push( { "userName": data.userName, "userId": data.userId } );
        }else {
            chatroom_users[data.roomId] = [{ "userName":data.userName, "userId": data.userId}];
        }
        if (!messages[data.roomId]) {
            messages[data.roomId] = [];
        }
        socket.join(data.roomId);
        socket.to(data.roomId).emit("chat-user-connected", data.userId);
        console.log("User ",data.userName, "with id - ",data.userId,  "joined chat room - ", data.roomId);
     });

    socket.on("getAllUsers", (roomId) => {
        io.in(roomId).emit("all-users", users[roomId]);
        //console.log('sent all users',users[roomId]);
    });

    socket.on("getAllChatUsers", (roomId) => {
        io.in(roomId).emit("all-chat-users", chatroom_users[roomId]);
        //console.log('sent all users',users[roomId]);
    });

    socket.on("disconnect-and-save-session", (roomId, userId, dbId, session, notes) => {
        sessionController.saveSession(dbId, session, messages[roomId], notes);
        var index = users[roomId].findIndex(user => user.userId===userId);
        users[roomId].splice(index, 1);
        socket.to(roomId).emit("user-disconnected", userId);
        socket.disconnect();
    });

    socket.on("disconnect-me", (roomId, userId) => {
        var index = users[roomId].findIndex(user => user.userId===userId);
        users[roomId].splice(index, 1);
        console.log("disconnecting me");
        socket.to(roomId).emit("user-disconnected", userId);
        socket.disconnect();
    });

    socket.on("chatroom-disconnect-me", (roomId, userId) => {
        var index = chatroom_users[roomId].findIndex(user => user.userId===userId);
        chatroom_users[roomId].splice(index, 1);
        console.log("disconnecting me");
        socket.to(roomId).emit("chat-user-disconnected", userId);
        socket.disconnect();
    });

    socket.on("send screen", (roomId) => {
        socket.to(roomId).emit("accept screen");
    });

    socket.on("screen unshare", (roomId, userId) => {
        socket.to(roomId).emit("remove shared screen", userId);
    });

    socket.on("send-chat-mssg", (mssg, roomId, userName) => {
        messages[roomId].push({ "author": userName, "message":mssg });
        socket.to(roomId).emit("chat-mssg", mssg, userName);
        console.log("sent chat mssg", messages);

    });

    socket.on("send-chatroom-mssg", (mssg, roomId, userName) => {///for chat room
        messages[roomId].push({ "author": userName, "message":mssg });
        socket.to(roomId).emit("chatroom-chat-mssg", mssg, userName);
        console.log("sent chat mssg in chatroom", messages[roomId]);
    });

    socket.on("get-chatroom-mssg", (roomId) => {
        socket.emit("all-chatroom-mssg", messages[roomId]);
        console.log("sent all mssg in chatroom", messages[roomId]);
    })

})


const PORT = process.env.PORT || 5000;
server.listen(PORT, (req, res) => console.log(`Server running on port - ${PORT}`));


