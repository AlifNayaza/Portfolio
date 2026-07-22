import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET;

export default function AudioUploader({ currentAudio, onUpload, onDelete }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("audio/")) {
        toast.error("Format file harus Audio.");
        return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("resource_type", "auto"); 

    try {
      const res = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, formData);
      onUpload(res.data.secure_url);
      toast.success("Audio berhasil diupload.");
    } catch (err) {
      console.error(err);
      toast.error("Gagal upload.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full">
      {currentAudio ? (
        <div className="flex flex-wrap items-center gap-4 border border-[var(--color-border)] bg-[var(--color-line)] p-4 rounded-lg shadow-sm">
            <div className="w-10 h-10 bg-[var(--color-crimson)] rounded-lg flex items-center justify-center text-white font-mono text-xs font-bold shadow-md">
                MP3
            </div>
            <div className="flex-1 min-w-[200px]">
                <p className="text-[10px] font-mono text-[var(--color-muted)] uppercase tracking-wider mb-1">Active Soundtrack:</p>
                <audio controls src={currentAudio} className="h-8 w-full rounded" />
            </div>
            <div className="flex gap-2 font-mono text-xs">
                <label className="cursor-pointer text-[var(--color-paper)] hover:text-[var(--color-crimson)] border border-[var(--color-border)] hover:border-[var(--color-crimson)] px-3 py-1.5 rounded transition-all">
                    Change <input type="file" className="hidden" accept="audio/*" onChange={handleUpload} />
                </label>
                <button onClick={onDelete} className="text-red-500 hover:text-white hover:bg-red-500 border border-red-500/30 px-3 py-1.5 rounded transition-all">
                    Delete
                </button>
            </div>
        </div>
      ) : (
        <label className="cursor-pointer flex flex-col items-center justify-center gap-2 py-6 border border-dashed border-[var(--color-border)] hover:border-[var(--color-crimson)] bg-[var(--color-line)]/50 hover:bg-[var(--color-line)] transition-all rounded-lg group">
           {uploading ? (
               <span className="text-xs font-mono animate-pulse text-[var(--color-crimson)] font-bold">UPLOADING SOUNDTRACK...</span>
           ) : (
               <>
                <span className="font-mono text-xs text-[var(--color-muted)] group-hover:text-[var(--color-paper)] tracking-widest font-bold">🎵 CLICK TO UPLOAD SOUNDTRACK AUDIO</span>
               </>
           )}
           <input type="file" className="hidden" accept="audio/*" onChange={handleUpload} />
        </label>
      )}
    </div>
  );
}