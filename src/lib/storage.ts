import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  UploadTask,
} from "firebase/storage";
import { storage } from "./firebase";

/**
 * Upload result type
 */
export interface UploadResult {
  url: string;
  path: string;
  filename: string;
}

export type UploadProgressCallback = (progress: number) => void;

/**
 * Upload an image file to Firebase Storage and make it publicly accessible
 *
 * @param file - The File or Blob to upload
 * @param folder - The folder path in storage (e.g., "images", "tickets", "avatars")
 * @param filename - Optional custom filename (if not provided, uses original filename or generates one)
 * @returns Promise with the public URL, storage path, and filename
 *
 * @example
 * ```ts
 * const file = event.target.files[0];
 * const result = await uploadImageToFirebase(file, "tickets");
 * console.log(result.url); // https://firebasestorage.googleapis.com/...
 * ```
 */
export const uploadImageToFirebase = async (
  file: File | Blob,
  folder: string = "images",
  filename?: string
): Promise<UploadResult> => {
  if (!storage) {
    throw new Error("Firebase Storage is not initialized");
  }

  try {
    // Generate filename if not provided
    const finalFilename =
      filename ||
      (file instanceof File
        ? file.name
        : `${Date.now()}-${Math.random().toString(36).substring(7)}`);

    // Create storage reference
    const storageRef = ref(storage, `${folder}/${finalFilename}`);

    // Set metadata
    const metadata = {
      contentType: file.type || "image/jpeg",
      customMetadata: {
        uploadedAt: new Date().toISOString(),
      },
    };

    // Upload file
    const snapshot = await uploadBytes(storageRef, file, metadata);

    // Get public download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log("✅ File uploaded successfully:", downloadURL);

    return {
      url: downloadURL,
      path: snapshot.ref.fullPath,
      filename: finalFilename,
    };
  } catch (error) {
    console.error("❌ Error uploading file to Firebase Storage:", error);
    throw error;
  }
};

/**
 * Upload a file with progress tracking (useful for large files)
 *
 * @param file - The File or Blob to upload
 * @param folder - The folder path in storage
 * @param filename - Optional custom filename
 * @param onProgress - Callback function to track upload progress (0-100)
 * @returns Promise with the upload result
 *
 * @example
 * ```ts
 * const result = await uploadImageWithProgress(
 *   file,
 *   "tickets",
 *   undefined,
 *   (progress) => console.log(`Upload: ${progress}%`)
 * );
 * ```
 */
export const uploadImageWithProgress = (
  file: File | Blob,
  folder: string = "images",
  filename?: string,
  onProgress?: UploadProgressCallback
): Promise<UploadResult> => {
  if (!storage) {
    throw new Error("Firebase Storage is not initialized");
  }

  return new Promise((resolve, reject) => {
    try {
      // Generate filename if not provided
      const finalFilename =
        filename ||
        (file instanceof File
          ? file.name
          : `${Date.now()}-${Math.random().toString(36).substring(7)}`);

      // Create storage reference
      const storageRef = ref(storage, `${folder}/${finalFilename}`);

      // Set metadata
      const metadata = {
        contentType: file.type || "image/jpeg",
        customMetadata: {
          uploadedAt: new Date().toISOString(),
        },
      };

      // Create upload task
      const uploadTask: UploadTask = uploadBytesResumable(
        storageRef,
        file,
        metadata
      );

      // Monitor upload progress
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Calculate progress percentage
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          // Call progress callback
          if (onProgress) {
            onProgress(Math.round(progress));
          }

          console.log(`Upload is ${progress.toFixed(1)}% done`);
        },
        (error) => {
          // Handle upload errors
          console.error("❌ Upload error:", error);
          reject(error);
        },
        async () => {
          // Upload completed successfully
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            console.log("✅ File uploaded successfully:", downloadURL);

            resolve({
              url: downloadURL,
              path: uploadTask.snapshot.ref.fullPath,
              filename: finalFilename,
            });
          } catch (error) {
            reject(error);
          }
        }
      );
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Delete a file from Firebase Storage
 *
 * @param path - The full path to the file in storage
 * @returns Promise that resolves when file is deleted
 *
 * @example
 * ```ts
 * await deleteImageFromFirebase("images/photo-123.jpg");
 * ```
 */
export const deleteImageFromFirebase = async (path: string): Promise<void> => {
  if (!storage) {
    throw new Error("Firebase Storage is not initialized");
  }

  try {
    const fileRef = ref(storage, path);
    await deleteObject(fileRef);
    console.log("✅ File deleted successfully:", path);
  } catch (error) {
    console.error("❌ Error deleting file from Firebase Storage:", error);
    throw error;
  }
};

/**
 * Upload multiple images at once
 *
 * @param files - Array of files to upload
 * @param folder - The folder path in storage
 * @returns Promise with array of upload results
 *
 * @example
 * ```ts
 * const files = Array.from(event.target.files);
 * const results = await uploadMultipleImages(files, "gallery");
 * console.log(results); // [{ url: "...", path: "...", filename: "..." }, ...]
 * ```
 */
export const uploadMultipleImages = async (
  files: (File | Blob)[],
  folder: string = "images"
): Promise<UploadResult[]> => {
  const uploadPromises = files.map((file) =>
    uploadImageToFirebase(file, folder)
  );

  try {
    const results = await Promise.all(uploadPromises);
    console.log(`✅ Successfully uploaded ${results.length} files`);
    return results;
  } catch (error) {
    console.error("❌ Error uploading multiple files:", error);
    throw error;
  }
};

/**
 * Validate image file before upload
 *
 * @param file - File to validate
 * @param maxSizeMB - Maximum file size in MB (default: 5MB)
 * @param allowedTypes - Array of allowed MIME types
 * @returns true if valid, throws error if invalid
 *
 * @example
 * ```ts
 * try {
 *   validateImageFile(file, 10, ["image/jpeg", "image/png"]);
 *   await uploadImageToFirebase(file, "images");
 * } catch (error) {
 *   console.error(error.message);
 * }
 * ```
 */
export const validateImageFile = (
  file: File,
  maxSizeMB: number = 5,
  allowedTypes: string[] = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ]
): boolean => {
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`
    );
  }

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    throw new Error(`File size exceeds ${maxSizeMB}MB limit`);
  }

  return true;
};

/**
 * Generate a unique filename with timestamp and random string
 *
 * @param originalFilename - Original filename (optional)
 * @param prefix - Prefix for the filename (optional)
 * @returns Generated unique filename
 *
 * @example
 * ```ts
 * const filename = generateUniqueFilename("photo.jpg", "ticket");
 * // Returns: "ticket-1234567890-abc123.jpg"
 * ```
 */
export const generateUniqueFilename = (
  originalFilename?: string,
  prefix?: string
): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(7);
  const extension = originalFilename?.split(".").pop() || "jpg";

  if (prefix) {
    return `${prefix}-${timestamp}-${randomString}.${extension}`;
  }

  return `${timestamp}-${randomString}.${extension}`;
};
