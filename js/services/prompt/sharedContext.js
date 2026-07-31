const clean = (text) =>
  text.replace(/\s+/g, " ").trim();

export function buildSharedContext(brief) {
  return clean(`
    Create realistic social commerce content for ${brief.productName}, a ${brief.category} in ${brief.color}.

    Preserve these non-negotiable product traits:
    ${brief.details}.

    Visual direction:
    ${brief.style}

    Background:
    ${brief.background}

    Audience:
    ${brief.audience}

    Format:
    ${brief.format}

    ${
      brief.showFace
        ? "Keep the same face and recognizable identity as the supplied model reference."
        : "Frame the talent naturally without requiring a recognizable face."
    }
  `);
}