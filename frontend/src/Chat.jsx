import React, { useEffect, useState, useRef } from 'react'

const Chat = ({socket, username, room}) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const messageEndRef = useRef(null); // Ref for auto-scrolling



  const sendMessage = async() => {
    if (currentMessage !== ""){
      const messageData = {
        room : room,
        author: username,
        message: currentMessage,
        time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
      }
      
      await socket.emit("send_message", messageData);
      setMessageList((prev) => [...prev, messageData]);
      setCurrentMessage("");
    }
  }


  useEffect(() => {
    const receiveMessageHandler = (data) => {
      setMessageList((prev) => [...prev, data]);
    };

    socket.on("receive_message", receiveMessageHandler);

    return () => {
      socket.off("receive_message", receiveMessageHandler); // Cleanup
    };
  }, [socket]);



  // Auto-scroll to bottom when new message arrives
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList]);




  return (
    <div className="chat-window">



      <div className="chat-header">
        <p>Live Chat</p>
      </div>



      <div className="chat-body">
        {messageList.map((msg, index) => (
          <div key={index} className="message" id={username === msg.author ? "you" : "other"}>
            <div>
              <div className="message-content">
                <p>{msg.message}</p>
              </div>
              <div className="message-meta">
                <p id="time">{msg.time}</p>
                <p id="author">{msg.author}</p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messageEndRef} /> {/* Auto-scroll anchor */}
      </div>



      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Type..."
          onChange={(event) => setCurrentMessage(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && sendMessage()} // Send on Enter
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>



    </div>
  );
}

export default Chat