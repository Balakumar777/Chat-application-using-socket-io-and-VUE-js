const  express = require('express');
const { MongoClient } = require('mongodb');
const { selectAll, insertRecord, deleteRecord, updateRecord, selectById, selectUserMessages, removeMessages } = require('./rest.js');
const bodyParser = require('body-parser');
const path = require('path');
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(path.resolve(), "public")))
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        credentials: false
    } });

const dbName = "test";
const client = new MongoClient(`mongodb://localhost:27017/${dbName}`);
const userTableName = "users";
const chatTableName = "chat";
const chatTableMapName = "chatMap";
let collectionUser, collectionChat, collectionChatMap = null;
let users = [];

io.on("connection",(socket)=>{
    io.sockets.emit('connected', socket.connected);
    socket.on("userJoined",(data)=>{
        if(!users.includes(data))
            users.push(data);
        io.sockets.emit("userJoined", users);
    })

    socket.on("getUsers",(data)=>{
        io.sockets.emit("userJoined", users);
    })

    socket.on("removeUser",(data)=>{
        if (users.includes(data))
            users.splice(users.indexOf(data),1);
        io.sockets.emit("userJoined", users);
    })

    socket.on("message",async(data)=>{
        if (collectionChat) {
            await collectionChat.insertOne(JSON.parse(data));
            io.sockets.emit("message", data);
        }
    })

    socket.on("typing",(data)=>{
        io.sockets.emit("typing", data);
    })
});

app.post("/selectUserMessages", (req, res) => {
    exportResult(selectUserMessages, req, res, collectionChat);
});

app.post("/removeMessages", (req, res) => {
    exportResult(removeMessages, req, res, collectionChat);
});

app.post("/selectUser", (req, res) => {
    exportResult(selectAll, req, res);
});

app.post("/selectUserById", (req, res) => {
    exportResult(selectById, req, res);
});

app.post("/insertUser", (req, res) => {
    exportResult(insertRecord, req, res);
})

app.post("/updateUser", (req, res) => {
    exportResult(updateRecord, req, res);
})

app.post("/deleteUser", (req, res) => {
    exportResult(deleteRecord, req, res);
})

app.get("*", async (req, res) => {
    res.send("Invalid Endpoint Found");
});

function exportResult(send, req, res, collection = collectionUser) {
    try {
        send(collection, req, res)
    } catch (error) {
        res.send("500 internal server error")
    }
}

async function enableConnection() {
    try {
        await client.connect();
        collectionUser = client.db().collection(userTableName);
        collectionChat = client.db().collection(chatTableName);
        collectionChatMap = client.db().collection(chatTableMapName);
    } catch (error) {
        collectionUser = null;
        collectionChat = null;
        collectionChatMap = null;
        new Error("Connection interrupted")
    }
}

enableConnection();
httpServer.listen(8000);
