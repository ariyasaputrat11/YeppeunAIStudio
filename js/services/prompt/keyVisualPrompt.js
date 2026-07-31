import { buildSharedContext } from "./sharedContext.js";
import { applyPromptGuard } from "./promptGuard.js";

export function buildKeyVisualPrompt(brief) {
  const prompt = `
${buildSharedContext(brief)}

Create one high-resolution photorealistic vertical key visual.

Purpose:

A thumbnail or hero image for an authentic TikTok affiliate video.

The supplied product and model images are locked references.

Requirements:

• preserve exact product appearance
• preserve exact facial identity
• preserve exact product color
• preserve exact product proportions

Scene:

${brief.background}

Pose:

${brief.pose}

The creator naturally wears or holds the product.

Expression:

Natural.
Friendly.
Trustworthy.

Lighting:

Soft natural daylight.

Camera:

Modern smartphone.

No studio lighting.

No cinematic grading.

No exaggerated HDR.

No AI look.

No CGI look.

No floating objects.

No duplicated objects.

No text overlay.

No watermark.

Everything must appear indistinguishable from a real smartphone photograph.
`;

  return applyPromptGuard(prompt);
}