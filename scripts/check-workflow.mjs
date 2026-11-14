import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const lock = JSON.parse(readFileSync("package-lock.json", "utf8"));
const changelog = readFileSync("CHANGELOG.md", "utf8");
const problems = [];
if (!/^\d+\.\d+\.\d+$/.test(pkg.version))
  problems.push("Use a MAJOR.MINOR.PATCH package version.");
if (
  lock.version !== pkg.version ||
  lock.packages?.[""]?.version !== pkg.version
)
  problems.push(
    "package.json and both root package-lock.json versions must match.",
  );
if (!changelog.includes(`## [${pkg.version}]`))
  problems.push(`CHANGELOG.md needs a section for ${pkg.version}.`);
const branch =
  process.env.GITHUB_HEAD_REF ||
  execFileSync("git", ["branch", "--show-current"], {
    encoding: "utf8",
  }).trim();
const branchPattern =
  /^(feat|fix|refactor|docs|test|chore|ci|release|hotfix)\/[a-z0-9]+(?:[.-][a-z0-9]+)*$/;
if (
  branch &&
  !["master", "main"].includes(branch) &&
  !branchPattern.test(branch)
)
  problems.push(
    `Branch '${branch}' must use a type/short-kebab-description name.`,
  );
if (
  process.env.GITHUB_EVENT_PATH &&
  process.env.GITHUB_EVENT_NAME === "pull_request"
) {
  const event = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, "utf8"));
  const title = event.pull_request?.title || "";
  if (
    !/^(feat|fix|refactor|docs|test|chore|ci|perf|build|revert)(\([a-z0-9-]+\))?!?: .{8,100}$/.test(
      title,
    )
  )
    problems.push(
      "PR title must be descriptive Conventional Commit text, e.g. feat(portal): simplify student navigation.",
    );
}
if (problems.length) {
  for (const problem of problems) console.error(problem);
  process.exitCode = 1;
} else
  console.log(
    `Workflow policy passed: ${branch || "detached ref"}, candidate v${pkg.version}.`,
  );
