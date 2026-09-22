import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const sourceDirectory = join(root, "src");
const outputDirectory = join(root, "dist");

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });
await cp(join(root, "index.html"), join(outputDirectory, "index.html"));
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
console.log(`Built static site in ${outputDirectory}`);
