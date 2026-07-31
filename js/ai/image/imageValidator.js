const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const MAX_SIZE = 8 * 1024 * 1024;

export function validateImage(file) {
  if (!file) {
    throw new Error("File belum dipilih.");
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Gunakan JPG, PNG, atau WEBP.");
  }

  if (file.size > MAX_SIZE) {
    throw new Error("Ukuran maksimal 8 MB.");
  }

  return true;
}