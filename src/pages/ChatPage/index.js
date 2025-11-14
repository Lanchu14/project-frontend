import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import VideoCall from "./VideoCall";

const socket = io("http://localhost:5000"); // Single socket instance

function ChatPage({ bookingId, userName }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Load previous messages & setup socket
  useEffect(() => {
    const fetchPreviousChats = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/chats/${bookingId}`);
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.log("Error fetching chats:", err);
      }
    };

    fetchPreviousChats();
    socket.emit("joinRoom", bookingId);

    const receiveMessageHandler = (data) => {
      setMessages((prev) => {
        // Prevent duplicates
        if (
          prev.some(
            (m) =>
              m.time === data.time &&
              m.sender === data.user &&
              m.message === data.text
          )
        ) {
          return prev;
        }
        return [...prev, { sender: data.user, message: data.text, time: data.time }];
      });
    };

    socket.on("receiveMessage", receiveMessageHandler);

    return () => {
      socket.off("receiveMessage", receiveMessageHandler);
    };
  }, [bookingId]);

  // Send message
  const sendMessage = () => {
    if (!message.trim()) return;

    const msgData = {
      room: bookingId,
      user: userName,
      text: message,
      time: new Date().toISOString(),
    };

    socket.emit("sendMessage", msgData);
    setMessages((prev) => [
      ...prev,
      { sender: userName, message, time: msgData.time },
    ]);
    setMessage("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Chat Room (Booking #{bookingId})</h2>

      <button onClick={() => setShowVideoCall(!showVideoCall)} style={{ marginBottom: "10px" }}>
        {showVideoCall ? "Close Video Call" : "Start Video Call"}
      </button>

      {showVideoCall && <VideoCall socket={socket} bookingId={bookingId} userName={userName} />}

      <div
        style={{
          border: "1px solid gray",
          height: "300px",
          overflowY: "auto",
          padding: "10px",
          marginBottom: "15px",
        }}
      >
        {messages.map((m, i) => (
          <p key={i}>
            <strong>{m.sender}:</strong> {m.message}{" "}
            <small style={{ color: "gray" }}>
              ({new Date(m.time).toLocaleTimeString()})
            </small>
          </p>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      <input
        type="text"
        placeholder="Type message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ width: "80%", padding: "8px" }}
      />
      <button onClick={sendMessage} style={{ marginLeft: "10px" }}>
        Send
      </button>
    </div>
  );
}

export default ChatPage;
