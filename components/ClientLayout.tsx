"use client";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ChatPopup from "./ChatPopup";
import { MessageCircle } from "lucide-react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [showChat, setShowChat] = useState(false);

  const shouldShowChat = !pathname.startsWith("/dashboard");

  return (
    <>
      {children}

      {shouldShowChat && (
        <>
          <button
            onClick={() => setShowChat(true)}
            className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
            aria-label="Abrir chat"
          >
            <MessageCircle size={28} />
          </button>

          {showChat && <ChatPopup onClose={() => setShowChat(false)} />}
        </>
      )}
    </>
  );
}
