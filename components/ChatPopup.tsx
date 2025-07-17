"use client";

import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client, IMessage } from "@stomp/stompjs";

export default function ChatPopup({ onClose }: { onClose: () => void }) {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [lastSentMessage, setLastSentMessage] = useState<string | null>(null);

  const stompClientRef = useRef<Client | null>(null);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const socket = new SockJS("http://localhost:51605/ws-message");
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true);
        client.subscribe("/topic/messages", onMessageReceived);
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame.body);
      },
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, []);

  const onMessageReceived = (message: IMessage) => {
    const payload = JSON.parse(message.body);
    const incomingMessage = payload.content;

    // Evitar mostrar el mismo mensaje que fue enviado por el cliente
    if (incomingMessage !== lastSentMessage) {
      setMessages((prev) => [...prev, incomingMessage]);
    }
  };

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = () => {
    if (
      stompClientRef.current?.connected &&
      input.trim() &&
      name.trim() &&
      email.trim() &&
      subject.trim()
    ) {
      const fullMessage = `${input.trim()}\nAtte: ${name.trim()}`;
      const cleanedSubject = subject.includes("de")
        ? subject
        : `${subject.trim()} de ${name.trim()}`;

      stompClientRef.current.publish({
        destination: "/app/chat.send",
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: cleanedSubject,
          content: fullMessage,
        }),
      });

      setLastSentMessage(fullMessage);
      setInput("");
    }
  };

  return (
    <div className="fixed bottom-20 right-6 w-96 bg-white rounded-xl shadow-lg border border-gray-300 z-50 flex flex-col">
      <div className="flex justify-between items-center p-4 border-b font-bold text-blue-700 text-lg">
        <span>Chat</span>
        <button onClick={onClose} className="text-gray-500 hover:text-red-600 text-xl">
          ✖
        </button>
      </div>

      <div className="p-4 space-y-2 overflow-y-auto max-h-52 bg-gray-50">
        {messages.map((msg, i) => (
          <div
            key={i}
            ref={i === messages.length - 1 ? lastMessageRef : null}
            className="bg-white border border-gray-200 rounded px-3 py-2 text-sm shadow-sm"
          >
            {msg}
          </div>
        ))}
      </div>

      <div className="p-4 border-t flex flex-col gap-2">
        <input
          className="border px-3 py-2 rounded text-sm"
          placeholder="Tu nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border px-3 py-2 rounded text-sm"
          placeholder="Tu correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border px-3 py-2 rounded text-sm"
          placeholder="Asunto"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <div className="flex gap-2">
          <input
            className="flex-1 border px-3 py-2 rounded text-sm"
            placeholder="Escribe tu mensaje..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
