import imageCompression from 'browser-image-compression';

const COMPRESSION_OPTIONS = {
  maxSizeMB: 0.5, // Target size of 500 KB
  maxWidthOrHeight: 1024, // Max dimensions
  useWebWorker: true, // Use web worker for performance
  fileType: 'image/jpeg', // Convert to JPEG
};

/**
 * Compresses an image file before uploading.
 * @param imageFile The file to compress.
 * @returns A promise that resolves with the compressed file.
 */
export async function compressImage(imageFile: File): Promise<File> {
  console.log(`Original file size: ${(imageFile.size / 1024 / 1024).toFixed(2)} MB`);

  try {
    const compressedFile = await imageCompression(imageFile, COMPRESSION_OPTIONS);
    console.log(`Compressed file size: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);

    // Create a new file with a .jpeg extension
    const newFileName = imageFile.name.substring(0, imageFile.name.lastIndexOf('.')) + '.jpeg';
    return new File([compressedFile], newFileName, {
      type: 'image/jpeg',
      lastModified: Date.now(),
    });
  } catch (error) {
    console.error('Image compression failed:', error);
    throw error;
  }
}
