// Search Console API auth — NOT shipped runtime code (CLI / CI helper only).
//
// Mints a Google OAuth2 access token for a SERVICE ACCOUNT with nothing but
// node:crypto, following Google's documented server-to-server flow:
//   https://developers.google.com/identity/protocols/oauth2/service-account#httprest
// A signed RS256 JWT (iss = the service-account e-mail, the scope, aud = the
// token endpoint, exp ≤ 1 h) is POSTed to https://oauth2.googleapis.com/token
// with grant_type jwt-bearer and exchanged for a short-lived bearer token.
//
// WHY HAND-MINTED (D-18, RESEARCH §Pattern 1): the client libraries would add a
// large dependency tree to a repo whose only runtime deps are the app's, for a
// flow that is one signature and one POST. No npm package is added.
//
// WHERE THE KEY LIVES — and nowhere else:
//   GSC_SERVICE_ACCOUNT_JSON       the full key JSON (GitHub Actions repo secret)
//   GSC_SERVICE_ACCOUNT_JSON_FILE  local alternative: absolute path to the key file
//                                  OUTSIDE the repo, set in the gitignored .env.local
// Nothing here logs the key, the assertion or the token; a failed exchange
// surfaces its HTTP status only — never the response body (T-9-token-log).
//
// SCOPE: URL Inspection, sitemaps.get and searchAnalytics.query all accept the
// READ-ONLY scope, so that is the default — the scripts cannot write to GSC.

import { createSign } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";

export const SCOPE_READONLY = "https://www.googleapis.com/auth/webmasters.readonly";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const ENV_JSON = "GSC_SERVICE_ACCOUNT_JSON";
const ENV_FILE = "GSC_SERVICE_ACCOUNT_JSON_FILE";

export interface ServiceAccount {
  client_email: string;
  private_key: string;
}

function parseKey(raw: string, source: string): ServiceAccount {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(`${source} is not valid JSON`);
  }
  const key = parsed as Partial<ServiceAccount>;
  if (typeof key.client_email !== "string" || typeof key.private_key !== "string") {
    throw new Error(`${source} lacks client_email/private_key — is this a service-account key?`);
  }
  return { client_email: key.client_email, private_key: key.private_key };
}

// Env first; only when neither variable is set and a local .env.local exists is
// it loaded (Node ≥ 20.12 has process.loadEnvFile; typed loosely so the
// pinned @types/node needs no upgrade).
export function loadServiceAccount(): ServiceAccount {
  if (!process.env[ENV_JSON] && !process.env[ENV_FILE] && existsSync(".env.local")) {
    const proc = process as NodeJS.Process & { loadEnvFile?: (path?: string) => void };
    proc.loadEnvFile?.(".env.local");
  }
  const inline = process.env[ENV_JSON];
  if (inline) return parseKey(inline, ENV_JSON);
  const file = process.env[ENV_FILE];
  if (file) return parseKey(readFileSync(file, "utf8"), `${ENV_FILE} (${file})`);
  throw new Error(
    `no service-account key: set ${ENV_JSON} (the key JSON, e.g. the GitHub Actions secret) ` +
      `or ${ENV_FILE} (absolute path to the key file outside the repo, e.g. via .env.local)`,
  );
}

const b64url = (input: Buffer | string): string => Buffer.from(input).toString("base64url");

export async function getAccessToken(scope: string = SCOPE_READONLY): Promise<string> {
  const { client_email, private_key } = loadServiceAccount();
  const iat = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = b64url(
    JSON.stringify({ iss: client_email, scope, aud: TOKEN_URL, iat, exp: iat + 3600 }),
  );
  const signature = createSign("RSA-SHA256").update(`${header}.${claims}`).end().sign(private_key);
  const assertion = `${header}.${claims}.${b64url(signature)}`;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion }),
  });
  if (!res.ok) throw new Error(`token exchange failed: HTTP ${res.status}`);
  const body = (await res.json()) as { access_token?: string };
  if (!body.access_token) throw new Error("token exchange failed: no access_token in the response");
  return body.access_token;
}
