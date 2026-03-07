import { VolumeOffIcon, Volume2Icon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

function ProfileHeader() {
  const { authUser } = useAuthStore();
  const { isSoundEnabled, toggleSound, setIsSettingsOpen } = useChatStore();

  return (
    <div className="p-6 border-b border-slate-700/50">
      <div className="flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group hover:bg-slate-800/50 py-1.5 px-2 rounded-lg transition-colors -ml-2"
          onClick={() => setIsSettingsOpen(true)}
          title="Open Settings"
        >
          {/* AVATAR */}
          <div className="avatar online">
            <div className="size-12 rounded-full overflow-hidden border border-slate-700 ring-2 ring-transparent group-hover:ring-cyan-500/50 transition-all">
              <img
                src={authUser?.profilePic || "/avatar.png"}
                alt="User image"
                className="size-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
          </div>

          {/* USERNAME & ONLINE TEXT */}
          <div>
            <h3 className="text-slate-200 font-medium text-base max-w-[130px] truncate group-hover:text-cyan-400 transition-colors">
              {authUser?.fullName}
            </h3>
            <p className="text-slate-400 text-xs text-left group-hover:opacity-80 transition-opacity">Online</p>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-4 items-center">
          {/* SOUND TOGGLE BTN */}
          <button
            className="text-slate-400 hover:text-slate-200 transition-colors p-2 rounded-full hover:bg-slate-700/50"
            onClick={() => {
              mouseClickSound.currentTime = 0; 
              mouseClickSound.play().catch((error) => console.log("Audio play failed:", error));
              toggleSound();
            }}
            title="Toggle Sound"
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