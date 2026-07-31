import { validateImage } from "./imageValidator.js";
import { generateImage } from "./imageProvider.js";

export async function renderImage({
  product,
  model,
  prompt,
}) {
  validateImage(product);

  if (model) {
    validateImage(model);
  }

  return generateImage({
    product,
    model,
    prompt,
  });
}