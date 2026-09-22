export const validImage = {
  readable: true,
  width: 2000,
  height: 2000,
  longestSide: 2000,
  mimeType: "image/jpeg",
  byteSize: 2_400_000,
  hasTransparency: false,
};

export const tooSmallImage = {
  ...validImage,
  width: 400,
  height: 400,
  longestSide: 400,
};

export const transparentPng = {
  ...validImage,
  mimeType: "image/png",
  hasTransparency: true,
};

export const hugeImageFile = {
  ...validImage,
  byteSize: 11_000_000,
};

export const portraitImage = {
  ...validImage,
  width: 800,
  height: 2000,
  longestSide: 2000,
};
