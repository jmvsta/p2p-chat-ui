const static1 = require('node-static');
const http = require('http');

const file = new(static1.Server)();
const app = http.createServer(function (req, res) {
    file.serve(req, res);
}).listen(8181, '0.0.0.0');

const { Server } = require('socket.io');
const io = new Server(app, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})

io.sockets.on('connection', function (socket){
    console.log('S --> a user connected');
    socket.on('message', function (message) {
        console.log(`S --> got message:  ${message}`);
        socket.broadcast.to(message.channel).emit('message', message);
    });
    socket.on('create or join', async function (room) {
        const socketsInRoom = await io.in(room).fetchSockets();
        const numClients = socketsInRoom.length;
        console.log('S --> Room ' + room + ' has ' + numClients + ' client(s)');
        console.log('S --> Request to create or join room', room);
        if (numClients === 0){
            socket.join(room);
            socket.emit('created', room);
        } else if (numClients === 1) {
            io.sockets.in(room).emit('join', room);
            socket.join(room);
            socket.emit('joined', room);
        } else {
            socket.emit('full', room);
        }
    });
    // function log(){
    //     const array = [">>> "];
    //     for (let i = 0; i < arguments.length; i++) {
    //         array.push(arguments[i]);
    //     }
    //     socket.emit('log', array);
    // }
});