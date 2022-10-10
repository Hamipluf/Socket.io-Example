
import { Server } from 'Socket.IO'
// Dentro de la función exportada por defecto, hacemos una comprobación en res.socket.server.io, que no existe por defecto y muestra que la conexión de socket no existe. Si este objeto io en res.socket.server no existe, entonces iniciamos una nueva conexión de socket instanciando un Server, que toma el res.socket.server como entrada.

const SocketHandler = (req, res) => {

    // A continuación, establecemos el objeto devuelto a res.socket.server.io para que cuando haya una nueva petición después de la instanciación, res.socket.server.io no esté indefinido.

    if (res.socket.server.io) {
        //    Si conectas otro cliente visitando el servidor de desarrollo en otra pestaña o pantalla del navegador, verás el mensaje "Socket is already running" impreso
        console.log('Socket is already running')
    } else {
        // Si compruebas la pantalla de la terminal desde la que iniciaste el servidor de desarrollo, también verás el mensaje "Socket is initializing" registrado después de que el primer cliente se haya conectado.
        console.log('Socket is initializing')
        const io = new Server(res.socket.server)
        res.socket.server.io = io


        // Registrando un listener de conexión, nos aseguramos de que la conexión del socket se realice. Después, dentro de la función callback, nos suscribimos al evento input-change a través de la función socket.on(), que toma como parámetros un nombre de evento y una función callback.
        io.on('connection', socket => {
            socket.on('input-change', msg => {
                // Luego, dentro de la función callback, usamos socket.broadcast.emit(), que emite un mensaje a todos los clientes excepto al que emitió el evento input-change. Así, sólo los otros clientes reciben el msg, que es el valor de entrada de texto enviado por uno de los clientes.
                socket.broadcast.emit('update-input', msg)
            })
        })
    }
    //   Fuera de la sentencia if, simplemente terminamos la petición para evitar que se produzca un estancamiento de la misma
    res.end()

}

export default SocketHandler