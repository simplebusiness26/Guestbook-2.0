#!/usr/bin/env node
const chokidar = require("chokidar");
const { spawn, execSync } = require("child_process");

function build() {
  console.log("\n[watch] Building...");
  try {
    execSync("npx expo export --platform web", { stdio: "inherit" });
    console.log("[watch] Build complete.");
  } catch (e) {
    console.error("[watch] Build failed:", e.message);
  }
}

// Initial build then start server
build();
const server = spawn("serve", ["dist", "--listen", "5000", "--single"], { stdio: "inherit" });
server.on("exit", (code) => process.exit(code));

// Watch source files — debounce 500 ms so rapid saves only trigger one build
let timer = null;
const watcher = chokidar.watch(
  ["app", "components", "hooks", "services", "utils"],
  { ignoreInitial: true, awaitWriteFinish: { stabilityThreshold: 500 } }
);

watcher.on("all", (event, path) => {
  console.log(`[watch] ${event}: ${path}`);
  clearTimeout(timer);
  timer = setTimeout(build, 200);
});

console.log("[watch] Watching for changes...");
