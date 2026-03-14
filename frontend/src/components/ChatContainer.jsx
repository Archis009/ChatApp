import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";
import { Trash2, X } from "lucide-react";

function ChatContainer() {
  const {
    selectedUser,
    getMessagesByUserId,
    messages,
    isMessagesLoading,
    deleteMessage,
  } = useChatStore();
  
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  useEffect(() => {
    getMessagesByUserId(selectedUser._id);
  }, [selectedUser, getMessagesByUserId]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Close fullscreen on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setFullscreenImage(null);
    };
    if (fullscreenImage) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [fullscreenImage]);

  return (
    <>
      <ChatHeader />
      <div className="flex-1 px-6 overflow-y-auto py-8">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`chat ${msg.senderId === authUser._id ? "chat-end" : "chat-start"}`}
              >
                <div
                  className={`chat-bubble relative ${
                    msg.senderId === authUser._id
                      ? "bg-cyan-600 text-white"
                      : "bg-slate-800 text-slate-200"
                  }`}
                >
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="Shared"
                      className="rounded-lg h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setFullscreenImage(msg.image)}
                    />
                  )}
                  {msg.text && <p className="mt-2">{msg.text}</p>}
                  
                  <div className="flex justify-between items-center gap-3 mt-1">
                    <p className="text-xs opacity-75 flex items-center gap-1">
                      {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    
                    {msg.senderId === authUser._id && (
                      <button 
                        onClick={() => deleteMessage(msg._id)}
                        className="text-xs opacity-50 hover:opacity-100 hover:text-red-400 transition-colors"
                        title="Delete message"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {/* 👇 scroll target */}
            <div ref={messageEndRef} />
          </div>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        )}
      </div>

      {selectedUser.isBlockedByThem ? (
        <div className="p-5 bg-slate-800 border-t border-slate-700/50 flex flex-col items-center gap-1 text-center">
          <p className="text-slate-300 font-medium">You are blocked by <span className="text-red-400">{selectedUser._blockedByName || selectedUser.fullName}</span>.</p>
          <p className="text-slate-500 text-sm">Contact user to chat.</p>
        </div>
      ) : selectedUser.hasBlockedThem ? (
        <div className="p-4 bg-slate-800 border-t border-slate-700/50 flex flex-col items-center gap-2">
          <p className="text-slate-400">You have blocked this user.</p>
          <button 
            onClick={() => useChatStore.getState().blockUser(selectedUser._id)}
            className="text-emerald-400 hover:text-emerald-300 font-medium text-sm transition-colors"
          >
            Unblock
          </button>
        </div>
      ) : (
        <MessageInput />
      )}

      {/* Fullscreen Image Lightbox */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setFullscreenImage(null)}
          style={{ animation: "fadeIn 0.2s ease-out" }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setFullscreenImage(null);
            }}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={fullscreenImage}
            alt="Full view"
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: "scaleIn 0.2s ease-out" }}
          />
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}

export default ChatContainer;