import { buildKeyVisualPrompt, buildPrompt } from "./promptBuilder.js";

/** Menjaga prompt gambar tetap berbeda dengan prompt video yang ditampilkan di UI. */
export function buildImageRenderPrompt(mode, brief) {
  return mode === "video" ? buildKeyVisualPrompt(brief) : buildPrompt(mode, brief);
}
