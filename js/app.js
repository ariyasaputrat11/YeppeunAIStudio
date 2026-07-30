import { OUTPUT_MODES } from "./data/templates.js";
import { getBrief } from "./services/briefService.js";
import { buildPrompt } from "./services/promptBuilder.js";
import { buildImageRenderPrompt } from "./services/imagePromptBuilder.js";
import { assessBrief } from "./services/qualityGuard.js";
import { submitRenderJob } from "./services/renderGateway.js";
import { buildAffiliateVoiceScript, buildVoiceDirection } from "./services/voiceScriptBuilder.js";
import { submitVoiceJob } from "./services/voiceGateway.js";
import { escapeHtml, showToast } from "./utils/dom.js";

const state = {
  mode: "video",
  format: "9:16 vertical",
  prompt: "",
  uploads: { product: null, model: null },
  generatedImage: null,
  generatedVoice: null,
};

const promptOutput = document.getElementById("promptOutput");
const promptTitle = document.getElementById("promptTitle");
const guardList = document.getElementById("guardList");
const guardSummary = document.getElementById("guardSummary");
const renderButton = document.getElementById("renderButton");
const renderStatus = document.getElementById("renderStatus");
const imageResult = document.getElementById("imageResult");
const imageResultActions = document.getElementById("imageResultActions");
const voiceScript = document.getElementById("voiceScript");
const scriptCounter = document.getElementById("scriptCounter");
const generateVoiceButton = document.getElementById("generateVoiceButton");
const voicePlayer = document.getElementById("voicePlayer");
const audioEmpty = document.getElementById("audioEmpty");
const audioActions = document.getElementById("audioActions");
const voiceStatus = document.getElementById("voiceStatus");
const downloadVoiceButton = document.getElementById("downloadVoiceButton");

function prettyPrompt(prompt) {
  return escapeHtml(prompt).replace(/(PROMPT GUARD — non-negotiable:|BEAT [123] — [A-Z ]+|Audio:|Camera:)/g, '<span class="prompt-label">$1</span>');
}

function renderPrompt() {
  const brief = getBrief(state);
  state.prompt = buildPrompt(state.mode, brief);
  const assessment = assessBrief(state.mode, brief);
  const metadata = OUTPUT_MODES[state.mode];
  promptTitle.textContent = metadata.title;
  promptOutput.innerHTML = prettyPrompt(state.prompt);
  guardList.innerHTML = assessment.checks.slice(0, 4).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  guardSummary.textContent = assessment.warnings.length
    ? `Perhatikan: ${assessment.warnings[0]}`
    : `${metadata.guardTitle}. ${assessment.checks.length} aturan anti-glitch aktif.`;
}

function setRenderState(status, label) {
  renderStatus.className = `render-status${status ? ` ${status}` : ""}`;
  renderStatus.textContent = label;
}

function renderImageResult(imageDataUrl) {
  imageResult.className = "";
  imageResult.textContent = "";
  const image = document.createElement("img");
  image.className = "image-result-image";
  image.src = imageDataUrl;
  image.alt = "Hasil gambar YEPPEUN AI STUDIO";
  imageResult.append(image);
  imageResultActions.hidden = false;
}

function clearGeneratedImage() {
  state.generatedImage = null;
  imageResult.className = "image-result-empty";
  imageResult.innerHTML = '<span class="image-spark">✦</span><strong>Ruang hasilmu</strong><small>Hasil AI akan muncul di sini.</small>';
  imageResultActions.hidden = true;
  setRenderState("", "Belum dibuat");
}

function setVoiceStatus(status, label) {
  voiceStatus.className = `voice-status${status ? ` ${status}` : ""}`;
  voiceStatus.textContent = label;
}

function updateScriptCounter() {
  scriptCounter.textContent = voiceScript.value.length;
}

function setVoiceScript(script) {
  voiceScript.value = script;
  updateScriptCounter();
}

function clearGeneratedVoice() {
  state.generatedVoice = null;
  voicePlayer.pause();
  voicePlayer.removeAttribute("src");
  voicePlayer.hidden = true;
  audioEmpty.hidden = false;
  audioActions.hidden = true;
  downloadVoiceButton.disabled = true;
  setVoiceStatus("", "Belum dibuat");
}

