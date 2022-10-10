import { useEffect, useState } from 'react'
import "../styles/globals.css"
import io from 'Socket.IO-client'
let socket;

const Home = () => {
  const [input, setInput] = useState('')

  // Lo primero que tenemos que hacer en el componente es establecer la conexión de socket. Para ello, vamos a utilizar el gancho useEffect con una dependencia de matriz vacía, que es básicamente el equivalente al gancho del ciclo de vida componentDidMount.

  useEffect(() => {
    socketInitializer(), []
    // restorno una funcion de limpieza para evitar errores ademas de ser buena practica.
    return () => {
      console.log('funcion de limpieza');
    }
  });
  // SocketInitializer es una función asíncrona porque necesitamos hacer una llamada al endpoint /api/socket para abrir la conexión del socket.
  const socketInitializer = async () => {
    await fetch('/api/socket')

    // Una vez resuelta esta llamada, inicializamos el objeto io() y lo establecemos en una variable fuera del ámbito de la función para que permanezca igual durante todo el ciclo de vida del componente.

    socket = io()

    // Luego, usamos socket.on() para escuchar una emisión de conexión y registrar un mensaje para asegurar que el cliente está conectado. Este es un evento reservado y no debe ser emitido manualmente. Puedes encontrar la lista de eventos reservados aquí
    socket.on('connect', () => {
      console.log('connected')
    })

    // Esta vez, necesitamos manejar el evento emitido, que fue update-input. Todo lo que tenemos que hacer es suscribirnos a este evento con socket.on() y llamar a la función setInput dentro del callback para actualizar el valor de la entrada con el valor enviado desde el servidor.

    socket.on('update-input', msg => {
      setInput(msg)
    })
  }
  // Ahora, necesitamos llamar a esta función dentro del gancho useEffect con una dependencia []. La razón por la que envolvemos el socketInitializer dentro de otra función es porque las devoluciones de llamada de los efectos deben ser sincrónicas para evitar condiciones de carrera.




  // Dentro de onChangeHandler, establecemos el estado de entrada a un nuevo valor y luego emitimos este cambio al servidor como un evento. El primer parámetro de socket.emit() es el nombre único del evento, que es input-change, y el segundo parámetro es el mensaje. En nuestro caso, es el valor del campo de entrada.
  const onChangeHandler = (e) => {
    setInput(e.target.value)


    // A continuación, tenemos que manejar este evento en el servidor escuchando el evento específico input-change.

    socket.emit('input-change', e.target.value)
  }

  

  return (
    //Vamos a crear un campo de entrada controlado. Todo lo que necesitamos es un estado y una función manejadora para el evento onChange del campo de entrada.
    <div className="style">
    <input
      placeholder="Type something"
      value={input}
      onChange={onChangeHandler}
      
    />
    </div>
  )
}

export default Home;