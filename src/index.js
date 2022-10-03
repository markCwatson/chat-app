import path from 'path';
import http from 'http'
import { fileURLToPath } from 'url';

import express from "express"
import { Server } from 'socket.io'

import { Filter } from '../utils/bad-words.js'
import { generateMessage, generateLocationMessage } from '../utils/messages.js';
import { addUser, removeUser, getUser, getUsersInRoom } from '../utils/users.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const website_path = path.join(__dirname, '../public')
const port = process.env.PORT

const app = express()
const httpServer = http.createServer(app)

const io = new Server(httpServer, {
    // ...
})

io.on("connection", (socket) => {
    console.log(`New connestion on socket ${socket.id}`)

    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room })

        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message', generateMessage('Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage(user.username, `${user.username} has joined!`))
        
        io.to(user.room).emit('population', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()
    })

    socket.on('sendMsg', (msg, callback) => {
        const filter = new Filter()

        if (filter.isProfane(msg)) {
            return callback('No bad words!') 
        }
        
        const user = getUser(socket.id)

        if (!user) {
            callback({ error: 'No user!' })
        }

        io.to(user.room).emit('message', generateMessage(user.username, msg))
        callback()
    })

    socket.on('location', (location, callback) => {
        const user = getUser(socket.id)

        if (!user) {
            callback({ error: 'No user!' })
        }

        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps/?q=${location.latitude},${location.longitude}`))
        callback('Location shared')
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateMessage(`${user.username} has left the room.`))

            io.to(user.room).emit('population', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})

// Setup static directories
app.use(express.static(website_path))

httpServer.listen(port, () => {
    console.log(`Express server started on port ${port}`)
})