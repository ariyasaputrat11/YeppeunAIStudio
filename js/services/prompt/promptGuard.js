import { DEFAULT_GUARDS } from "../../data/templates.js";

export function applyPromptGuard(
  prompt,
  guards = DEFAULT_GUARDS
) {
  return `${prompt}

PROMPT GUARD — non-negotiable:

${guards
  .map((guard, index) => `${index + 1}. ${guard}`)
  .join("\n")}
`;
}