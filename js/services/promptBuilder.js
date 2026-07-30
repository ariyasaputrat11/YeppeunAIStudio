import { DEFAULT_GUARDS } from "../data/templates.js";

const clean = (text) => text.replace(/\s+/g, " ").trim();

function sharedContext(brief) {
  return clean(`
    Create realistic social commerce content for ${brief.productName}, a ${brief.category} in ${brief.color}.
    Preserve these non-negotiable product traits: ${brief.details}.
    Visual direction: ${brief.style}. Location: ${brief.background}.
    The audience is ${brief.audience}. Framing: ${brief.format}.
    ${brief.showFace ? "Keep the same face and recognizable identity as the supplied model reference." : "Frame the talent naturally without requiring a recognizable face."}
  `);
}

function guarded(prompt, guards = DEFAULT_GUARDS) {
  return `${prompt}\n\nPROMPT GUARD — non-negotiable:\n${guards.map((guard, index) => `${index + 1}. ${guard}`).join("\n")}`;
}

export function buildVideoPrompt(brief) {
  const prompt = `${sharedContext(brief)}

Generate one authentic 9–12 second vertical TikTok affiliate video, as three clearly paced beats in a single continuous take. Natural smartphone camera behavior, realistic skin, honest product scale, soft room tone, no polished commercial look.

BEAT 1 — HOOK (0–3s): The creator enters frame or faces the camera with a natural micro-expression. She says in Indonesian: “${brief.productName} ini ternyata bagus banget pas dipakai.” Start on a medium shot, immediate and conversational.

BEAT 2 — PRODUCT SPILL (3–8s): Smoothly move closer while the creator ${brief.pose}. Let the camera linger on the material, construction, ${brief.color} color, and ${brief.details}. She says: “Nih, lihat detailnya—bahannya kelihatan dan terasa premium.” The product stays in the same hand / on the same body position throughout.

BEAT 3 — OUTRO (8–12s): Return to a flattering medium shot. The creator gives one natural approving nod and says: “Aku taruh link-nya di keranjang kuning, ya.” End with an unforced smile, not a posed freeze frame.

Audio: one clear female Indonesian voice, natural casual delivery, light room ambience only. Camera: one handheld smartphone, subtle realistic micro-movement, no cinematic whip-pan.`;
  return guarded(prompt);
}

export function buildEnhancePrompt(brief) {
  const prompt = `${sharedContext(brief)}

Enhance the supplied source photograph only. Deliver a high-resolution, photorealistic result with refined but believable sharpness, corrected white balance, accurate ${brief.color} color, softly recovered highlights, clean fabric detail, and natural skin texture. Keep the original composition, subject identity, pose, background geometry, product silhouette, branding and all physical details unchanged. Avoid beauty-filter skin, oversharpening, plastic texture, invented accessories, or artificial bokeh.`;
  return guarded(prompt, DEFAULT_GUARDS.slice(0, 4));
}

export function buildFitPrompt(brief) {
  const prompt = `${sharedContext(brief)}

Using the supplied product photo and model photo as locked references, create one photorealistic ${brief.format} lifestyle image. Dress or place the exact product naturally on the supplied model. The model is ${brief.pose}. Make fit, drape, reflections, wrinkles, perspective, contact points, hand placement and cast shadows physically believable. The product must retain its exact ${brief.color} color, ${brief.details}, silhouette and proportions from the product reference. Do not alter the model's facial identity, body proportions, skin tone or hair. Use the requested background: ${brief.background}.`;
  return guarded(prompt);
}

export function buildDetailPrompt(brief) {
  const prompt = `${sharedContext(brief)}

Create a natural macro product-spill sequence for ${brief.productName}. Start with a clean hero close-up, then show one deliberate hand interaction revealing the material surface, weave or texture, stitching, hardware, edges and ${brief.details}. Use soft directional daylight and accurate ${brief.color} color. Keep the product centered, objectively sized, fully intact, and free of invented labels or details. The result should feel like a candid creator review, not a CGI product render.`;
  return guarded(prompt, DEFAULT_GUARDS.slice(0, 4));
}

export function buildKeyVisualPrompt(brief) {
  const prompt = `${sharedContext(brief)}

Create one high-resolution, photorealistic vertical key visual for an authentic TikTok affiliate video. The supplied product and model images are locked references. The creator is in ${brief.background}, ${brief.pose}, holding or wearing the exact product in a natural, believable way. She looks like she is about to share an honest recommendation; candid micro-expression, realistic smartphone exposure, subtle hand-held framing, genuine skin texture and natural daylight. Give product details, material, color, scale, shadows and contact points absolute physical realism. No visible UI, captions, prices, yellow basket, stickers or text overlays.`;
  return guarded(prompt);
}

export function buildPrompt(mode, brief) {
  switch (mode) {
    case "enhance": return buildEnhancePrompt(brief);
    case "fit": return buildFitPrompt(brief);
    case "detail": return buildDetailPrompt(brief);
    default: return buildVideoPrompt(brief);
  }
}
