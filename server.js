const http = require("http");
const fs = require("fs");
const path = require("path");
const { handleGenerateImage } = require("./server/routes/generateImage");
const { handleGenerateVoice } = require("./server/routes/generateVoice");

const root = __dirname;
const port = Number(process.env.PORT || 4173);
const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

http.createServer((request, response) => {
  if (request.method === "POST" && request.url === "/api/generate-image") {
    handleGenerateImage(request, response);
    return;
  }

  if (request.method === "POST" && request.url === "/api/generate-voice") {
    handleGenerateVoice(request, response);
    return;
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405).end("Method not allowed");
    return;
  }

  const requestedPath = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
  const relativePath = requestedPath === "/" ? "index.html" : requestedPath.replace(/^\/+/, "");
  const filePath = path.resolve(root, relativePath);

  if (path.relative(root, filePath).startsWith("..") || path.isAbsolute(path.relative(root, filePath))) {
    response.writeHead(403).end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, file) => {
    if (error) {
      response.writeHead(error.code === "ENOENT" ? 404 : 500).end("Not found");
      return;
    }
    response.writeHead(200, { "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream" });
    response.end(file);
  });
}).listen(port, () => console.log(`YEPPEUN AI STUDIO berjalan di http://localhost:${port}`));
