import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import { loadEnvFile } from "node:process";
import { existsSync } from "node:fs";

if (existsSync(".env")) loadEnvFile();
const database = new URL(process.env.DATABASE_URL || "postgresql://missing");
if (!["localhost", "127.0.0.1"].includes(database.hostname)) {
  throw new Error(
    "Integration tests require an explicitly configured local PostgreSQL database.",
  );
}
export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: { include: ["tests/integration/**/*.test.ts"], fileParallelism: false },
});
