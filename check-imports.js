#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

// Root folder to scan
const ROOT = path.join(__dirname, "src");

// Valid extensions to check
const EXTENSIONS = [".js", ".jsx", ".ts", ".tsx"];

// Helper: check if file exists with exact case
function fileExistsExact(filePath) {
  const dir = path.dirname(filePath);
  const file = path.basename(filePath);

  if (!fs.existsSync(dir)) return false;

  const filesInDir = fs.readdirSync(dir);
  return filesInDir.includes(file);
}

// Recursively scan folder
function scanFolder(folder) {
  const entries = fs.readdirSync(folder, { withFileTypes: true });
  entries.forEach((entry) => {
    const fullPath = path.join(folder, entry.name);

    if (entry.isDirectory()) {
      scanFolder(fullPath);
    } else if (
      entry.isFile() &&
      EXTENSIONS.includes(path.extname(entry.name))
    ) {
      checkImports(fullPath);
    }
  });
}

// Check imports in a file
function checkImports(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const importRegex = /from\s+["'](.+)["']/g;

  let match;
  while ((match = importRegex.exec(content)) !== null) {
    let importPath = match[1];

    // Skip node_modules imports
    if (importPath.startsWith(".") || importPath.startsWith("/")) {
      let resolvedPath = path.join(path.dirname(filePath), importPath);

      // Try with extensions if no exact match
      if (
        !fileExistsExact(resolvedPath) &&
        !EXTENSIONS.includes(path.extname(resolvedPath))
      ) {
        let found = EXTENSIONS.some((ext) =>
          fileExistsExact(resolvedPath + ext)
        );
        if (!found) {
          console.log(`❌ Import mismatch in ${filePath}: "${importPath}"`);
        }
      } else if (!fileExistsExact(resolvedPath)) {
        console.log(`❌ Import mismatch in ${filePath}: "${importPath}"`);
      }
    }
  }
}

// Start scanning
scanFolder(ROOT);
console.log("✅ Import check complete.");
