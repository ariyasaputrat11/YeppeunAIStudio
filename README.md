# YEPPEUN AI STUDIO

MVP web untuk menyiapkan konten foto produk dan prompt video affiliate yang terasa natural.

## Menjalankan

Pastikan Node.js 18+ terpasang. Untuk membuat gambar sungguhan, simpan API key Gemini sebagai environment variable server (jangan masukkan key ke formulir atau file frontend):

```powershell
$env:GEMINI_API_KEY = "API_KEY_MILIKMU"
npm start
```

Lalu buka `http://localhost:4173` di browser. Lihat `.env.example` untuk nama konfigurasi yang dipakai. Jika key belum dipasang, aplikasi tetap berjalan tetapi dengan aman akan menolak proses render dan menjelaskan langkah yang kurang.

## Yang sudah berfungsi

- Upload dan pratinjau foto produk serta model.
- Brief kreatif untuk rasio, gaya visual, background, pose, audiens, warna, dan detail produk yang harus terkunci.
- Empat output prompt: video affiliate 3-beat (hook, product spill, outro), photo enhance, AI fit, dan detail/texture spill.
- Prompt berbahasa Inggris yang siap ditempel ke Google Flow.
- Prompt Guard bawaan untuk konsistensi produk, tangan, identitas, skala, pencahayaan, dan pencegahan glitch.
- Generate gambar langsung dari foto referensi, tampilkan status render, unduh hasil, atau gunakan hasil sebagai referensi awal video.
- Voice Lab: buat naskah affiliate, arahkan gaya/tempo suara, preview, dan unduh voice-over WAV.
- Salin ke clipboard atau unduh prompt sebagai `.txt`.

## Arsitektur modular

| File | Tanggung jawab |
| --- | --- |
| `js/app.js` | Menghubungkan UI dan alur aplikasi. |
| `js/services/briefService.js` | Mengambil data brief dari formulir. |
| `js/services/promptBuilder.js` | Menyusun setiap jenis prompt. |
| `js/services/imagePromptBuilder.js` | Mengubah brief menjadi prompt khusus untuk render gambar. |
| `js/services/voiceScriptBuilder.js` | Membuat naskah affiliate dan arahan performa voice-over. |
| `js/services/voiceGateway.js` | Jalur browser ke endpoint TTS. |
| `js/services/qualityGuard.js` | Memeriksa kelengkapan brief dan aturan anti-glitch. |
| `js/services/renderGateway.js` | Satu pintu komunikasi browser ke backend render. |
| `js/data/templates.js` | Konfigurasi mode output dan guard tetap. |
| `js/utils/dom.js` | Fungsi aman untuk output UI, toast, dan sanitasi teks. |
| `server/routes/generateImage.js` | Validasi request gambar dan respons API. |
| `server/providers/geminiImage.js` | Adapter Gemini Native Image; hanya file ini yang tahu API provider. |
| `server/providers/geminiTts.js` | Adapter Gemini TTS dan konversi audio PCM menjadi WAV. |
| `server/routes/generateVoice.js` | Validasi request dan respons voice-over. |
| `server/utils/http.js` | Pembacaan JSON dan respons HTTP dengan batas ukuran upload. |
| `styles.css` | Seluruh tampilan responsif. |

## Render gambar

Render gambar memakai Gemini Native Image melalui API dari server dan secara default memilih model `gemini-3.1-flash-image`. Upload maksimal 8 MB per foto dan 25 MB per request. Server hanya meneruskan foto saat tombol **Generate gambar** ditekan; hasil kembali ke browser sebagai pratinjau dan tidak ditulis menjadi file permanen oleh aplikasi ini.

Google Flow tetap menjadi tujuan untuk render video: unduh hasil gambar, unggah sebagai referensi di Flow, lalu gunakan prompt video dari YEPPEUN AI STUDIO.

## Voice-over

Voice Lab memakai Gemini TTS melalui server dan secara default memilih `gemini-3.1-flash-tts-preview`. Tulis atau buat naskah, pilih karakter suara bawaan serta gaya bicara, lalu dengarkan hasilnya sebelum mengunduh WAV. Naskah pendek—sekitar 180–350 karakter—adalah titik awal yang baik untuk video affiliate singkat.

Hanya gunakan suara bawaan. Jangan menjanjikan, meniru, atau mengkloning suara orang nyata tanpa izin mereka. Jangan menyimpan API key pada browser, dan gunakan foto model hanya dengan izin penggunaan yang jelas.
