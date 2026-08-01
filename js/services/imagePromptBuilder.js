import { buildPrompt } from "./promptBuilder.js";
import { buildKeyVisualPrompt } from "./prompt/keyVisualPrompt.js";

/** Menjaga prompt gambar tetap berbeda dengan prompt video yang ditampilkan di UI. */
export function buildImageRenderPrompt(mode, brief) {
  return mode === "video"
    ? buildKeyVisualPrompt(brief)
    : buildPrompt(mode, brief);
}