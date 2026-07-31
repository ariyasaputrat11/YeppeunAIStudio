import { buildSharedContext } from "./sharedContext.js";
import { applyPromptGuard } from "./promptGuard.js";

export function buildFitPrompt(brief) {
  const prompt = `
${buildSharedContext(brief)}

Using the supplied product photo and model photo as locked references,
create one photorealistic ${brief.format} lifestyle image.

Dress or place the exact product naturally
on the supplied model.

The model is:

${brief.pose}

Requirements:

- physically correct fit
- realistic fabric drape
- natural wrinkles
- believable reflections
- correct perspective
- realistic contact points
- accurate cast shadows

The product must retain:

- exact ${brief.color} color
- exact silhouette
- exact proportions
- exact details:
${brief.details}

Do not alter:

- facial identity
- skin tone
- body proportions
- hairstyle

Background:

${brief.background}
`;

  return applyPromptGuard(prompt);
}