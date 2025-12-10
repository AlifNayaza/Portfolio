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
        <div className="flex items-center gap-4 border border-[#333] bg-[#111] p-3">
            <div className="w-8 h-8 bg-[#9f1239] flex items-center justify-center text-white font-mono text-xs">
                MP3
            </div>
            <div className="flex-1 overflow-hidden">
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Current File:</p>
                <audio controls src={currentAudio} className="h-6 w-full opacity-60 invert" />
            </div>
            <div className="flex gap-2 font-mono text-xs">
                <label className="cursor-pointer text-zinc-400 hover:text-white border-b border-transparent hover:border-white transition-all">
                    [ GANTI ] <input type="file" className="hidden" accept="audio/*" onChange={handleUpload} />
                </label>
                <button onClick={onDelete} className="text-[#9f1239] hover:text-red-400 border-b border-transparent hover:border-red-400 transition-all">
                    [ HAPUS ]
                </button>
            </div>
        </div>
      ) : (
        <label className="cursor-pointer flex flex-col items-center justify-center gap-2 py-6 border border-dashed border-[#333] hover:border-[#9f1239] hover:bg-[#111] transition-all group">
           {uploading ? (
               <span className="text-xs font-mono animate-pulse text-[#9f1239]">UPLOADING DATA...</span>
           ) : (
               <>
                <span className="font-mono text-xs text-zinc-500 group-hover:text-white tracking-widest">[ CLICK TO UPLOAD AUDIO ]</span>
               </>
           )}
           <input type="file" className="hidden" accept="audio/*" onChange={handleUpload} />
        </label>
      )}
    </div>
  );
}