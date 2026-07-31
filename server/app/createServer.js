const http = require("http");
const path = require("path");

const { handleRouter } = require("./router");
const { serveStatic } = require("../shared/static/serveStatic");

function createServer() {
  const root = path.resolve(__dirname, "../..");
  const port = Number(process.env.PORT || 4173);

  http
    .createServer((request, response) => {
      if (handleRouter(request, response)) {
        return;
      }

      if (request.method !== "GET" && request.method !== "HEAD") {
        response.writeHead(405).end("Method not allowed");
        return;
      }

      serveStatic(root, request, response);
    })
    .listen(port, () => {
      console.log(
        `YEPPEUN AI STUDIO berjalan di http://localhost:${port}`
      );
    });
}

module.exports = {
  createServer,
};