async function generateVoice() {
  const script = voiceScript.value.trim();
  if (script.length < 12) return showToast("Tulis atau buat naskah voice-over terlebih dahulu.");
  if (!document.getElementById("voiceRights").checked) return showToast("Centang konfirmasi penggunaan suara bawaan terlebih dahulu.");

  const brief = getBrief(state);
  const direction = buildVoiceDirection({
    mood: document.getElementById("voiceMood").value,
    pace: document.getElementById("voicePace").value,
    audience: brief.audience,
  });

  generateVoiceButton.disabled = true;
  generateVoiceButton.textContent = "Sedang membuat…";
  state.generatedVoice = null;
  voicePlayer.hidden = true;
  downloadVoiceButton.disabled = true;
  audioEmpty.hidden = false;
  audioEmpty.innerHTML = '<span>◌</span><div><strong>Menyiapkan voice-over</strong><small>Mengatur tempo, intonasi, dan jeda natural.</small></div>';
  audioActions.hidden = false;
  setVoiceStatus("loading", "Sedang dibuat");

  try {
    const result = await submitVoiceJob({ script, voice: document.getElementById("voiceName").value, direction });
    state.generatedVoice = result.audioDataUrl;
    voicePlayer.src = result.audioDataUrl;
    voicePlayer.hidden = false;
    audioEmpty.hidden = true;
    audioActions.hidden = false;
    downloadVoiceButton.disabled = false;
    setVoiceStatus("", "Siap didengar");
    showToast("Voice-over siap. Dengarkan sebelum diunduh.");
  } catch (error) {
    clearGeneratedVoice();
    audioActions.hidden = false;
    setVoiceStatus("error", "Belum berhasil");
    showToast(error.message);
  } finally {
    generateVoiceButton.disabled = false;
    generateVoiceButton.innerHTML = "<span>◌</span> Generate voice";
  }
}

function getAssets() {
  return Object.values(state.uploads).filter(Boolean).map(({ data, mimeType, role }) => ({ data, mimeType, role }));
}

async function readAsAsset(file, role) {
  if (file.size > 8 * 1024 * 1024) throw new Error("Maksimal ukuran satu foto adalah 8 MB.");
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Foto tidak bisa dibaca."));
    reader.readAsDataURL(file);
  });
  return { data: dataUrl.split(",")[1], mimeType: file.type, role, name: file.name };
}

function imageRequirementError() {
  if (!state.uploads.product) return "Unggah foto produk terlebih dahulu agar hasilnya akurat.";
  if (state.mode === "fit" && !state.uploads.model) return "Untuk AI fit, unggah juga foto model.";
  return null;
}

async function generateImage() {
  const requirementError = imageRequirementError();
  if (requirementError) return showToast(requirementError);
  if (!document.getElementById("imageRights").checked) return showToast("Centang konfirmasi izin foto sebelum generate.");

  const brief = getBrief(state);
  const imagePrompt = buildImageRenderPrompt(state.mode, brief);
  renderButton.disabled = true;
  renderButton.textContent = "Sedang membuat…";
  setRenderState("loading", "Sedang render");
  imageResult.className = "image-result-empty";
  imageResult.innerHTML = '<span class="image-spark">◌</span><strong>Meracik visual</strong><small>Menjaga detail produk dan referensi.</small>';

  try {
    const result = await submitRenderJob({ prompt: imagePrompt, assets: getAssets() });
    state.generatedImage = result.imageDataUrl;
    renderImageResult(result.imageDataUrl);
    setRenderState("done", "Selesai");
    showToast("Gambar siap. Cek detail produk sebelum dipakai.");
  } catch (error) {
    clearGeneratedImage();
    setRenderState("error", "Perlu perhatian");
    showToast(error.message);
  } finally {
    renderButton.disabled = false;
    renderButton.innerHTML = "<span>✦</span> Generate gambar";
  }
}

