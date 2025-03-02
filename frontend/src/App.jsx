import { useState } from 'react';
import './App.css';
import io from "socket.io-client";
import Chat from './Chat';


let url = 'http://localhost:8082'
const socket = io.connect(url);


function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);


  const joinRoom = () => {
    if (username !== "" && room !== ""){
      socket.emit("join_room", room);
      setShowChat(true);
    }
  }

  return (
    <div className="App">

      {showChat === false ? (
        <div className="joinChatContainer">
          <h3>Join A Chat</h3>
          <input
            type="text"
            placeholder="Name..."
            value={username}
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Room ID..."
            value={room}
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <button onClick={joinRoom}>Join A Room</button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}

    </div>
  )
}

export default App
