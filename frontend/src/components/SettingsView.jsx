import { useState, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { Camera, Mail, User, Trash2, LogOut, Loader2, ArrowLeft, X } from "lucide-react";

function SettingsView() {
  const { authUser, updateProfile, logout } = useAuthStore();
  const { setIsSettingsOpen } = useChatStore();
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(authUser?.fullName || "");
  
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState(authUser?.email || "");

  const [isUpdating, setIsUpdating] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false); // State for image preview
  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUpdating(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const base64Image = reader.result;
      await updateProfile({ profilePic: base64Image });
      setIsUpdating(false);
    };
  };

  const handleRemovePhoto = async () => {
    if (!authUser.profilePic) return;
    setIsUpdating(true);
    await updateProfile({ removeProfilePic: true });
    setIsUpdating(false);
  };

  const handleNameSave = async () => {
    if (!newName.trim() || newName === authUser?.fullName) {
      setIsEditingName(false);
      setNewName(authUser?.fullName || "");
      return;
    }
    setIsUpdating(true);
    await updateProfile({ fullName: newName.trim() });
    setIsEditingName(false);
    setIsUpdating(false);
  };

  const handleEmailSave = async () => {
    if (!newEmail.trim() || newEmail === authUser?.email) {
      setIsEditingEmail(false);
      setNewEmail(authUser?.email || "");
      return;
    }
    setIsUpdating(true);
    await updateProfile({ email: newEmail.trim() });
    setIsEditingEmail(false);
    setIsUpdating(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-900 overflow-hidden relative w-full">
      {/* Header bar with Back button and Title */}
      <div className="border-b border-slate-700/50 flex items-center justify-center relative min-h-[96px] py-6 px-6">
        <button 
          onClick={() => setIsSettingsOpen(false)}
          className="absolute left-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium hidden sm:inline">Back to Chat</span>
        </button>
        <h2 className="text-2xl font-bold text-slate-100">Profile Settings</h2>
      </div>

      <div className="flex-1 overflow-y-auto w-full max-w-2xl mx-auto p-4 pb-4 mt-6">

        <div className="space-y-10">
          {/* Profile Picture Section */}
          <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 flex flex-col items-center sm:flex-row sm:items-start gap-6 shadow-xl">
            <div className="relative group flex-shrink-0 cursor-pointer">
              <div 
                className={`size-28 rounded-full overflow-hidden border-4 border-slate-700 mx-auto transition-transform hover:scale-105 ${isUpdating ? "opacity-50" : ""}`}
                onClick={() => authUser?.profilePic ? setIsPreviewOpen(true) : null}
              >
                <img
                  src={authUser?.profilePic || "/avatar.png"}
                  alt="Profile"
                  className="size-full object-cover"
                />
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                className="absolute bottom-1 right-1 p-2.5 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white transition-colors shadow-lg"
                disabled={isUpdating}
                title="Change Photo"
              >
                <Camera className="w-5 h-5" />
              </button>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageUpload}
              />
            </div>

            <div className="flex-1 text-center sm:text-left flex flex-col justify-center">
              <h3 className="text-xl font-medium text-slate-200 mb-2">Profile Photo</h3>
              <p className="text-base text-slate-400 mb-4">
                Upload a new photo or remove the current one.
              </p>
              <div className="flex justify-center sm:justify-start gap-4">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUpdating}
                  className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-sm font-medium transition-colors"
                >
                  Upload New
                </button>
                {authUser?.profilePic && (
                  <button 
                    onClick={handleRemovePhoto}
                    disabled={isUpdating}
                    className="px-5 py-2.5 border border-red-500/30 text-red-500 hover:bg-red-500/10 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Account Details Section */}
          <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 space-y-4 shadow-xl">
            <h3 className="text-xl font-medium text-slate-200 mb-2">Account Details</h3>

            {/* Name Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <User className="w-4 h-4" /> Full Name
              </label>
              <div className="flex gap-3">
                {isEditingName ? (
                  <>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-5 py-3 text-slate-200 focus:outline-none focus:border-cyan-500 shadow-inner"
                      autoFocus
                      onKeyDown={(e) => e.key === "Enter" && handleNameSave()}
                      disabled={isUpdating}
                    />
                    <button 
                      onClick={handleNameSave}
                      disabled={isUpdating || !newName.trim()}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-emerald-900/20"
                    >
                      Save
                    </button>
                    <button 
                      onClick={() => {
                        setIsEditingName(false);
                        setNewName(authUser?.fullName);
                      }}
                      disabled={isUpdating}
                      className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex-1 bg-slate-900/50 border border-slate-700/50 rounded-xl px-5 py-3 text-slate-200 flex items-center">
                      {authUser?.fullName}
                    </div>
                    <button 
                      onClick={() => {
                        setNewName(authUser?.fullName);
                        setIsEditingName(true);
                        setIsEditingEmail(false);
                      }}
                      className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl font-medium transition-colors whitespace-nowrap"
                    >
                      Edit
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email Address
              </label>
              <div className="flex gap-3">
                {isEditingEmail ? (
                  <>
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-5 py-3 text-slate-200 focus:outline-none focus:border-cyan-500 shadow-inner"
                      autoFocus
                      onKeyDown={(e) => e.key === "Enter" && handleEmailSave()}
                      disabled={isUpdating}
                    />
                    <button 
                      onClick={handleEmailSave}
                      disabled={isUpdating || !newEmail.trim()}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-emerald-900/20"
                    >
                      Save
                    </button>
                    <button 
                      onClick={() => {
                        setIsEditingEmail(false);
                        setNewEmail(authUser?.email);
                      }}
                      disabled={isUpdating}
                      className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex-1 bg-slate-900/50 border border-slate-700/50 rounded-xl px-5 py-3 text-slate-200 flex items-center">
                      {authUser?.email}
                    </div>
                    <button 
                      onClick={() => {
                        setNewEmail(authUser?.email);
                        setIsEditingEmail(true);
                        setIsEditingName(false);
                      }}
                      className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl font-medium transition-colors whitespace-nowrap"
                    >
                      Edit
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Full-width Logout Button */}
          <div className="w-full">
            <button 
              onClick={logout}
              className="flex items-center justify-center gap-2 w-full p-6 bg-red-500/10 hover:bg-red-500/20 placeholder-red-400 border border-red-500/50 text-red-500 rounded-2xl font-medium transition-all shadow-sm"
            >
              <LogOut className="w-5 h-5" />
              Logout out of your account on this device
            </button>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {isPreviewOpen && authUser?.profilePic && (
        <div 
          className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
          onClick={() => setIsPreviewOpen(false)}
        >
          <div className="relative max-w-4xl max-h-full w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button 
              onClick={(e) => { e.stopPropagation(); setIsPreviewOpen(false); }}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>
            <img 
              src={authUser.profilePic} 
              alt="Profile Full Size" 
              className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl ring-4 ring-slate-800"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
            />
          </div>
        </div>
      )}

      {isUpdating && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 transition-all rounded-inherit">
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-2xl flex flex-col items-center">
            <Loader2 className="w-10 h-10 text-cyan-500 animate-spin mb-4" />
            <p className="text-slate-300 font-medium tracking-wide">Updating Profile...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default SettingsView;
