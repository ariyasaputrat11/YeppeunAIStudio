/** Jalur tunggal browser ke endpoint TTS. Tidak ada API key atau cloning suara di browser. */
export async function submitVoiceJob({ script, voice, direction }) {
  const response = await fetch("/api/generate-voice", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ script, voice, direction }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "Voice-over belum berhasil dibuat. Coba lagi.");
  return payload;
}
