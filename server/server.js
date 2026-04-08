import 'dotenv/config'
import app from "./src/app.js"
import connecttodb from './src/config/database.js'
import http from 'http'
import { initSocket } from './src/socket/server.socket.js'

const httpServer=http.createServer(app)
initSocket(httpServer)
connecttodb()
httpServer.listen(3000,()=>{
    console.log('Server running on port 3000')
})