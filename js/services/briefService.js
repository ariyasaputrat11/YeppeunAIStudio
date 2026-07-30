const valueOf = (id) => document.getElementById(id).value.trim();

export function getBrief(state) {
  return {
    productName: valueOf("productName") || "the featured product",
    category: valueOf("productCategory"),
    color: valueOf("productColor") || "the original product color",
    details: valueOf("productDetails") || "all visible original design details",
    style: valueOf("visualStyle"),
    background: valueOf("background") || "a natural lifestyle setting",
    pose: valueOf("pose") || "a relaxed natural pose",
    audience: valueOf("audience") || "a social commerce audience",
    format: state.format,
    showFace: document.getElementById("showFace").checked,
    hasProductImage: state.uploads.product,
    hasModelImage: state.uploads.model,
  };
}
