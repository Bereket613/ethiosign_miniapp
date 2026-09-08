import { copyFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { modules } from "../src/data/modules.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pub = join(root, "public");
const ORIGINAL_TEMPLATE = join(root, "scripts", "assets", "original-demo.mp4");
const SIGN_TEMPLATE = join(root, "scripts", "assets", "sign-demo.mp4");

const FLAGSHIP_VTT = [
  "WEBVTT",
  "",
  "00:00:00.000 --> 00:00:02.000",
  "Teacher wellbeing is an important part of effective teaching.",
  "",
  "00:00:02.000 --> 00:00:04.000",
  "Teachers in crisis-affected settings face unique challenges.",
  "",
  "00:00:04.000 --> 00:00:06.000",
  "Supporting teachers improves outcomes for every learner.",
  "",
].join("\n");

function vttFor(module, lesson) {
  if (lesson.id === "m1-overview-01") return FLAGSHIP_VTT;
  return [
    "WEBVTT",
    "",
    "00:00:00.000 --> 00:00:03.000",
    `[Demo captions] Module ${module.number}: ${module.title}`,
    "",
    "00:00:03.000 --> 00:00:06.000",
    `Replace ${lesson.captions} with the authorized course captions.`,
    "",
  ].join("\n");
}

let videos = 0;
let captions = 0;

for (const module of modules) {
  for (const section of module.sections) {
    for (const lesson of section.lessons) {
      const originalPath = join(pub, lesson.originalVideo.replace(/^\//, ""));
      const signPath = join(pub, lesson.signVideo.replace(/^\//, ""));
      const captionPath = join(pub, lesson.captions.replace(/^\//, ""));

      for (const target of [originalPath, signPath, captionPath]) {
        mkdirSync(dirname(target), { recursive: true });
      }

      if (!existsSync(originalPath)) {
        copyFileSync(ORIGINAL_TEMPLATE, originalPath);
        videos += 1;
      }
      if (!existsSync(signPath)) {
        copyFileSync(SIGN_TEMPLATE, signPath);
        videos += 1;
      }
      if (!existsSync(captionPath)) {
        writeFileSync(captionPath, vttFor(module, lesson));
        captions += 1;
      }
    }
  }
}

console.log(
  `Placeholders ready: ${videos} videos and ${captions} caption files created (existing files untouched).`
);
