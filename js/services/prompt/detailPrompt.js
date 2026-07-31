import { buildSharedContext } from "./sharedContext.js";
import { applyPromptGuard } from "./promptGuard.js";

export function buildDetailPrompt(brief) {
  const prompt = `
${buildSharedContext(brief)}

Create a realistic product detail showcase.

Focus on:

- fabric texture
- stitching
- seams
- labels
- zipper
- buttons
- hardware
- material quality
- craftsmanship

Show one natural hand interaction
revealing the product naturally.

Product:

${brief.productName}

Color:

${brief.color}

Important product details:

${brief.details}

Lighting:

Soft natural daylight.

Style:

Authentic TikTok affiliate creator.

Avoid exaggerated HDR,
CGI appearance,
plastic texture,
or fake material.
`;

  return applyPromptGuard(prompt);
}