import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const output = execFileSync(
  "pnpm",
  ["exec", "supabase", "status", "-o", "env"],
  {
    encoding: "utf8",
  },
);

const values = Object.fromEntries(
  output
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.includes("="))
    .map((line) => {
      const separator = line.indexOf("=");
      const key = line.slice(0, separator);
      const value = line.slice(separator + 1).replace(/^"(.*)"$/, "$1");
      return [key, value];
    }),
);

const apiUrl = values.API_URL;
const publishableKey = values.PUBLISHABLE_KEY ?? values.ANON_KEY;
const serviceRoleKey = values.SERVICE_ROLE_KEY;

if (!apiUrl || !publishableKey || !serviceRoleKey) {
  throw new Error("Supabase local status did not return the required keys.");
}

writeFileSync(
  ".env.local",
  [
    `NEXT_PUBLIC_SUPABASE_URL=${apiUrl}`,
    `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=${publishableKey}`,
    `SUPABASE_SERVICE_ROLE_KEY=${serviceRoleKey}`,
    "NEXT_PUBLIC_APP_URL=http://localhost:3000",
    "",
  ].join("\n"),
);

console.log("Wrote local Supabase configuration to .env.local");
