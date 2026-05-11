#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const bumpPart = args.find((arg) => !arg.startsWith("--")) ?? "patch";
const allowedParts = new Set(["major", "minor", "patch"]);

if (!allowedParts.has(bumpPart)) {
  throw new Error(`Unsupported version part "${bumpPart}". Use major, minor, or patch.`);
}

const readJson = (fileName) => JSON.parse(readFileSync(join(rootDir, fileName), "utf8"));
const writeJson = (fileName, data) => {
  writeFileSync(join(rootDir, fileName), `${JSON.stringify(data, null, 2)}\n`);
};

const bumpVersion = (version, part) => {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);
  if (!match) {
    throw new Error(`Version "${version}" must use x.y.z format.`);
  }

  const [, majorRaw, minorRaw, patchRaw] = match;
  let major = Number(majorRaw);
  let minor = Number(minorRaw);
  let patch = Number(patchRaw);

  if (part === "major") {
    major += 1;
    minor = 0;
    patch = 0;
  } else if (part === "minor") {
    minor += 1;
    patch = 0;
  } else {
    patch += 1;
  }

  return `${major}.${minor}.${patch}`;
};

const manifest = readJson("manifest.json");
const packageJson = readJson("package.json");

if (manifest.version !== packageJson.version) {
  throw new Error(
    `manifest.json version (${manifest.version}) does not match package.json version (${packageJson.version}).`
  );
}

const nextVersion = bumpVersion(manifest.version, bumpPart);
manifest.version = nextVersion;
packageJson.version = nextVersion;

const packageLock = readJson("package-lock.json");
packageLock.name = packageJson.name;
packageLock.version = nextVersion;

if (packageLock.packages?.[""]) {
  packageLock.packages[""].name = packageJson.name;
  packageLock.packages[""].version = nextVersion;
}

if (!dryRun) {
  writeJson("manifest.json", manifest);
  writeJson("package.json", packageJson);
  writeJson("package-lock.json", packageLock);
}

console.log(nextVersion);
