module.exports = (io) => {
    io.on('connection', (socket) => {
        socket.on('joinRoom', ({roomId, username}) => {
            socket.join(roomId);
        })

        socket.on('leaveRoom', ({roomId}) => {
            socket.leave(roomId);
        })

        socket.on('mix', ({roomId, soundParams}) => {
            socket.to(roomId).emit('mix', soundParams);
        })

        socket.on('start', ({roomId}) => {
            socket.to(roomId).emit('start')
        })

        socket.on('stop', ({roomId}) => {
            socket.to(roomId).emit('stop');
        })
    })
}
