import { buildSharedContext } from "./sharedContext.js";
import { applyPromptGuard } from "./promptGuard.js";

export function buildEnhancePrompt(brief) {
  const prompt = `
${buildSharedContext(brief)}

Enhance the supplied source photograph only.

Deliver a high-resolution, photorealistic result with refined but believable
sharpness, corrected white balance, accurate ${brief.color} color,
softly recovered highlights, clean fabric detail, and natural skin texture.

Keep the original composition, subject identity, pose,
background geometry, product silhouette,
branding and all physical details unchanged.

Avoid:

- beauty-filter skin
- oversharpening
- plastic texture
- invented accessories
- artificial bokeh
`;

  return applyPromptGuard(prompt);
}