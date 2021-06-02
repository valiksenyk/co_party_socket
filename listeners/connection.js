module.exports = (io) => {
    io.on('connection', (socket) => {
        socket.on('joinRoom', ({roomId, username}) => {
            socket.join(roomId);
            updateClientsCount(roomId, io)
        })

        socket.on('leaveRoom', ({roomId}) => {
            updateClientsCount(roomId, io, true);
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

        socket.on('getClientsCountForRoom', ({roomId}) => {
            updateClientsCount(roomId, io);
        })

        function updateClientsCount(roomId, io, isLeaving = false) {
            const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
            io.to(roomId).emit('roomClientsCountUpdate', {count: isLeaving ? clients.length - 1 : clients.length});
        }
    })
}
