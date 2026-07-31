export function downloadText(filename, text) {
  const blob = new Blob([text], {
    type: "text/plain;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download = filename;

  link.click();

  URL.revokeObjectURL(url);
}

export function downloadImage(filename, dataUrl) {
  const link = document.createElement("a");

  link.href = dataUrl;

  link.download = filename;

  link.click();
}