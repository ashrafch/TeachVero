import "server-only";
export const integrations = {
  payment: {
    enabled: false,
    reason:
      "Prices, policies and Stripe credentials pending. No checkout is available.",
  },
  calendar: {
    enabled: false,
    reason:
      "Availability is confirmed personally. This form does not reserve a time.",
  },
  email: { enabled: false, reason: "Saved locally. No email has been sent." },
} as const;
