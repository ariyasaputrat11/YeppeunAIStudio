import { buildSharedContext } from "./sharedContext.js";
import { applyPromptGuard } from "./promptGuard.js";

export function buildVideoPrompt(brief) {
  const prompt = `
${buildSharedContext(brief)}

Generate one authentic 9–12 second vertical TikTok affiliate video.

The video must feel like genuine UGC
recorded using a modern smartphone.

Timeline

0–3 seconds (HOOK)

Creator naturally looks at camera
and says:

"${brief.productName} ini ternyata bagus banget pas dipakai."

No acting.
No commercial vibe.

3–8 seconds (SPILL PRODUCT)

Creator naturally demonstrates the product.

Show:

• texture
• stitching
• material
• color
• details

Creator says:

"Nih, lihat detailnya...
bahannya kelihatan premium banget."

Keep the product in exactly the same position.

No teleport.
No disappearing.
No duplicated object.

8–12 seconds (OUTRO)

Creator smiles naturally.

Says:

"Aku taruh linknya di keranjang kuning ya."

Camera:

• handheld smartphone
• natural micro movement
• realistic autofocus
• no cinematic movement

Audio:

One Indonesian female voice.

Natural room ambience.

No background music.

Everything must look indistinguishable from real footage.
`;

  return applyPromptGuard(prompt);
}