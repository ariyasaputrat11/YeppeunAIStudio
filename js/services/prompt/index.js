import { buildEnhancePrompt } from "./enhancePrompt.js";
import { buildFitPrompt } from "./fitPrompt.js";
import { buildDetailPrompt } from "./detailPrompt.js";
import { buildVideoPrompt } from "./videoPrompt.js";
import { buildKeyVisualPrompt } from "./keyVisualPrompt.js";

export function buildPrompt(mode, brief) {
  switch (mode) {
    case "enhance":
      return buildEnhancePrompt(brief);

    case "fit":
      return buildFitPrompt(brief);

    case "detail":
      return buildDetailPrompt(brief);

    case "keyVisual":
      return buildKeyVisualPrompt(brief);

    case "video":
    default:
      return buildVideoPrompt(brief);
  }
}