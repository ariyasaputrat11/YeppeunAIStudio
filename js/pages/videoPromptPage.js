import { buildPrompt } from "../services/promptBuilder.js";
import { $ } from "../shared/dom/query.js";
import { showToast } from "../shared/ui/toast.js";
import { copyToClipboard } from "../shared/browser/clipboard.js";
import { downloadText } from "../shared/browser/download.js";

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

$("updateFlowPrompt").addEventListener("click", () => {
  updatePrompt();
  showToast("Prompt Flow diperbarui.");
});

$("copyFlowPrompt").addEventListener("click", async () => {
  await copyToClipboard($("flowPrompt").textContent);
  showToast("Prompt disalin untuk Google Flow.");
});

$("downloadFlowPrompt").addEventListener("click", () => {
  downloadText(
    "yeppeun-studio-google-flow-prompt.txt",
    $("flowPrompt").textContent
  );

  showToast("Prompt berhasil diunduh.");
});

document
  .querySelectorAll("input, select")
  .forEach((field) => field.addEventListener("input", updatePrompt));

updatePrompt();