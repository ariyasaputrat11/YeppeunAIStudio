const API_ROOT = "https://generativelanguage.googleapis.com/v1/models";

function imagePart(asset) {
  return { inlineData: { mimeType: asset.mimeType, data: asset.data } };
}

function providerError(message, status = 502) {
  return Object.assign(new Error(message), { status });
}

async function generateGeminiImage({ prompt, assets }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw providerError("Tambahkan GEMINI_API_KEY di environment server sebelum membuat gambar.", 503);

  const model = process.env.GEMINI_IMAGE_MODEL || "gemini-3.1-flash-image";
  const response = await fetch(`${API_ROOT}/${encodeURIComponent(model)}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
    body: JSON.stringify({
      contents: [{ parts: [...assets.map(imagePart), { text: prompt }] }],
      generationConfig: { responseModalities: ["IMAGE"] },
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw providerError(payload.error?.message || "Gemini tidak dapat memproses render ini.", response.status);

  const parts = payload.candidates?.flatMap((candidate) => candidate.content?.parts || []) || [];
  const image = parts.find((part) => part.inlineData?.data);
  if (!image) throw providerError("Provider tidak mengembalikan gambar. Ubah brief atau coba lagi.");

  const mimeType = image.inlineData.mimeType || "image/png";
  return { imageDataUrl: `data:${mimeType};base64,${image.inlineData.data}`, mimeType, model };
}

module.exports = { generateGeminiImage };
