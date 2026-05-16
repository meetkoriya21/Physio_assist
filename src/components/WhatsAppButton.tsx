import { MessageCircle } from "lucide-react";

// ── REPLACE with your real WhatsApp number (include country code, no + or spaces) ──
// Example: Indian number +91 98765 43210  →  "919876543210"
const WHATSAPP_NUMBER = "00000000000";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hello PhysioLife Clinic! I'd like to book an appointment."
);

export function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="whatsapp-pulse fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-[oklch(0.65_0.18_145)] text-white shadow-soft transition-transform hover:scale-110"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
