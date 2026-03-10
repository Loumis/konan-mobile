export type JwtLoginResponse = {
  access_token: string;
  plan: "FREE" | "PREMIUM";
  token_type: "bearer";
};
export type MeResponse = { id: string; email: string; name?: string };
export type BillingStatus = { plan: "FREE" | "PREMIUM" };
export type PaymentSheetResponse = {
  paymentIntent: string;
  ephemeralKey: string;
  customer: string;
  publishableKey: string;
};

export type ChatResponse = {
  reply?: string;
  message?: string; // legacy fallback
  session_id?: string;
  id?: string; // legacy/alternate session id
  response_fingerprint?: string | null;
};