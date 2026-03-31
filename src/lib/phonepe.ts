import { StandardCheckoutClient, Env } from "@phonepe-pg/pg-sdk-node";

const clientId = process.env.PHONEPE_CLIENT_ID!;
const clientSecret = process.env.PHONEPE_CLIENT_SECRET!;
const clientVersion = parseInt(process.env.PHONEPE_CLIENT_VERSION || "1");
const env =
  process.env.PHONEPE_ENV === "PRODUCTION" ? Env.PRODUCTION : Env.SANDBOX;

let client: StandardCheckoutClient | null = null;

export function getPhonePeClient(): StandardCheckoutClient {
  if (!client) {
    client = StandardCheckoutClient.getInstance(
      clientId,
      clientSecret,
      clientVersion,
      env
    );
  }
  return client;
}

export function getRedirectBaseUrl(): string {
  return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
}
