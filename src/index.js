import path from 'path';
import http from 'http'
import { fileURLToPath } from 'url';

import express from "express"
import { Server } from 'socket.io'

import { Filter } from '../utils/bad-words.js'
import { generateMessage, generateLocationMessage } from '../utils/messages.js';

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
    socket.join('join', ({ name, room }) => {
        socket.emit('message', generateMessage('Welcome!'))
        socket.broadcast.to(room).emit('message', `${name} has joined!`)
    })

    socket.on('sendMsg', (msg, callback) => {
        const filter = new Filter()
        if (filter.isProfane(msg)) {
            return callback('No bad words!') 
        }
        
        io.emit('message', generateMessage(msg))
        callback()
    })

    socket.on('location', (location, callback) => {
        io.emit('locationMessage', generateLocationMessage(`https://google.com/maps/?q=${location.latitude},${location.longitude}`))
        callback('Location shared')
    })

    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A user has left'))
    })
})

// Setup static directories
app.use(express.static(website_path))

httpServer.listen(port, () => {
    console.log(`Express server started on port ${port}`)
})