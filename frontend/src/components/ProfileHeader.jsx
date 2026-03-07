import { useState, useRef } from "react";
import { LogOutIcon, VolumeOffIcon, Volume2Icon, CheckIcon, XIcon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

function ProfileHeader() {
  const { logout, authUser, updateProfile } = useAuthStore();
  const { isSoundEnabled, toggleSound } = useChatStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(authUser?.fullName || "");

  const fileInputRef = useRef(null);

  const handleNameSave = async () => {
    if (!newName.trim() || newName === authUser.fullName) {
      setIsEditingName(false);
      setNewName(authUser.fullName);
      return;
    }
    await updateProfile({ fullName: newName.trim() });
    setIsEditingName(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="p-6 border-b border-slate-700/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* AVATAR */}
          <div className="avatar online">
            <button
              className="size-14 rounded-full overflow-hidden relative group"
              onClick={() => fileInputRef.current.click()}
            >
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="User image"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-white text-xs">Change</span>
              </div>
            </button>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* USERNAME & ONLINE TEXT */}
          <div>
            {isEditingName ? (
              <div className="flex items-center gap-2 max-w-[200px]">
                <input 
                  type="text" 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)}
                  className="input input-sm input-bordered bg-slate-800 text-slate-200 px-2 h-8 w-full"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && handleNameSave()}
                />
                <button onClick={handleNameSave} className="text-emerald-500 hover:text-emerald-400 p-1">
                  <CheckIcon className="w-4 h-4" />
                </button>
                <button onClick={() => { setIsEditingName(false); setNewName(authUser.fullName); }} className="text-red-500 hover:text-red-400 p-1">
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <h3 
                className="text-slate-200 font-medium text-base max-w-[180px] truncate cursor-pointer hover:underline decoration-slate-400 underline-offset-4"
                onClick={() => {
                  setNewName(authUser.fullName);
                  setIsEditingName(true);
                }}
                title="Click to rename"
              >
                {authUser.fullName}
              </h3>
            )}

            <p className="text-slate-400 text-xs">Online</p>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-4 items-center">
          {/* LOGOUT BTN */}
          <button
            className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={logout}
          >
            <LogOutIcon className="size-5" />
          </button>

          {/* SOUND TOGGLE BTN */}
          <button
            className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={() => {
              // play click sound before toggling
              mouseClickSound.currentTime = 0; // reset to start
              mouseClickSound.play().catch((error) => console.log("Audio play failed:", error));
              toggleSound();
            }}
          >
            {isSoundEnabled ? (
              <Volume2Icon className="size-5" />
            ) : (
              <VolumeOffIcon className="size-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
export default ProfileHeader;