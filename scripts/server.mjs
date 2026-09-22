import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import process from "node:process";

const root = normalize(join(process.cwd(), process.argv[2] ?? "dist"));
const mimeTypes = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json" };
const port = Number(process.env.PORT ?? 4173);

const server = createServer(async (request, response) => {
  const requestPath = decodeURIComponent(request.url?.split("?")[0] ?? "/");
  const relativePath = requestPath === "/" ? "/index.html" : requestPath;
  const filePath = normalize(join(root, relativePath));
  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }
  try {
    const content = await readFile(filePath);
    response.writeHead(200, { "Content-Type": mimeTypes[extname(filePath)] ?? "application/octet-stream" });
    response.end(content);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
});

server.listen(port, "127.0.0.1", () => console.log(`Preview server listening at http://127.0.0.1:${port}`));
