import React, { useState, useEffect } from 'react';
import Navbar from '../components/navBar';
import Footer from '../components/Footer';

import '../design/app.scss';

const ChatApp = ({ authState, userName, onLogout }) => {
  const [socket, setSocket] = useState(null);
  const [newMsg, setNewMsg] = useState('');
  const [myName, setMyName] = useState('');
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
  const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
  const ws = new WebSocket(`${protocol}://${window.location.host}/ws`);

  // Retrieve the stored name and set it once the component mounts
  const storedName = localStorage.getItem('userName');
  console.log("Stored name", storedName)
  setMyName(storedName || '');  // Ensure the name is set

  ws.onopen = () => {
    appendMsg('system', 'websocket', 'connected');
  };

  ws.onmessage = async (event) => {
    const text = await event.data.text();
    const chat = JSON.parse(text);
    appendMsg('friend', chat.name, chat.msg);
  };

  ws.onclose = () => {
    appendMsg('system', 'websocket', 'disconnected');
    setChatDisabled(true);
  };

  setSocket(ws);

  return () => {
    ws.close();
  };
}, []);

  const appendMsg = (cls, from, msg) => {
    setChatMessages((prevMessages) => [
      { cls, from, msg },
      ...prevMessages,
    ]);
  };

  const sendMessage = () => {
    if (newMsg) {
      appendMsg('me', 'me', newMsg);
      socket.send(`{"name":"${myName}", "msg":"${newMsg}"}`);
      setNewMsg('');
    }
  };

  const handleKeyUp = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  

  return (
    <div className='body'>
    <Navbar className="body__navbar" authState={authState} userName={userName} onLogout={onLogout} />
<div className='body_chat'>
<div className='body-chat__header'>
<h2>Chat</h2>

</div>
    <fieldset id="chat-controls">
    <input
        id="new-msg"
        type="text"
        value={newMsg}
        onChange={(e) => setNewMsg(e.target.value)}
        onKeyDown={handleKeyUp}
    />
    <button onClick={sendMessage}>Send</button>
    </fieldset>

    <div id="chat-text">
        <div className='chat-text-text'>
        {chatMessages.map((message, index) => (
        <div key={index}>
        <span className={message.cls}>{message.from}</span>: {message.msg}
        </div>
    ))}
        </div>
    
    </div>
</div>
<Footer />
    </div>
    
  );
};

export default ChatApp;
