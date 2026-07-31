import { buildPrompt } from "../services/promptBuilder.js";
import { submitRenderJob } from "../services/renderGateway.js";

import { $ } from "../shared/dom/query.js";
import { showToast } from "../shared/ui/toast.js";
import { copyToClipboard } from "../shared/browser/clipboard.js";
import { downloadImage } from "../shared/browser/download.js";

const tool = document.body.dataset.tool;
const config = {
  enhance: { promptMode: "enhance", needsModel: false, title: "Prompt enhance natural" },
  fit: { promptMode: "fit", needsModel: true, title: "Prompt AI fit" },
  style: { promptMode: "fit", needsModel: true, title: "Prompt style & pose" },
}[tool];

const state = { assets: { product: null, model: null }, result: null };

const text = (id, fallback) => $(id)?.value.trim() || fallback;



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
    format: text("format", "9:16 vertical"),
    showFace: true,
    hasProductImage: Boolean(state.assets.product),
    hasModelImage: Boolean(state.assets.model),
  };
}

function buildCurrentPrompt() {
  return buildPrompt(config.promptMode, getBrief());
}

function renderPrompt() {
  $("toolPrompt").textContent = buildCurrentPrompt();
  $("promptTitle").textContent = config.title;
}

function readAsset(file, role) {
  if (file.size > 8 * 1024 * 1024) throw new Error("Maksimal ukuran satu foto adalah 8 MB.");
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) throw new Error("Gunakan foto JPG, PNG, atau WEBP.");
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ data: reader.result.split(",")[1], mimeType: file.type, role });
    reader.onerror = () => reject(new Error("Foto tidak bisa dibaca."));
    reader.readAsDataURL(file);
  });
}

function setupAssetInput(role) {
  const input = document.querySelector(`[data-asset="${role}"]`);
  if (!input) return;
  input.addEventListener("change", async () => {
    const file = input.files?.[0];
    if (!file) return;
    try {
      state.assets[role] = await readAsset(file, role);
      const target = document.querySelector(`[data-preview="${role}"]`);
      target.src = URL.createObjectURL(file);
      target.closest(".focused-upload").classList.add("has-file");
      renderPrompt();
      showToast(`Foto ${role === "product" ? "produk" : "model"} siap dipakai.`);
    } catch (error) {
      input.value = "";
      showToast(error.message);
    }
  });
}

function setResultImage(imageDataUrl) {
  const container = $("toolImageResult");
  container.innerHTML = "";
  const image = document.createElement("img");
  image.src = imageDataUrl;
  image.alt = "Hasil render YEPPEUN AI STUDIO";
  container.append(image);
  container.classList.add("has-result");
  $("downloadResult").hidden = false;
}

async function renderImage() {
  if (!state.assets.product) return showToast("Unggah foto produk terlebih dahulu.");
  if (config.needsModel && !state.assets.model) return showToast("Unggah foto model untuk tool ini.");
  if (!$("imageRights").checked) return showToast("Konfirmasi izin penggunaan foto terlebih dahulu.");

  const button = $("renderTool");
  button.disabled = true;
  button.textContent = "Sedang membuat…";
  $("toolRenderState").textContent = "Sedang render";
  try {
    const result = await submitRenderJob({ prompt: buildCurrentPrompt(), assets: Object.values(state.assets).filter(Boolean) });
    state.result = result.imageDataUrl;
    setResultImage(result.imageDataUrl);
    $("toolRenderState").textContent = "Selesai";
    showToast("Hasil gambar siap. Cek detail sebelum dipakai.");
  } catch (error) {
    $("toolRenderState").textContent = "Belum berhasil";
    showToast(error.message);
  } finally {
    button.disabled = false;
    button.innerHTML = "<span>✦</span> Generate gambar";
  }
}

async function copyPrompt() {
  await copyToClipboard(buildCurrentPrompt());
  showToast("Prompt disalin.");
}

function handleDownloadImage() {
  if (!state.result) return;

  downloadImage(
    `yeppeun-studio-${tool}-result.png`,
    state.result
  );

  showToast("Gambar berhasil diunduh.");
}

document.querySelectorAll("input, select").forEach((field) => field.addEventListener("input", renderPrompt));
setupAssetInput("product");
setupAssetInput("model");
$("renderTool").addEventListener("click", renderImage);
$("copyToolPrompt").addEventListener("click", copyPrompt);
$("downloadResult").addEventListener(
  "click",
  handleDownloadImage
);
renderPrompt();
