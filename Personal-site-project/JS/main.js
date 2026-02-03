const phrases = {
  es: [
    "Tu Asesor Legal de Confianza",
    "Protegiendo tus derechos cada día",
    "Soluciones legales claras y según tus necesidades",
    "Asesoría jurídica hecha para ti",
    "Defendiendo tus derechos con integridad y dedicación",
    "Comprometidos con la justicia y la verdad",
    "Tu tranquilidad legal es nuestra prioridad",
    "Experiencia y confianza a tu servicio",
    "Asesoría personalizada para cada situación legal",
  ],
  en: [
    "Your Trusted Legal Advisor",
    "Protecting Your Rights Every Day",
    "Clear Legal Solutions Tailored to You",
    "Legal Advice Made for You",
    "Defending your rights with integrity and dedication",
    "Committed to justice and truth",
    "Your legal peace of mind is our priority",
    "Experience and trust at your service",
    "Personalized advice for every legal situation"
  ]
};

let currentLanguage = "es"; // default language
let index = 0;

document.addEventListener("DOMContentLoaded", () => {
  const textElement = document.getElementById("rotating-text");

  function updatePhrase() {
    textElement.style.opacity = 0;

    setTimeout(() => {
      index = (index + 1) % phrases[currentLanguage].length;
      textElement.textContent = phrases[currentLanguage][index];
      textElement.style.opacity = 1;
    }, 500);
  }

  // rotate phrases every 4 seconds
  setInterval(updatePhrase, 4000);

  // Language selector change event
  const languageSelect = document.getElementById("language-select");
  languageSelect.addEventListener("change", (e) => {
    currentLanguage = e.target.value;
    index = 0;  // reset to first phrase on language change
    textElement.textContent = phrases[currentLanguage][index];
  });
});