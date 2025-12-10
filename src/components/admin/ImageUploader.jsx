import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET;

export default function ImageUploader({ currentImage, onUpload, onDelete }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, formData);
      onUpload(res.data.secure_url);
    } catch (err) {
      toast.error("Gagal upload gambar.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative w-full aspect-video bg-[#0c0c0c] border border-dashed border-[#333] hover:border-zinc-500 transition-colors flex items-center justify-center overflow-hidden group">
      {uploading && <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10 font-mono text-xs text-[#9f1239] animate-pulse">UPLOADING...</div>}
      
      {currentImage ? (
        <>
          <img src={currentImage} alt="Preview" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
          <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 font-mono text-xs">
             <label className="cursor-pointer text-white hover:text-[#9f1239] border-b border-transparent hover:border-[#9f1239]">
               [ GANTI ] <input type="file" className="hidden" onChange={handleUpload} />
             </label>
             <button onClick={onDelete} className="text-white hover:text-[#9f1239] border-b border-transparent hover:border-[#9f1239]">[ HAPUS ]</button>
          </div>
        </>
      ) : (
        <label className="cursor-pointer text-zinc-600 group-hover:text-zinc-400 text-xs font-mono tracking-widest">
           [ INSERT IMAGE ]
           <input type="file" className="hidden" onChange={handleUpload} />
        </label>
      )}
    </div>
  );
}