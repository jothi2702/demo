  
'use strict';

const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');

const init = async () => {

    const server = Hapi.server({
        port: (process.env.PORT || process.env.serverPort),
        host: process.env.serverHost
    });

    await server.register(Inert);

    server.route({
        method: 'GET',
        path: '/',
        handler: { file: 'index.html' }
    });

    server.route({
        method: 'GET',
        path: '/qr',
        handler: { file: 'qr.html' }
    });

    server.route({
        method: 'POST',
        path: '/notifyClient',
        handler: () => {

        }
    });

    const io = require('socket.io')(server.listener);

    io.on('connection', function (socket) {
        console.log("user connected");
        // Subscribe this socket to `action` events
        socket.on('postMessage', function (action) {
            console.log("action", action);
            io.emit('postMessageToQR', action);
        });
    });

    await server.start();

    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
