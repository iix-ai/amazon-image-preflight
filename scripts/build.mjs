import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const sourceDirectory = join(root, "src");
const outputDirectory = join(root, "dist");

let vite;
try {
  vite = await import("vite");
} catch (error) {
  if (error?.code !== "ERR_MODULE_NOT_FOUND") throw error;
}

if (vite) {
  await vite.build({ root });
  console.log(`Built with Vite in ${outputDirectory}`);
} else {
  await rm(outputDirectory, { recursive: true, force: true });
  await mkdir(outputDirectory, { recursive: true });
  const index = await readFile(join(root, "index.html"), "utf8");
  await writeFile(join(outputDirectory, "index.html"), index.replace("./src/styles.css", "./styles.css").replace("./src/main.ts", "./main.js"), "utf8");
  const rejectedPage = await readFile(join(root, "amazon-main-image-rejected", "index.html"), "utf8");
  await mkdir(join(outputDirectory, "amazon-main-image-rejected"), { recursive: true });
  await writeFile(join(outputDirectory, "amazon-main-image-rejected", "index.html"), rejectedPage.replace("../src/styles.css", "../styles.css"), "utf8");
  await cp(join(sourceDirectory, "styles.css"), join(outputDirectory, "styles.css"));
  await cp(join(root, "public"), outputDirectory, { recursive: true });

  const copyRuntime = async (directory) => {
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      const sourcePath = join(directory, entry.name);
      if (entry.isDirectory()) {
        await copyRuntime(sourcePath);
        continue;
      }
      if (!entry.name.endsWith(".ts")) continue;
      const outputPath = join(outputDirectory, relative(sourceDirectory, sourcePath).replace(/\.ts$/, ".js"));
      await mkdir(join(outputPath, ".."), { recursive: true });
      const source = await readFile(sourcePath, "utf8");
      const javascript = source.replace(/\.ts(["'])/g, ".js$1");
      await writeFile(outputPath, javascript, "utf8");
    }
  };

  await copyRuntime(sourceDirectory);
  console.log(`Built static site with dependency-light fallback in ${outputDirectory}`);
}
