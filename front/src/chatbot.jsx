import React, { useState, useRef } from "react";
import "./App.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatRef = useRef(null);
  const [currentCity, setCurrentCity] = useState("");

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const newMessages = [...messages, { from: "user", text: trimmed }];
    setMessages(newMessages);
    setInput("");

    setMessages((prev) => [
      ...prev,
      { from: "bot", text: "⏳ Je recherche des hôtels pour vous..." },
    ]);

    let finalMessage = trimmed;
    const cityMatch = trimmed.match(
      /(paris|lyon|marseille|lille|toulouse|bordeaux)/i
    );
    if (cityMatch) {
      setCurrentCity(cityMatch[1]);
    } else if (currentCity) {
      finalMessage += " à " + currentCity;
    }

    try {
      const res = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: finalMessage }),
      });
      const data = await res.json();

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { from: "bot", text: data.reply };
        return updated;
      });

      setTimeout(() => {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }, 100);
    } catch (err) {
      console.error("Erreur API :", err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="container">
      <h2>🏨 Chatbot Hôtels IA (local)</h2>
      <div id="chat" ref={chatRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`msg ${msg.from}`}>
            <strong>{msg.from === "user" ? "👤 Vous" : "🤖 Bot"}:</strong>{" "}
            <span dangerouslySetInnerHTML={{ __html: msg.text }} />
          </div>
        ))}
      </div>
      <input
        id="input"
        placeholder="Ex: Je cherche un hôtel pas cher à Paris..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button onClick={sendMessage}>Envoyer</button>
    </div>
  );
};

export default Chatbot;
