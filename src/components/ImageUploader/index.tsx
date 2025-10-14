"use client";

import React, { useRef, useState } from "react";
import { IconUpload, IconX, IconCheck } from "@tabler/icons-react";
import { useImageUpload } from "@/hooks/useImageUpload";

interface ImageUploaderProps {
  folder?: string;
  maxSizeMB?: number;
  onUploadComplete?: (url: string, path: string) => void;
  existingImageUrl?: string;
}

/**
 * ImageUploader Component
 *
 * A reusable component for uploading images to Firebase Storage
 *
 * @example
 * ```tsx
 * <ImageUploader
 *   folder="tickets"
 *   maxSizeMB={10}
 *   onUploadComplete={(url) => console.log("Uploaded:", url)}
 * />
 * ```
 */
export default function ImageUploader({
  folder = "images",
  maxSizeMB = 5,
  onUploadComplete,
  existingImageUrl,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(
    existingImageUrl || null
  );

  const {
    uploadImage,
    uploading,
    progress,
    error,
    uploadedImage,
    deleteImage,
    reset,
  } = useImageUpload({ folder, maxSizeMB });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    const result = await uploadImage(file);

    if (result && onUploadComplete) {
      onUploadComplete(result.url, result.path);
    }
  };

  const handleRemove = async () => {
    if (uploadedImage?.path) {
      try {
        await deleteImage(uploadedImage.path);
      } catch (error) {
        console.error("Failed to delete image:", error);
      }
    }

    setPreview(null);
    reset();

    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={uploading}
      />

      {/* Upload Area */}
      {!preview ? (
        <button
          type="button"
          onClick={handleClick}
          disabled={uploading}
          className="w-full rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-8 transition-colors hover:border-cyan-500 hover:bg-cyan-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="rounded-full bg-cyan-100 p-3">
              <IconUpload className="h-6 w-6 text-cyan-600" />
            </div>
            <p className="text-sm font-medium text-gray-700">
              {uploading ? "Uploading..." : "Click to upload image"}
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF up to {maxSizeMB}MB
            </p>
          </div>
        </button>
      ) : (
        /* Preview Area */
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="h-48 w-full rounded-lg object-cover"
          />

          {/* Remove Button */}
          {!uploading && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute right-2 top-2 rounded-full bg-red-500 p-2 text-white shadow-lg transition-transform hover:scale-110"
            >
              <IconX className="h-4 w-4" />
            </button>
          )}

          {/* Upload Status */}
          {uploading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-black/50">
              <div className="text-center">
                <div className="mb-2 h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
                <p className="text-sm font-medium text-white">
                  {progress}% uploaded
                </p>
              </div>
            </div>
          )}

          {/* Success Indicator */}
          {uploadedImage && !uploading && (
            <div className="absolute left-2 top-2 rounded-full bg-green-500 p-2 text-white shadow-lg">
              <IconCheck className="h-4 w-4" />
            </div>
          )}
        </div>
      )}

      {/* Progress Bar */}
      {uploading && (
        <div className="mt-2">
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-cyan-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {/* Success Message */}
      {uploadedImage && !uploading && (
        <p className="mt-2 text-sm text-green-600">
          ✓ Image uploaded successfully
        </p>
      )}
    </div>
  );
}
