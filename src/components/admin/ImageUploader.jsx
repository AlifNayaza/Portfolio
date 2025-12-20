import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET;

export default function ImageUploader({ currentImage, onUpload, onDelete, compact = false }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match('image.*')) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    
    // Optional: Add optimization parameters
    formData.append("transformation", "c_fill,g_auto,w_1200,h_1200");

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      onUpload(res.data.secure_url);
      toast.success("Image uploaded successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  if (compact) {
    return (
      <div className="relative">
        <label className="cursor-pointer px-4 py-2 bg-[#9f1239] text-white font-mono text-xs hover:bg-[#7f0e2a] transition-colors rounded inline-flex items-center gap-2">
          <span>📷</span>
          <span>UPLOAD IMAGE</span>
          <input 
            type="file" 
            className="hidden" 
            onChange={handleUpload} 
            accept="image/*"
          />
        </label>
        {uploading && (
          <div className="absolute -bottom-8 left-0 text-xs text-zinc-500 font-mono">
            Uploading...
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video bg-[#0c0c0c] border border-dashed border-[#333] hover:border-zinc-500 transition-colors flex items-center justify-center overflow-hidden group">
      {uploading && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10 font-mono text-xs text-[#9f1239] animate-pulse">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-[#9f1239] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            UPLOADING...
          </div>
        </div>
      )}
      
      {currentImage ? (
        <>
          <img 
            src={currentImage} 
            alt="Preview" 
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" 
          />
          <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 font-mono text-xs">
            <label className="cursor-pointer text-white hover:text-[#9f1239] border-b border-transparent hover:border-[#9f1239] px-3 py-1">
              [ CHANGE ]
              <input 
                type="file" 
                className="hidden" 
                onChange={handleUpload} 
                accept="image/*"
              />
            </label>
            <button 
              onClick={onDelete} 
              className="text-white hover:text-red-500 border-b border-transparent hover:border-red-500 px-3 py-1"
            >
              [ DELETE ]
            </button>
          </div>
          
          {/* Image Info */}
          <div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded font-mono opacity-0 group-hover:opacity-100 transition-opacity">
            Click to change
          </div>
        </>
      ) : (
        <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
          <div className="text-zinc-600 group-hover:text-zinc-400 text-xs font-mono tracking-widest text-center">
            <div className="text-2xl mb-2">📷</div>
            [ DRAG & DROP IMAGE ]
            <div className="text-[10px] text-zinc-700 mt-2">
              or click to browse
            </div>
            <div className="text-[8px] text-zinc-800 mt-1">
              Supports: JPG, PNG, WebP (Max 5MB)
            </div>
          </div>
          <input 
            type="file" 
            className="hidden" 
            onChange={handleUpload} 
            accept="image/*"
          />
        </label>
      )}
    </div>
  );
}