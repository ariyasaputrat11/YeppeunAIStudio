/** Satu-satunya titik komunikasi UI ke backend render. API key tidak pernah masuk browser. */
export async function submitRenderJob({ prompt, assets }) {
  const response = await fetch("/api/generate-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, assets }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "Render gambar belum berhasil. Coba lagi.");
  return payload;
}
