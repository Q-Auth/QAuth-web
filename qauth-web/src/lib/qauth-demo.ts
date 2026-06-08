const EMOJI_POOL = ["🦊", "🌙", "🚀", "🍒", "🧭", "🔐", "🪄", "🌲", "🛰️", "⚡", "🐋", "🍵"];

export type DemoSession = {
  id: string;
  createdAt: string;
  browserBinding: string;
  payload: string;
  symbols: string[];
};

export type ProofResult = {
  nonce: number;
  hash: string;
  attempts: number;
  elapsedMs: number;
};

export type PasskeyResult = {
  ok: boolean;
  title: string;
  detail: string;
};

export function createLoginSession(): DemoSession {
  const id = `qauth_${randomBase64Url(18)}`;
  const browserBinding = randomBase64Url(12);
  const createdAt = new Date().toISOString();
  const symbols = pickSymbols(`${id}:${browserBinding}`);
  const payload = `qauth://login?session=${encodeURIComponent(id)}&binding=${encodeURIComponent(browserBinding)}&created_at=${encodeURIComponent(createdAt)}`;

  return { id, createdAt, browserBinding, payload, symbols };
}

export function createClaimCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(9));
  const code = Array.from(bytes, (byte) => (byte % 36).toString(36).toUpperCase()).join("");
  return `${code.slice(0, 4)}-${code.slice(4, 8)}-${code.slice(8)}`;
}

export async function solveProofOfWork(challenge: string, difficultyBits = 16): Promise<ProofResult> {
  const startedAt = performance.now();
  const targetPrefix = "0".repeat(Math.floor(difficultyBits / 4));
  let nonce = 0;

  while (true) {
    const hash = await sha256Hex(`${challenge}:${nonce}`);
    const nibblePass = hash.startsWith(targetPrefix);
    const bitPass = difficultyBits % 4 === 0 || Number.parseInt(hash[targetPrefix.length] ?? "f", 16) < 2 ** (4 - (difficultyBits % 4));

    if (nibblePass && bitPass) {
      return {
        nonce,
        hash,
        attempts: nonce + 1,
        elapsedMs: Math.round(performance.now() - startedAt),
      };
    }

    nonce += 1;
    if (nonce % 500 === 0) await new Promise((resolve) => window.setTimeout(resolve, 0));
  }
}

export async function registerPasskey(): Promise<PasskeyResult> {
  if (!window.isSecureContext) return unavailable("WebAuthn needs HTTPS or localhost.");
  if (!navigator.credentials?.create || !window.PublicKeyCredential) return unavailable("This browser does not expose navigator.credentials.create.");

  const publicKey: PublicKeyCredentialCreationOptions = {
    challenge: randomBytes(32),
    rp: { name: "QAuth Demo" },
    user: {
      id: randomBytes(16),
      name: "demo@qauth.local",
      displayName: "QAuth Demo User",
    },
    pubKeyCredParams: [
      { type: "public-key", alg: -7 },
      { type: "public-key", alg: -257 },
    ],
    authenticatorSelection: {
      authenticatorAttachment: "platform",
      residentKey: "preferred",
      userVerification: "preferred",
    },
    timeout: 60_000,
    attestation: "none",
  };

  const credential = await navigator.credentials.create({ publicKey });
  if (!credential) return unavailable("The authenticator returned no credential.");

  return {
    ok: true,
    title: "Passkey credential created",
    detail: `Credential ${credential.id.slice(0, 18)}… was created by the browser authenticator.`,
  };
}

export async function authenticatePasskey(): Promise<PasskeyResult> {
  if (!window.isSecureContext) return unavailable("WebAuthn needs HTTPS or localhost.");
  if (!navigator.credentials?.get || !window.PublicKeyCredential) return unavailable("This browser does not expose navigator.credentials.get.");

  const publicKey: PublicKeyCredentialRequestOptions = {
    challenge: randomBytes(32),
    userVerification: "preferred",
    timeout: 60_000,
  };

  const credential = await navigator.credentials.get({ publicKey });
  if (!credential) return unavailable("The authenticator returned no assertion.");

  return {
    ok: true,
    title: "Passkey assertion received",
    detail: `Credential ${credential.id.slice(0, 18)}… signed a real WebAuthn challenge.`,
  };
}

function unavailable(detail: string): PasskeyResult {
  return { ok: false, title: "Action unavailable here", detail };
}

function randomBytes(length: number): Uint8Array<ArrayBuffer> {
  const bytes = new Uint8Array(new ArrayBuffer(length));
  crypto.getRandomValues(bytes);
  return bytes;
}

function randomBase64Url(length: number): string {
  const bytes = randomBytes(length);
  return btoa(String.fromCharCode(...bytes)).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function pickSymbols(seed: string): string[] {
  let total = 0;
  for (const char of seed) total = (total + char.charCodeAt(0)) % 9973;
  return Array.from({ length: 4 }, (_, index) => EMOJI_POOL[(total + index * 3) % EMOJI_POOL.length]);
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}
