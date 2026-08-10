var express = require('express');
var app = express();
var server = require('http').Server(app);

// Configuración de Socket.io con CORS habilitado
var io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Cargar archivos estáticos del cliente
app.use(express.static('client'));

app.get('/Hola', function(req, res){
    res.status(200).send('hola mundo');
});

var messages = [{
    id: 1,
    text: 'Bienvenido al chat privado de Socket.io Mireya',
    nickname: 'Bot'
}];

io.on('connection', function(socket){
    // Obtener la IP cliente de forma más segura
    var ip = socket.handshake.headers['x-forwarded-for'] || socket.request.connection.remoteAddress;
    console.log('Nueva conexión al Socket con IP/ID: ' + socket.id);

    // Enviar mensajes al usuario que se conecta
    socket.emit('messages', messages);

    // Escuchar cuando se agrega un nuevo mensaje
    socket.on('addmessage', function(data){
        messages.push(data);
        // Transmitir la lista a todos los clientes conectados
        io.sockets.emit('messages', messages);
    });
});

// Iniciar servidor en el puerto 6677
server.listen(6677, function(){
    console.log('El servidor está funcionando en http://localhost:6677');
});