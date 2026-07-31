import { $ } from "../shared/dom/query.js";

const valueOf = (id, fallback = "") => {
  const element = $(id);

  if (!element) return fallback;

  return element.value.trim() || fallback;
};

export function getBrief(options = {}) {
  const {
    format = "9:16 vertical",
    showFace = true,
    assets = {},
  } = options;

  return {
    productName: valueOf("productName", "the featured product"),
    category: valueOf("productCategory", "fashion item"),
    color: valueOf("productColor", "the original product color"),
    details: valueOf(
      "productDetails",
      "all visible original design details"
    ),
    style: valueOf(
      "visualStyle",
      "warm candid UGC, shot on a recent smartphone"
    ),
    background: valueOf(
      "background",
      "a natural lifestyle setting"
    ),
    pose: valueOf(
      "pose",
      "a relaxed natural pose"
    ),
    audience: valueOf(
      "audience",
      "a social commerce audience"
    ),
    format,
    showFace,
    hasProductImage: Boolean(assets.product),
    hasModelImage: Boolean(assets.model),
  };
}