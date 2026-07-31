const { handleGenerateImage } = require("../routes/generateImage");
const { handleGenerateVoice } = require("../routes/generateVoice");

function handleRouter(request, response) {
  if (
    request.method === "POST" &&
    request.url === "/api/generate-image"
  ) {
    handleGenerateImage(request, response);
    return true;
  }

  if (
    request.method === "POST" &&
    request.url === "/api/generate-voice"
  ) {
    handleGenerateVoice(request, response);
    return true;
  }

  return false;
}

module.exports = {
  handleRouter,
};