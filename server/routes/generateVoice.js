const { generateGeminiVoice } = require("../providers/geminiTts");
const { readJson, sendJson } = require("../utils/http");

const allowedVoices = new Set(["Kore", "Aoede", "Achird", "Sulafat"]);

function validationError(message) {
  return Object.assign(new Error(message), { status: 400 });
}

function validateRequest({ script, voice, direction }) {
  if (typeof script !== "string" || script.trim().length < 12) throw validationError("Naskah voice-over masih terlalu pendek.");
  if (script.length > 1800) throw validationError("Naskah maksimal 1.800 karakter.");
  if (!allowedVoices.has(voice)) throw validationError("Karakter suara yang dipilih tidak tersedia.");
  if (typeof direction !== "string" || direction.length < 20 || direction.length > 1800) throw validationError("Arahan gaya suara tidak valid.");
}

async function handleGenerateVoice(request, response) {
  try {
    const body = await readJson(request, 80 * 1024);
    validateRequest(body);
    const result = await generateGeminiVoice(body);
    sendJson(response, 200, result);
  } catch (error) {
    sendJson(response, error.status || 500, { error: error.message || "Terjadi masalah saat membuat voice-over." });
  }
}

module.exports = { handleGenerateVoice };
