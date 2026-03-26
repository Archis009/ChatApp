import { XIcon, MoreVertical, Trash2, UserMinus, Ban } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useEffect, useState, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";

function ChatHeader() {
  const { selectedUser, setSelectedUser, clearChat, deleteContact, blockUser, setPreviewImage } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const isOnline = onlineUsers.includes(selectedUser._id);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") setSelectedUser(null);
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [setSelectedUser]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  return (
    <div
      className="flex justify-between items-center bg-slate-800/50 border-b
   border-slate-700/50 max-h-[84px] px-6 flex-1 relative"
    >
      <div className="flex items-center space-x-3">
        <div 
          className={`avatar ${isOnline ? "online" : "offline"}`}
          onClick={(e) => {
            e.stopPropagation();
            if (selectedUser.profilePic) setPreviewImage(selectedUser.profilePic);
            else setPreviewImage("/avatar.png");
          }}
        >
          <div className="w-12 rounded-full cursor-pointer hover:scale-105 transition-transform">
            <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
          </div>
        </div>

        <div>
          <h3 className="text-slate-200 font-medium">{selectedUser.fullName}</h3>
          <p className="text-slate-400 text-sm">{isOnline ? "Online" : "Offline"}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Dropdown Menu Container */}
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            title="Chat Options"
            className="p-1 rounded-full hover:bg-slate-700/50 transition-colors"
          >
            <MoreVertical className="w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">
              <button 
                onClick={() => {
                  setIsMenuOpen(false);
                  if (window.confirm("Are you sure you want to clear this chat? This action cannot be undone.")) {
                    clearChat(selectedUser._id);
                  }
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
                Clear Chat
              </button>
              
              <button 
                onClick={() => {
                  setIsMenuOpen(false);
                  if (window.confirm("Are you sure you want to delete this contact? They will be removed from your list.")) {
                    deleteContact(selectedUser._id);
                  }
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors border-t border-slate-700/50"
              >
                <UserMinus className="w-4 h-4 text-orange-400" />
                Delete Contact
              </button>
              
              <button 
                onClick={() => {
                  setIsMenuOpen(false);
                  const action = selectedUser.hasBlockedThem ? "unblock" : "block";
                  if (window.confirm(`Are you sure you want to ${action} this user?`)) {
                    blockUser(selectedUser._id);
                  }
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors border-t border-slate-700/50"
              >
                <Ban className={`w-4 h-4 ${selectedUser.hasBlockedThem ? "text-emerald-400" : "text-red-500"}`} />
                {selectedUser.hasBlockedThem ? "Unblock User" : "Block User"}
              </button>
            </div>
          )}
        </div>

        <button onClick={() => setSelectedUser(null)} title="Close Chat" className="p-1 rounded-full hover:bg-slate-700/50 transition-colors">
          <XIcon className="w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer" />
        </button>
      </div>
    </div>
  );
}
export default ChatHeader;