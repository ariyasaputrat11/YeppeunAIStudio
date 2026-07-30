import { DEFAULT_GUARDS } from "../data/templates.js";

export function assessBrief(mode, brief) {
  const checks = [...DEFAULT_GUARDS];
  const warnings = [];

  if (mode === "fit" && !brief.hasProductImage) warnings.push("Tambahkan foto produk supaya bentuk dan detail bisa dikunci.");
  if (mode === "fit" && !brief.hasModelImage) warnings.push("Tambahkan foto model untuk menjaga wajah dan proporsi.");
  if (mode === "video" && !brief.hasProductImage) warnings.push("Foto produk akan membantu menjaga barang tetap sama di seluruh klip.");
  if (!brief.details || brief.details === "all visible original design details") warnings.push("Isi detail yang tidak boleh berubah agar guard lebih presisi.");

  return { checks, warnings };
}
