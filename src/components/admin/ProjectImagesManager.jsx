/* eslint-disable no-unused-vars */
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET;

// Helper function to compress and resize image using canvas
const compressImage = (file, maxWidth = 1600, maxHeight = 1600, quality = 0.85) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

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

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Canvas to Blob conversion failed"));
            }
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = () => reject(new Error("Image load failed"));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error("File read failed"));
    reader.readAsDataURL(file);
  });
};

export default function ProjectImagesManager({ images = [], onChange, projectIndex = 0 }) {
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);

  // Normalize images array
  const currentImages = Array.isArray(images) ? images.filter(Boolean) : [];

  const handleAddImage = (url) => {
    if (!url || typeof url !== "string" || !url.trim()) return;
    const trimmed = url.trim();
    const updated = [...currentImages, trimmed];
    onChange(updated);
    toast.success("Project image added!");
  };

  const handleRemoveImage = (index) => {
    const updated = currentImages.filter((_, i) => i !== index);
    onChange(updated);
    toast.success("Image removed");
  };

  const handleMove = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= currentImages.length) return;

    const updated = [...currentImages];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    onChange(updated);
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      toast.error("Cloudinary is not configured in .env");
      return;
    }

    setUploading(true);
    let successCount = 0;
    const newUploadedUrls = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!file.type.match("image.*")) {
        toast.error(`${file.name} is not a valid image file`);
        continue;
      }

      if (file.size > 15 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 15MB size limit`);
        continue;
      }

      try {
        toast.loading(`Compressing & uploading ${i + 1}/${files.length}...`, { id: "proj-upload" });
        const compressedBlob = await compressImage(file, 1600, 1600, 0.85);

        const formData = new FormData();
        formData.append("file", compressedBlob, file.name);
        formData.append("upload_preset", UPLOAD_PRESET);
        formData.append("folder", "portfolio_projects");

        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          formData
        );

        if (res.data?.secure_url) {
          newUploadedUrls.push(res.data.secure_url);
          successCount++;
        }
      } catch (err) {
        console.error("Upload error:", err);
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    setUploading(false);
    toast.dismiss("proj-upload");

    if (newUploadedUrls.length > 0) {
      onChange([...currentImages, ...newUploadedUrls]);
      toast.success(`Successfully uploaded ${successCount} image(s)!`);
    }

    // Reset input
    e.target.value = "";
  };

  const handleAddFromUrl = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    handleAddImage(urlInput.trim());
    setUrlInput("");
    setShowUrlInput(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block font-mono text-[10px] text-[var(--color-muted)] uppercase tracking-widest border-l-2 border-[var(--color-crimson)] pl-2">
          Project Screenshots & Gallery ({currentImages.length} images)
        </label>
        <span className="font-mono text-[10px] text-[var(--color-muted)]">
          {currentImages.length === 0 ? "No images added" : `#1 is Main Cover`}
        </span>
      </div>

      {/* Gallery Grid Preview */}
      {currentImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          <AnimatePresence>
            {currentImages.map((imgUrl, idx) => (
              <motion.div
                key={`${imgUrl}-${idx}`}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`group relative aspect-[16/10] rounded-xl overflow-hidden border ${
                  idx === 0
                    ? "border-[var(--color-crimson)] ring-2 ring-[var(--color-crimson)]/30"
                    : "border-[var(--color-border)]"
                } bg-[var(--color-bg)] shadow-sm`}
              >
                <img
                  src={imgUrl}
                  alt={`Screenshot ${idx + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Cover Badge on #1 */}
                <div className="absolute top-1.5 left-1.5 z-10">
                  {idx === 0 ? (
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[var(--color-crimson)] text-white shadow">
                      ★ COVER
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-black/60 backdrop-blur-md text-white">
                      #{idx + 1}
                    </span>
                  )}
                </div>

                {/* Hover Action Controls */}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1.5">
                  {/* Move Left */}
                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={() => handleMove(idx, -1)}
                      className="w-6 h-6 rounded bg-white/20 hover:bg-white/40 text-white font-mono text-xs flex items-center justify-center transition-colors"
                      title="Move earlier"
                    >
                      ←
                    </button>
                  )}

                  {/* Move Right */}
                  {idx < currentImages.length - 1 && (
                    <button
                      type="button"
                      onClick={() => handleMove(idx, 1)}
                      className="w-6 h-6 rounded bg-white/20 hover:bg-white/40 text-white font-mono text-xs flex items-center justify-center transition-colors"
                      title="Move later"
                    >
                      →
                    </button>
                  )}

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="w-6 h-6 rounded bg-red-500 hover:bg-red-600 text-white font-mono text-xs flex items-center justify-center transition-colors ml-1"
                    title="Remove image"
                  >
                    ×
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Upload Actions & Buttons */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          {/* Multi-file Upload Input */}
          <label className="cursor-pointer px-3.5 py-2 rounded-xl border border-dashed border-[var(--color-border)] hover:border-[var(--color-crimson)] bg-[var(--color-bg)] hover:bg-[var(--color-line)] transition-all text-xs font-mono text-[var(--color-paper)] flex items-center gap-2 shadow-sm">
            <span>{uploading ? "⏳ Uploading..." : "📷 Upload Images"}</span>
            <span className="text-[10px] text-[var(--color-muted)]">(Multi-select)</span>
            <input
              type="file"
              multiple
              accept="image/*"
              disabled={uploading}
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {/* Add via URL toggle */}
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="px-3 py-2 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-crimson)] bg-[var(--color-bg)] text-xs font-mono text-[var(--color-muted)] hover:text-[var(--color-paper)] transition-all"
          >
            {showUrlInput ? "✕ Cancel URL" : "+ Paste URL"}
          </button>
        </div>

        {/* URL Input Form */}
        {showUrlInput && (
          <form onSubmit={handleAddFromUrl} className="flex gap-2 items-center pt-1">
            <input
              type="url"
              placeholder="https://example.com/screenshot.jpg"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-xs font-mono text-[var(--color-paper)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-crimson)]"
            />
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl bg-[var(--color-crimson)] text-white text-xs font-mono font-bold hover:opacity-90 transition-all"
            >
              Add
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
