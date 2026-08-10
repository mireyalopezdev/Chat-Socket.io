var socket = io.connect('http://127.0.0.1:6677', { 'forceNew': true });

// 1. Recibir mensajes del servidor
socket.on('messages', function(data){
    console.log('Mensajes recibidos:', data);
    render(data);
});

// 2. Renderizar mensajes en la caja izquierda
function render(data){
    var html = data.map(function(elem){
        return (`
            <div class="messages">
                <strong>${elem.nickname}</strong>:
                <span>${elem.text}</span>
            </div> 
        `);
    }).join(' ');

    var divms = document.getElementById('messages');
    if (divms) {
        divms.innerHTML = html;
        divms.scrollTop = divms.scrollHeight;
    }
}

// 3. Capturar y enviar nuevos mensajes
function addmessage(e){
    var nickInput = document.getElementById('nickname');
    var msgInput = document.getElementById('mensaje');

    var mensaje = {
        nickname: nickInput.value || 'Anónimo',
        text: msgInput.value
    };

    // Ocultar campo de nickname tras primer envío
    nickInput.style.display = 'none';
    var nickLabel = document.getElementById('nick');
    if (nickLabel) nickLabel.style.display = 'none';

    // Emitir al servidor
    socket.emit('addmessage', mensaje);

    // Limpiar caja de texto del mensaje
    msgInput.value = '';

    return false; // Evita que la página se recargue
}