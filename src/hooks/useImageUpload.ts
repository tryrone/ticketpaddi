"use client";

import { useState, useCallback } from "react";
import {
  uploadImageToFirebase,
  uploadImageWithProgress,
  deleteImageFromFirebase,
  validateImageFile,
  UploadResult,
} from "@/lib/storage";

interface UseImageUploadOptions {
  folder?: string;
  maxSizeMB?: number;
  allowedTypes?: string[];
}

interface UseImageUploadReturn {
  uploading: boolean;
  progress: number;
  error: string | null;
  uploadedImage: UploadResult | null;
  uploadImage: (file: File) => Promise<UploadResult | null>;
  uploadImageWithProgress: (file: File) => Promise<UploadResult | null>;
  deleteImage: (path: string) => Promise<void>;
  reset: () => void;
}

/**
 * React hook for uploading images to Firebase Storage
 *
 * @param options - Configuration options
 * @returns Upload state and functions
 *
 * @example
 * ```tsx
 * function ImageUploader() {
 *   const { uploadImage, uploading, error, uploadedImage } = useImageUpload({
 *     folder: "tickets",
 *     maxSizeMB: 10,
 *   });
 *
 *   const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
 *     const file = e.target.files?.[0];
 *     if (file) {
 *       const result = await uploadImage(file);
 *       console.log(result?.url);
 *     }
 *   };
 *
 *   return (
 *     <div>
 *       <input type="file" onChange={handleUpload} disabled={uploading} />
 *       {uploading && <p>Uploading...</p>}
 *       {error && <p>Error: {error}</p>}
 *       {uploadedImage && <img src={uploadedImage.url} alt="Uploaded" />}
 *     </div>
 *   );
 * }
 * ```
 */
export const useImageUpload = (
  options: UseImageUploadOptions = {}
): UseImageUploadReturn => {
  const {
    folder = "images",
    maxSizeMB = 5,
    allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ],
  } = options;

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<UploadResult | null>(null);

  /**
   * Upload an image file (simple upload without progress)
   */
  const uploadImage = useCallback(
    async (file: File): Promise<UploadResult | null> => {
      setUploading(true);
      setError(null);
      setProgress(0);

      try {
        // Validate file
        validateImageFile(file, maxSizeMB, allowedTypes);

        // Upload to Firebase
        const result = await uploadImageToFirebase(file, folder);

        setUploadedImage(result);
        setProgress(100);
        return result;
      } catch (err: AnyType) {
        const errorMessage = err.message || "Failed to upload image";
        setError(errorMessage);
        console.error("Upload error:", err);
        return null;
      } finally {
        setUploading(false);
      }
    },
    [folder, maxSizeMB, allowedTypes]
  );

  /**
   * Upload an image file with progress tracking
   */
  const uploadImageWithProgressTracking = useCallback(
    async (file: File): Promise<UploadResult | null> => {
      setUploading(true);
      setError(null);
      setProgress(0);

      try {
        // Validate file
        validateImageFile(file, maxSizeMB, allowedTypes);

        // Upload to Firebase with progress tracking
        const result = await uploadImageWithProgress(
          file,
          folder,
          undefined,
          (progressPercent) => {
            setProgress(progressPercent);
          }
        );

        setUploadedImage(result);
        return result;
      } catch (err: AnyType) {
        const errorMessage = err.message || "Failed to upload image";
        setError(errorMessage);
        console.error("Upload error:", err);
        return null;
      } finally {
        setUploading(false);
      }
    },
    [folder, maxSizeMB, allowedTypes]
  );

  /**
   * Delete an image from Firebase Storage
   */
  const deleteImage = useCallback(async (path: string): Promise<void> => {
    setError(null);

    try {
      await deleteImageFromFirebase(path);

      // Clear uploaded image if it matches the deleted path
      setUploadedImage((prev) => (prev?.path === path ? null : prev));
    } catch (err: AnyType) {
      const errorMessage = err.message || "Failed to delete image";
      setError(errorMessage);
      console.error("Delete error:", err);
      throw err;
    }
  }, []);

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setUploading(false);
    setProgress(0);
    setError(null);
    setUploadedImage(null);
  }, []);

  return {
    uploading,
    progress,
    error,
    uploadedImage,
    uploadImage,
    uploadImageWithProgress: uploadImageWithProgressTracking,
    deleteImage,
    reset,
  };
};
