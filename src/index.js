import path from 'path';
import http from 'http'
import { fileURLToPath } from 'url';

import express from "express"
import { Server } from 'socket.io'


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
    console.log('connection')

    socket.emit('message', 'Welcome!')

    socket.on('sendMsg', (msg) => {
        io.emit('message', msg)
    })
  })

// Setup static directories
app.use(express.static(website_path))

httpServer.listen(port, () => {
    console.log(`Express server started on port ${port}`)
})