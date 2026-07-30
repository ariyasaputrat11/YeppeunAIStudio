import { buildPrompt } from "../services/promptBuilder.js";

const $ = (id) => document.getElementById(id);
const text = (id, fallback) => $(id).value.trim() || fallback;

function getBrief() {
  return {
    productName: text("productName", "the featured product"),
    category: text("productCategory", "fashion item"),
    color: text("productColor", "the original product color"),
    details: text("productDetails", "all visible original design details"),
    style: text("visualStyle", "warm candid UGC, shot on a recent smartphone"),
    background: text("background", "a natural lifestyle setting"),
    pose: text("pose", "a relaxed natural pose"),
    audience: text("audience", "a social commerce audience"),
    format: "9:16 vertical",
    showFace: true,
  };
}

function updatePrompt() {
  $("flowPrompt").textContent = buildPrompt("video", getBrief());
}

function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("visible"), 2600);
}

$("updateFlowPrompt").addEventListener("click", () => { updatePrompt(); showToast("Prompt Flow diperbarui."); });
$("copyFlowPrompt").addEventListener("click", async () => { await navigator.clipboard.writeText($("flowPrompt").textContent); showToast("Prompt disalin untuk Google Flow."); });
$("downloadFlowPrompt").addEventListener("click", () => {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([$("flowPrompt").textContent], { type: "text/plain;charset=utf-8" }));
  link.download = "yeppeun-studio-google-flow-prompt.txt";
  link.click();
  URL.revokeObjectURL(link.href);
});
document.querySelectorAll("input, select").forEach((field) => field.addEventListener("input", updatePrompt));
updatePrompt();
