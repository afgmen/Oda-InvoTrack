import { createHash, randomBytes } from "node:crypto";

export function generateOpaqueToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashOpaqueToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function tokenContainsSensitiveValue(
  token: string,
  sensitiveValues: readonly (string | null | undefined)[],
): boolean {
  return sensitiveValues.some(
    (value) => value && token.toLowerCase().includes(value.toLowerCase()),
  );
}
