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

  const stompClientRef = useRef<Client | null>(null);

  useEffect(() => {
    const socket = new SockJS("http://localhost:53686/ws-message");
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
    setMessages((prev) => [...prev, payload.content]);
  };

  const sendMessage = () => {
    if (
      stompClientRef.current?.connected &&
      input &&
      name &&
      email &&
      subject
    ) {
      stompClientRef.current.publish({
        destination: "/app/chat.send",
        body: JSON.stringify({
          name,
          email,
          subject: `${subject} de ${name}`,
          content: `${input} Atte: ${name}`,
        }),
      });
      setInput("");
    }
  };

  return (
    <div className="fixed bottom-20 right-6 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 flex flex-col">
      <div className="flex justify-between items-center p-3 border-b font-bold text-blue-700">
        <span>Chat</span>
        <button onClick={onClose} className="text-gray-500 hover:text-red-600">
          ✖
        </button>
      </div>
      <div className="p-3 space-y-2 overflow-y-auto max-h-52">
        {messages.map((msg, i) => (
          <div key={i} className="bg-gray-100 rounded px-2 py-1 text-sm">
            {msg}
          </div>
        ))}
      </div>
      <div className="p-3 border-t flex flex-col gap-2">
        <input
          className="border px-2 py-1 rounded text-sm"
          placeholder="Tu nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border px-2 py-1 rounded text-sm"
          placeholder="Tu correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border px-2 py-1 rounded text-sm"
          placeholder="Asunto"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <div className="flex gap-1">
          <input
            className="flex-1 border px-2 py-1 rounded text-sm"
            placeholder="Escribe tu mensaje..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-2 rounded"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
