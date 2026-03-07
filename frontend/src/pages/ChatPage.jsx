import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect } from "react";
import { X } from "lucide-react";

import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";
import SettingsView from "../components/SettingsView";

function ChatPage() {
  const { 
    activeTab, 
    selectedUser, 
    isSettingsOpen, 
    subscribeToMessages, 
    unsubscribeFromMessages,
    previewImage,
    setPreviewImage 
  } = useChatStore();
  const { socket } = useAuthStore();

  useEffect(() => {
    if (!socket) return;
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [socket, subscribeToMessages, unsubscribeFromMessages]);

  return (
    <div className="relative w-full max-w-6xl h-[800px]">
      <BorderAnimatedContainer>
        {isSettingsOpen ? (
          <SettingsView />
        ) : (
          <>
            {/* LEFT SIDE */}
            <div className="w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col">
              <ProfileHeader />
              <ActiveTabSwitch />

              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {activeTab === "chats" ? <ChatsList /> : <ContactList />}
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm relative overflow-hidden">
              {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
            </div>
          </>
        )}
      </BorderAnimatedContainer>

      {/* Global Image Preview Modal */}
      {previewImage && (
        <div 
          className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 rounded-[2rem]"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-full w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button 
              onClick={(e) => { e.stopPropagation(); setPreviewImage(null); }}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>
            <img 
              src={previewImage} 
              alt="Profile Full Size" 
              className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl ring-4 ring-slate-800"
              onClick={(e) => e.stopPropagation()} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
export default ChatPage;