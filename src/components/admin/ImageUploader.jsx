import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET;

// Helper function to compress and resize image using canvas
const compressImage = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // Create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;
        
        // Draw image on canvas
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Canvas to Blob conversion failed'));
            }
          },
          'image/jpeg',
          quality
        );
      };
      
      img.onerror = () => reject(new Error('Image load failed'));
      img.src = e.target.result;
    };
    
    reader.onerror = () => reject(new Error('File read failed'));
    reader.readAsDataURL(file);
  });
};

export default function ImageUploader({ currentImage, onUpload, onDelete, compact = false }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match('image.*')) {
      toast.error("Please upload an image file (JPG, PNG, WebP)");
      return;
    }

    // Validate file size (max 10MB before compression)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size should be less than 10MB");
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      // Step 1: Compress image
      toast.loading("Compressing image...", { id: 'compress' });
      const compressedBlob = await compressImage(file, 1200, 1200, 0.85);
      toast.success("Image compressed", { id: 'compress' });
      
      // Step 2: Prepare form data
      const formData = new FormData();
      formData.append("file", compressedBlob, file.name);
      formData.append("upload_preset", UPLOAD_PRESET);
      formData.append("folder", "portfolio"); // Optional: organize in folders
      
      // Step 3: Upload to Cloudinary
      toast.loading("Uploading to cloud...", { id: 'upload' });
      
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          },
        }
      );
      
      toast.success("Image uploaded successfully!", { id: 'upload' });
      onUpload(res.data.secure_url);
      
    } catch (err) {
      console.error("Upload error details:", err.response?.data || err.message);
      
      // More specific error messages
      if (err.response?.status === 400) {
        const errorMsg = err.response?.data?.error?.message || "Invalid upload request";
        toast.error(`Upload failed: ${errorMsg}`);
        
        // Check common issues
        if (!CLOUD_NAME || !UPLOAD_PRESET) {
          toast.error("Cloudinary configuration missing. Check your .env file");
        }
      } else if (err.response?.status === 401) {
        toast.error("Authentication failed. Check your Cloudinary upload preset");
      } else {
        toast.error("Failed to upload image. Please try again.");
      }
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  if (compact) {
    return (
      <div className="relative">
        <label className="cursor-pointer px-4 py-2 bg-[#9f1239] text-white font-mono text-xs hover:bg-[#7f0e2a] transition-colors rounded inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
          <span>📷</span>
          <span>{uploading ? `UPLOADING ${progress}%` : 'UPLOAD IMAGE'}</span>
          <input 
            type="file" 
            className="hidden" 
            onChange={handleUpload} 
            accept="image/*"
            disabled={uploading}
          />
        </label>
        {uploading && (
          <div className="absolute -bottom-8 left-0 text-xs text-zinc-500 font-mono">
            <div className="w-32 h-1 bg-[#333] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#9f1239] transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video bg-[var(--color-line)] border border-dashed border-[var(--color-border)] hover:border-[var(--color-crimson)] transition-colors flex items-center justify-center overflow-hidden rounded-lg group">
      {uploading && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10 font-mono text-xs text-[var(--color-crimson)]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[var(--color-crimson)] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <div className="text-white mb-2 font-bold">UPLOADING...</div>
            <div className="w-48 h-2 bg-black/40 rounded-full overflow-hidden mx-auto">
              <div 
                className="h-full bg-[var(--color-crimson)] transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="mt-2 text-[10px] text-white font-bold">{progress}%</div>
          </div>
        </div>
      )}
      
      {currentImage ? (
        <>
          <img 
            src={currentImage} 
            alt="Preview" 
            className="w-full h-full object-cover transition-all" 
          />
          <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 font-mono text-xs">
            <label className="cursor-pointer text-white hover:text-[var(--color-crimson)] border border-white/30 hover:border-[var(--color-crimson)] px-3 py-1.5 rounded transition-all">
              Change Image
              <input 
                type="file" 
                className="hidden" 
                onChange={handleUpload} 
                accept="image/*"
                disabled={uploading}
              />
            </label>
            <button 
              onClick={onDelete} 
              className="text-white hover:text-red-400 border border-white/30 hover:border-red-500 px-3 py-1.5 rounded transition-all"
              disabled={uploading}
            >
              Delete
            </button>
          </div>
        </>
      ) : (
        <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
          <div className="text-[var(--color-muted)] group-hover:text-[var(--color-paper)] text-xs font-mono tracking-widest text-center p-4">
            <div className="text-3xl mb-2">📷</div>
            <div className="font-bold">UPLOAD IMAGE</div>
            <div className="text-[10px] text-[var(--color-muted)] mt-1">
              Drag & drop or click to browse
            </div>
            <div className="text-[9px] text-[var(--color-muted)]/70 mt-1">
              Supports: JPG, PNG, WebP (Max 10MB)
            </div>
          </div>
          <input 
            type="file" 
            className="hidden" 
            onChange={handleUpload} 
            accept="image/*"
            disabled={uploading}
          />
        </label>
      )}
    </div>
  );
}