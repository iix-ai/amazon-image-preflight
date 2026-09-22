const unreadableMetadata = (file) => ({
  readable: false,
  width: 0,
  height: 0,
  longestSide: 0,
  mimeType: file.type,
  byteSize: file.size,
  hasTransparency: false,
});

const hasAlphaPixels = (pixels) => {
  for (let index = 3; index < pixels.length; index += 4) {
    if (pixels[index] < 255) return true;
  }
  return false;
};

export const loadImageForAnalysis = async (file, adapters = {}) => {
  const createObjectUrl = adapters.createObjectUrl ?? ((value) => URL.createObjectURL(value));
  const revokeObjectUrl = adapters.revokeObjectUrl ?? ((value) => URL.revokeObjectURL(value));
  const createImage = adapters.createImage ?? (() => new Image());
  const createCanvas = adapters.createCanvas ?? (() => document.createElement("canvas"));
  const objectUrl = createObjectUrl(file);

  try {
    const image = await new Promise((resolve, reject) => {
      const element = createImage();
      element.onload = () => resolve(element);
      element.onerror = () => reject(new Error("The browser could not decode this image."));
      element.src = objectUrl;
    });
    const canvas = createCanvas();
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) throw new Error("Canvas 2D context is unavailable.");
    context.drawImage(image, 0, 0);
    const imageData = context.getImageData(0, 0, image.width, image.height);
    const metadata = {
      readable: true,
      width: image.width,
      height: image.height,
      longestSide: Math.max(image.width, image.height),
      mimeType: file.type,
      byteSize: file.size,
      hasTransparency: hasAlphaPixels(imageData.data),
    };
    return { metadata, pixels: imageData.data };
  } catch {
    return { metadata: unreadableMetadata(file), pixels: new Uint8ClampedArray() };
  } finally {
    revokeObjectUrl(objectUrl);
  }
};
