import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const testsDirectory = join(root, "tests");
const testFiles = (await readdir(testsDirectory))
  .filter((name) => name.endsWith(".test.ts"))
  .sort();

let failures = 0;
for (const file of testFiles) {
  const module = await import(pathToFileURL(join(testsDirectory, file)));
  const cases = Array.isArray(module.default) ? module.default : [module.default];
  for (const testCase of cases) {
    try {
      await testCase.run();
      console.log(`PASS ${file} :: ${testCase.name}`);
    } catch (error) {
      failures += 1;
      console.error(`FAIL ${file} :: ${testCase.name}`);
      console.error(error);
    }
  }
}

console.log(`\n${testFiles.length} test file(s), ${failures} failure(s)`);
process.exitCode = failures === 0 ? 0 : 1;
