let timer = null;

export function showToast(message) {
  const toast = document.getElementById("toast");

  if (!toast) return;

  toast.textContent = message;

  toast.classList.add("visible");

  clearTimeout(timer);

  timer = setTimeout(() => {
    toast.classList.remove("visible");
  }, 2600);
}