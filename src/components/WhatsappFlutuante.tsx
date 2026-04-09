import { useLocation } from "react-router-dom";

function IconeWhatsappOficial() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
      <path
        fill="currentColor"
        d="M20.52 3.48A11.78 11.78 0 0 0 12.06 0C5.46 0 .06 5.4.06 12c0 2.1.54 4.14 1.56 5.94L0 24l6.24-1.62A11.97 11.97 0 0 0 12.06 24c6.6 0 12-5.4 12-12 0-3.18-1.26-6.18-3.54-8.52Zm-8.46 18.48c-1.8 0-3.54-.48-5.1-1.38l-.36-.18-3.72.96.96-3.66-.24-.36A9.84 9.84 0 0 1 2.1 12c0-5.46 4.5-9.9 9.96-9.9 2.64 0 5.16 1.02 7.02 2.88A9.85 9.85 0 0 1 21.96 12c0 5.46-4.44 9.96-9.9 9.96Zm5.46-7.44c-.3-.18-1.74-.84-2.04-.96-.24-.12-.42-.18-.6.18-.18.3-.72.96-.9 1.14-.18.18-.3.24-.6.06-.3-.18-1.2-.42-2.28-1.38-.84-.72-1.44-1.68-1.62-1.98-.18-.3 0-.42.12-.6.12-.12.3-.3.42-.48.12-.18.18-.3.3-.48.06-.18 0-.36 0-.54-.06-.12-.6-1.5-.84-2.1-.24-.54-.48-.48-.66-.48h-.54c-.18 0-.48.06-.72.3s-.96.9-.96 2.16.96 2.46 1.08 2.64c.12.18 1.86 2.88 4.5 4.02 2.64 1.14 2.64.78 3.12.72.48-.06 1.74-.72 1.98-1.38.24-.72.24-1.26.18-1.38-.06-.12-.24-.18-.54-.36Z"
      />
    </svg>
  );
}

export default function WhatsappFlutuante() {
  const location = useLocation();

  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <a
      href="https://wa.me/5551994727036"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Conversar no WhatsApp"
      title="Conversar no WhatsApp"
      className="fixed right-5 bottom-5 z-[80] w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_0_24px_rgba(37,211,102,0.55)] hover:scale-105 active:scale-95 transition-all duration-300"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping" />
      <span className="relative z-10">
        <IconeWhatsappOficial />
      </span>
    </a>
  );
}
