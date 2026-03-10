// FI9_NAYEK: Endpoints corrigés pour correspondre au backend
export const endpoints = {
    login: "/api/auth/login", // {email, password} -> {access_token}
    register: "/api/auth/register", // {email, password, name}
    me: "/api/auth/me", // GET -> profil si JWT valide
    billingStatus: "/billing/status", // GET -> { plan: "FREE"|"PREMIUM" }
    billingSheet: "/billing/payment-sheet", // POST -> { paymentIntent, ephemeralKey, customer, publishableKey }
    };