function setupUpload(input, type) {
  input.addEventListener("change", async () => {
    const file = input.files?.[0];
    if (!file) return;
    try {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        throw new Error("Gunakan file gambar JPG, PNG, atau WEBP.");
      }
      const zone = input.closest(".upload-zone");
      const preview = zone.querySelector(".image-preview");
      preview.src = URL.createObjectURL(file);
      zone.classList.add("has-file");
      state.uploads[type] = await readAsAsset(file, type);
      showToast(`${type === "product" ? "Foto produk" : "Foto model"} siap dipakai.`);
    } catch (error) {
      input.value = "";
      showToast(error.message);
    }
  });
}

function setupSelections() {
  document.querySelectorAll(".mode-card").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelector(".mode-card.selected").classList.remove("selected");
      button.classList.add("selected");
      state.mode = button.dataset.mode;
      renderPrompt();
      document.getElementById("resultSection").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  document.querySelectorAll("#formatPills .pill").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelector("#formatPills .pill.selected").classList.remove("selected");
      button.classList.add("selected");
      state.format = button.dataset.value;
    });
  });

}

function setupActions() {
  document.getElementById("generateButton").addEventListener("click", () => {
    renderPrompt();
    showToast("Prompt dan guard sudah diperbarui.");
    document.getElementById("resultSection").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  renderButton.addEventListener("click", generateImage);

  document.getElementById("draftScriptButton").addEventListener("click", () => {
    setVoiceScript(buildAffiliateVoiceScript(getBrief(state)));
    showToast("Naskah affiliate dibuat. Kamu bebas mengeditnya.");
  });

  voiceScript.addEventListener("input", updateScriptCounter);
  generateVoiceButton.addEventListener("click", generateVoice);

  document.getElementById("copyButton").addEventListener("click", async () => {
    await navigator.clipboard.writeText(state.prompt);
    showToast("Prompt disalin. Siap ditempel ke Google Flow.");
  });

  document.getElementById("downloadButton").addEventListener("click", () => {
    const file = new Blob([state.prompt], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = `yeppeun-studio-${state.mode}-prompt.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast("File prompt diunduh.");
  });

  document.getElementById("downloadImageButton").addEventListener("click", () => {
    if (!state.generatedImage) return;
    const link = document.createElement("a");
    link.href = state.generatedImage;
    link.download = `yeppeun-studio-${state.mode}-result.png`;
    link.click();
  });

  document.getElementById("useForVideoButton").addEventListener("click", () => {
    const videoMode = document.querySelector('.mode-card[data-mode="video"]');
    if (state.mode !== "video") videoMode.click();
    showToast("Hasil gambar tetap tersedia. Unduh lalu unggah sebagai referensi awal di Google Flow.");
  });

  downloadVoiceButton.addEventListener("click", () => {
    if (!state.generatedVoice) return;
    const link = document.createElement("a");
    link.href = state.generatedVoice;
    link.download = "yeppeun-studio-affiliate-voice.wav";
    link.click();
  });

  document.getElementById("newDraftButton").addEventListener("click", () => {
    document.querySelectorAll("input[type=text]").forEach((input) => { input.value = ""; });
    document.getElementById("background").value = "bright bedroom corner with a full-length mirror";
    document.getElementById("pose").value = "standing naturally, showing the fabric with one hand";
    document.getElementById("audience").value = "women looking for effortless everyday outfits";
    document.querySelectorAll(".upload-zone").forEach((zone) => {
      zone.classList.remove("has-file");
      zone.querySelector("input").value = "";
      zone.querySelector(".image-preview").removeAttribute("src");
    });
    state.uploads = { product: null, model: null };
    document.getElementById("imageRights").checked = false;
    document.getElementById("voiceRights").checked = false;
    clearGeneratedImage();
    clearGeneratedVoice();
    renderPrompt();
    setVoiceScript(buildAffiliateVoiceScript(getBrief(state)));
    showToast("Draft baru siap diisi.");
  });
}

setupUpload(document.getElementById("productUpload"), "product");
setupUpload(document.getElementById("modelUpload"), "model");
setupSelections();
setupActions();
renderPrompt();
setVoiceScript(buildAffiliateVoiceScript(getBrief(state)));
