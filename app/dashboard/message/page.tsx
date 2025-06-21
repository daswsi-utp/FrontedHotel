"use client";

import { useState } from "react";
 // puedes quitar esto si no tienes utilidades aún

interface Message {
  id: number;
  sender: string;
  subject: string;
  preview: string;
  date: string;
  isRead: boolean;
  body: string;
}

const mockMessages: Message[] = [
  {
    id: 1,
    sender: "Robert Johnson",
    subject: "Question about Check-in Time",
    preview: "Hello, I have a reservation for next week and was...",
    date: "Feb 14",
    isRead: true,
    body: "Hello, I have a reservation for next week and was wondering what time I can check in. Thanks!",
  },
  {
    id: 2,
    sender: "Lisa Martinez",
    subject: "Special Anniversary Request",
    preview: "My husband and I will be celebrating our 10th ...",
    date: "Feb 19",
    isRead: false,
    body: "My husband and I will be celebrating our 10th anniversary. Can you please arrange something special in the room?",
  },
  {
    id: 3,
    sender: "James Wilson",
    subject: "Airport Transfer Inquiry",
    preview: "Hi, I’d like to know if you offer airport transfer se...",
    date: "Feb 21",
    isRead: false,
    body: "Hi, I’d like to know if you offer airport transfer service from the airport to your hotel.",
  },
  {
    id: 4,
    sender: "María García",
    subject: "Dietary Restrictions",
    preview: "I have upcoming reservations at your hotel and I...",
    date: "Feb 17",
    isRead: true,
    body: "I have upcoming reservations at your hotel and I’d like to inform you about my dietary restrictions. I’m allergic to nuts and gluten.",
  },
];

export default function GuestMessagesPage() {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [filter, setFilter] = useState<"all" | "read" | "unread">("all");

  const filteredMessages = mockMessages.filter((msg) => {
    if (filter === "all") return true;
    if (filter === "read") return msg.isRead;
    return !msg.isRead;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Guest Messages</h1>

      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search messages..."
          className="border px-4 py-2 rounded-md w-72"
        />

        <div className="space-x-2">
          {(["all", "unread", "read"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={
                "px-4 py-1 rounded-full border " +
                (filter === type ? "bg-blue-600 text-white" : "text-blue-700")
              }
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex border rounded-lg overflow-hidden shadow-md" style={{ minHeight: "400px" }}>
        {/* Lista de mensajes */}
        <div className="w-1/3 border-r p-4 space-y-4 bg-white">
          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => setSelectedMessage(msg)}
              className={`cursor-pointer p-3 rounded-lg border hover:bg-blue-50 ${
                !msg.isRead ? "border-l-4 border-blue-600" : ""
              }`}
            >
              <div className="font-semibold flex justify-between">
                <span>{msg.sender}</span>
                <span className="text-sm text-gray-400">{msg.date}</span>
              </div>
              <p className="text-sm font-medium text-gray-700">
                {msg.subject}
              </p>
              <p className="text-xs text-gray-500 truncate">{msg.preview}</p>
            </div>
          ))}
        </div>

        {/* Detalles del mensaje */}
        <div className="w-2/3 p-6 bg-gray-50">
          {selectedMessage ? (
            <div>
              <h2 className="text-xl font-bold mb-2">{selectedMessage.subject}</h2>
              <p className="text-gray-600 mb-2">
                From: {selectedMessage.sender} ({selectedMessage.date})
              </p>
              <hr className="my-2" />
              <p className="text-gray-800 whitespace-pre-line">{selectedMessage.body}</p>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <div className="text-4xl mb-2">📩</div>
                <p>Select a message to view its details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}