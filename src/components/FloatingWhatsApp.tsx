import { MessageCircle } from 'lucide-react';

export default function FloatingWhatsApp() {
  // Replace this with your actual clinic phone number.
  // Do not include the '+' or '00', just the country code (e.g., 91 for India) and the number.
  const phoneNumber = "447407022204"; 
  
  // This is the pre-filled message the patient will send you
  const message = "Hello! I would like to book a physiotherapy appointment.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 hover:bg-[#20b858]"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}