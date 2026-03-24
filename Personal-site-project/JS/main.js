// ============================================================
// JS/main.js  —  versión corregida y ordenada
// ============================================================

// === 1. IDIOMA — debe ir primero, antes de DOMContentLoaded ===
const savedLang = localStorage.getItem("lang") || "es";
let currentLanguage = savedLang;

// Claves que contienen HTML con links <a> — deben usar innerHTML
const htmlKeys = [
  "about_text1_1",
  "about_text2_1",
  "about_me_text2_1"
];

function applyTranslations(lang) {
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (translations[lang]?.[key]) {
      if (htmlKeys.includes(key)) {
        el.innerHTML = translations[lang][key];
      } else {
        el.textContent = translations[lang][key];
      }
    }
  });

  const select = document.getElementById("language-select");
  if (select) select.value = lang;
}


// === 2. TEXTO ROTANTE EN HERO ===
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
    "Asesoría personalizada para cada situación legal"
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

let phraseIndex = 0;

function updateRotatingText() {
  const el = document.getElementById("rotating-text");
  if (!el) return;

  // PASO 1 — sale hacia arriba y desaparece
  el.style.opacity = "0";
  el.style.transform = "translateY(-20px)";

  // PASO 2 — cuando terminó de salir: cambia el texto y lo posiciona abajo
  setTimeout(() => {
    phraseIndex = (phraseIndex + 1) % phrases[currentLanguage].length;
    el.textContent = phrases[currentLanguage][phraseIndex];

    // Lo coloca abajo listo para entrar (sin transición para que sea instantáneo)
    el.style.transition = "none";
    el.style.transform = "translateY(20px)";

    // PASO 3 — fuerza al navegador a registrar el estado "abajo" antes de animar
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Reactiva la transición y entra desde abajo hacia el centro
        el.style.transition = "opacity 0.5s ease-in-out, transform 0.5s ease-in-out";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      });
    });
  }, 500); // espera exactamente los 500ms que tarda en salir
}

///El doble `requestAnimationFrame` es necesario porque el navegador necesita dos frames para registrar el cambio de posición antes de volver a activar la transición. Sin eso, el "salto abajo" no ocurre y el texto entra desde donde estaba.

///## Por qué funciona ahora

///El flujo queda perfectamente ordenado:

///[0ms]    → opacidad baja + sube        (sale hacia arriba)
///[500ms]  → texto cambia + baja abajo   (reposición instantánea)
///[502ms]  → opacidad sube + sube al centro  (entra desde abajo)


// === 3. TESTIMONIOS ===
const testimonials = [
  { text: "Cristina resolvió mi divorcio de forma rápida y humana. ¡Total confianza!", author: "María G., Milagro" },
  { text: "Excelente en actos notariales. Documentos perfectos y sin complicaciones.", author: "Carlos R., Empresa local" },
  { text: "Me ayudó con un caso de violencia intrafamiliar. Me sentí protegida en todo momento.", author: "Ana L." },
];

let currentTestimonial = 0;

function showTestimonial() {
  const carousel = document.getElementById("testimonial-carousel");
  if (!carousel) return;

  const t = testimonials[currentTestimonial];
  carousel.innerHTML = `
    <blockquote>
      <p>"${t.text}"</p>
      <cite>— ${t.author}</cite>
    </blockquote>
  `;
  currentTestimonial = (currentTestimonial + 1) % testimonials.length;
}


// === 4. REVEAL ON SCROLL ===
function revealOnScroll() {
  const triggerBottom = window.innerHeight * 0.85;
  document.querySelectorAll("section").forEach(section => {
    if (section.getBoundingClientRect().top < triggerBottom) {
      section.classList.add("reveal");
    }
  });
}


// === 5. MENÚ HAMBURGUESA ===
function initMenu() {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (!menuToggle || !navLinks) return;

  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    navLinks.classList.toggle("active");
    menuToggle.textContent = navLinks.classList.contains("active") ? "✖" : "☰";
    document.body.style.overflow = navLinks.classList.contains("active") ? "hidden" : "";
  });

  document.addEventListener("click", (event) => {
    const isClickInside = menuToggle.contains(event.target) || navLinks.contains(event.target);
    if (!isClickInside && navLinks.classList.contains("active")) {
      navLinks.classList.remove("active");
      menuToggle.textContent = "☰";
      document.body.style.overflow = "";
    }
  });

  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      menuToggle.textContent = "☰";
      document.body.style.overflow = "";
    });
  });
}


// === 6. CAMPO "OTRO" EN FORMULARIO DE CONTACTO ===
function showOtherField() {
  const val = document.getElementById("motivo")?.value;
  const container = document.getElementById("other-reason-container");
  if (container) {
    container.style.display = val === "Otro" ? "block" : "none";
  }
}


// === 7. INICIALIZACIÓN — todo arranca aquí ===
document.addEventListener("DOMContentLoaded", () => {

  // Aplicar idioma guardado
  applyTranslations(currentLanguage);

  // Listener del selector de idioma
  const select = document.getElementById("language-select");
  if (select) {
    select.addEventListener("change", (e) => {
      currentLanguage = e.target.value;
      localStorage.setItem("lang", currentLanguage);
      applyTranslations(currentLanguage);

      // Sincronizar el texto rotante con el nuevo idioma
      phraseIndex = 0;
      const textElement = document.getElementById("rotating-text");
      if (textElement) {
        textElement.textContent = phrases[currentLanguage][0];
      }
    });
  }

  // Iniciar texto rotante si existe la página hero
  if (document.getElementById("rotating-text")) {
    setInterval(updateRotatingText, 4000);
  }

  // Iniciar testimonios si existe el carrusel
  if (document.getElementById("testimonial-carousel")) {
    showTestimonial();
    setInterval(showTestimonial, 7000);
  }

  // Iniciar menú hamburguesa
  initMenu();

  // Reveal inicial (secciones ya visibles al cargar)
  revealOnScroll();
});

// Reveal mientras scrolleas
window.addEventListener("scroll", revealOnScroll);