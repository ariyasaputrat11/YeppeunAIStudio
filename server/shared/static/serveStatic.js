const fs = require("fs");
const path = require("path");
const { mimeTypes } = require("../../config/mimeTypes");

function serveStatic(root, request, response) {
  const requestedPath = decodeURIComponent(
    new URL(request.url, `http://${request.headers.host}`).pathname
  );

  const relativePath =
    requestedPath === "/"
      ? "index.html"
      : requestedPath.replace(/^\/+/, "");

  const filePath = path.resolve(root, relativePath);

  if (
    path.relative(root, filePath).startsWith("..") ||
    path.isAbsolute(path.relative(root, filePath))
  ) {
    response.writeHead(403).end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, file) => {
    if (error) {
      response
        .writeHead(error.code === "ENOENT" ? 404 : 500)
        .end("Not found");
      return;
    }

    response.writeHead(200, {
      "Content-Type":
        mimeTypes[path.extname(filePath)] || "application/octet-stream",
    });

    response.end(file);
  });
}

module.exports = {
  serveStatic,
};