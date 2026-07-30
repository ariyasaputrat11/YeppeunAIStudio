const INTERACTIONS_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/interactions";

function providerError(message, status = 502) {
  return Object.assign(new Error(message), { status });
}

function pcmToWavBase64(pcmBase64, sampleRate = 24000, channels = 1, bitsPerSample = 16) {
  const pcm = Buffer.from(pcmBase64, "base64");
  const header = Buffer.alloc(44);
  const byteRate = sampleRate * channels * (bitsPerSample / 8);
  const blockAlign = channels * (bitsPerSample / 8);

  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]).toString("base64");
}

async function requestAudio({ apiKey, model, script, voice, direction }) {
  const response = await fetch(INTERACTIONS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
      "Api-Revision": "2026-05-20",
    },
    body: JSON.stringify({
      model,
      input: `${direction}\n\nSPOKEN TRANSCRIPT (Indonesian):\n${script}`,
      response_format: { type: "audio" },
      generation_config: { speech_config: [{ voice }] },
    }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw providerError(payload.error?.message || "Gemini tidak dapat membuat voice-over ini.", response.status);
  return payload.output_audio?.data || payload.outputAudio?.data || null;
}

async function generateGeminiVoice(input) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw providerError("Tambahkan GEMINI_API_KEY di environment server sebelum membuat voice-over.", 503);

  const model = process.env.GEMINI_TTS_MODEL || "gemini-3.1-flash-tts-preview";
  let pcmBase64 = await requestAudio({ apiKey, model, ...input });
  // Provider kadang mengembalikan token teks, bukan audio; satu retry aman untuk kasus ini.
  if (!pcmBase64) pcmBase64 = await requestAudio({ apiKey, model, ...input });
  if (!pcmBase64) throw providerError("Provider belum mengembalikan audio. Coba generate lagi.");

  return { audioDataUrl: `data:audio/wav;base64,${pcmToWavBase64(pcmBase64)}`, mimeType: "audio/wav", model };
}

module.exports = { generateGeminiVoice, pcmToWavBase64 };
