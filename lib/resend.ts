import { Resend } from "resend";

let _resend: Resend | null = null;

export function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

// Backward-compatible alias for existing import pattern
export const resend = {
  emails: {
    send: (...args: Parameters<Resend["emails"]["send"]>) =>
      getResend().emails.send(...args),
  },
};

export const FROM_EMAIL = "Maison Élise <orders@maison-elise.com>";
