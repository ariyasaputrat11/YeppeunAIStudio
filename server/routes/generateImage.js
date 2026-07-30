const { generateGeminiImage } = require("../providers/geminiImage");
const { readJson, sendJson } = require("../utils/http");

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

function validateRequest({ prompt, assets }) {
  if (typeof prompt !== "string" || prompt.trim().length < 20) throw Object.assign(new Error("Prompt belum cukup lengkap."), { status: 400 });
  if (prompt.length > 16000) throw Object.assign(new Error("Prompt terlalu panjang."), { status: 400 });
  if (!Array.isArray(assets) || assets.length === 0) throw Object.assign(new Error("Unggah minimal satu foto referensi."), { status: 400 });
  if (assets.length > 4) throw Object.assign(new Error("Maksimal empat foto referensi."), { status: 400 });

  for (const asset of assets) {
    if (!allowedMimeTypes.has(asset.mimeType)) throw Object.assign(new Error("Gunakan foto JPG, PNG, atau WEBP."), { status: 400 });
    if (typeof asset.data !== "string" || asset.data.length < 20 || asset.data.length > 11 * 1024 * 1024) {
      throw Object.assign(new Error("Salah satu file gambar tidak valid atau terlalu besar."), { status: 400 });
    }
  }
}

async function handleGenerateImage(request, response) {
  try {
    const body = await readJson(request);
    validateRequest(body);
    const result = await generateGeminiImage(body);
    sendJson(response, 200, result);
  } catch (error) {
    sendJson(response, error.status || 500, { error: error.message || "Terjadi masalah saat membuat gambar." });
  }
}

module.exports = { handleGenerateImage };
