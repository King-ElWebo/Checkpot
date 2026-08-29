/**
 * Compresses/resizes an image file in the browser before uploading.
 * Preserves format characteristics:
 * - PNG: Resized if needed, output as image/png preserving full alpha transparency.
 * - JPEG/JPG: Resized and compressed as image/jpeg.
 * - WebP: Resized and compressed as image/webp.
 *
 * @param file The original image file
 * @param maxWidth The maximum width of the image (default 1920)
 * @param quality The JPEG/WebP quality 0-1 (default 0.8)
 * @returns A compressed/resized File object matching the source format
 */
export async function compressImage(file: File, maxWidth = 1920, quality = 0.8): Promise<File> {
  const fileType = file.type.toLowerCase();

  // If not a recognized raster image type, return as-is
  if (
    !fileType.startsWith("image/") ||
    fileType === "image/svg+xml" ||
    fileType === "image/gif"
  ) {
    return file;
  }

  const isPng = fileType === "image/png" || file.name.toLowerCase().endsWith(".png");
  const isWebp = fileType === "image/webp" || file.name.toLowerCase().endsWith(".webp");
  const isJpeg =
    fileType === "image/jpeg" ||
    fileType === "image/jpg" ||
    file.name.toLowerCase().endsWith(".jpg") ||
    file.name.toLowerCase().endsWith(".jpeg");

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file); // fallback
          return;
        }

        // For JPEG, fill background with white (JPEG has no alpha channel)
        // For PNG and WebP, clear canvas to preserve full transparent alpha channel
        if (isJpeg) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, width, height);
        } else {
          ctx.clearRect(0, 0, width, height);
        }

        ctx.drawImage(img, 0, 0, width, height);

        let outputMimeType = "image/jpeg";
        let outputExtension = ".jpg";
        let outputQuality: number | undefined = quality;

        if (isPng) {
          outputMimeType = "image/png";
          outputExtension = ".png";
          outputQuality = undefined;
        } else if (isWebp) {
          outputMimeType = "image/webp";
          outputExtension = ".webp";
          outputQuality = quality;
        }

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file); // fallback
              return;
            }

            const originalBase = file.name.replace(/\.[^/.]+$/, "");
            const newFilename = `${originalBase}${outputExtension}`;

            const compressedFile = new File([blob], newFilename, {
              type: outputMimeType,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          outputMimeType,
          outputQuality
        );
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
}
