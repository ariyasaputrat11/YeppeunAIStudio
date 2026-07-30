function productPhrase(brief) {
  return brief.productName === "the featured product" ? "produk ini" : brief.productName;
}

/** Membuat naskah pendek yang punya hook, product spill, dan CTA tanpa terdengar seperti iklan keras. */
export function buildAffiliateVoiceScript(brief) {
  const product = productPhrase(brief);
  const color = brief.color === "the original product color" ? "warnanya" : `warna ${brief.color}-nya`;
  const details = brief.details === "all visible original design details"
    ? "detailnya kelihatan rapi dan enak dipakai"
    : brief.details;

  return `Eh, aku baru nemu ${product} yang ternyata bagus banget buat dipakai sehari-hari. Nih, ${color} cakep dan ${details}. Pas dipakai juga tetap nyaman, jadi kelihatan effortless tanpa harus styling berlebihan. Kalau kamu lagi cari yang model begini, aku taruh link-nya di keranjang kuning ya.`;
}

export function buildVoiceDirection({ mood, pace, audience }) {
  return `Synthesize only the Indonesian transcript below. Perform as a ${mood}, speaking to ${audience}. Use ${pace}. Keep the delivery human and spontaneous: natural sentence endings, one or two tiny conversational breaths, clear Indonesian pronunciation, no announcer voice, no exaggerated sales pitch, no robotic cadence. Do not read these instructions aloud.`;
}
