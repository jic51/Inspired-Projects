// ============================================================
// JS/main.js  — versión limpia y corregida
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
    "Asesoría personalizada para cada situación legal",
    "Seguridad jurídica para sus decisiones más importantes",
    "Resolvamos su situación legal hoy: agende una consulta",
    "No deje su bienestar al azar; tome el control de su caso",
    "Transformamos procesos complejos en soluciones claras",
    "Justicia con resultados, no solo promesas",
    "Su caso merece una defensa sólida",
    "Asesoría legal de alto nivel a su alcance",
    "Protección legal experta sin tecnicismos innecesarios",
    "Experiencia probada al servicio de su causa"
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
    "Personalized advice for every legal situation",
    "Legal certainty for your most critical decisions",
    "Resolve your legal situation today: schedule a consultation",
    "Don't leave your well-being to chance",
    "We turn complex processes into clear solutions",
    "Justice with results, not just promises",
    "Your case deserves a solid defense",
    "High-level legal advice within your reach",
    "Expert legal protection without unnecessary jargon",
    "Proven experience at the service of your cause"
  ]
};

let phraseIndex = 0;

function updateRotatingText() {
  const el = document.getElementById("rotating-text");
  if (!el) return;

  // PASO 1: sale hacia arriba y desaparece
  el.style.opacity = "0";
  el.style.transform = "translateY(-20px)";

  // PASO 2: cuando terminó de salir, cambia el texto y lo posiciona abajo
  setTimeout(() => {
    phraseIndex = (phraseIndex + 1) % phrases[currentLanguage].length;
    el.textContent = phrases[currentLanguage][phraseIndex];

    // Reposición instantánea sin transición
    el.style.transition = "none";
    el.style.transform = "translateY(20px)";

    // PASO 3: doble rAF para que el navegador registre el cambio antes de animar
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = "opacity 0.5s ease-in-out, transform 0.5s ease-in-out";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      });
    });
  }, 500);
}


// === 3. TESTIMONIOS — INFINITE SCROLL CAROUSEL ===
const testimonials = [
  { text: "Cristina resolvió mi divorcio de forma rápida y humana. ¡Total confianza!", author: "María G., Milagro", stars: 5 },
  { text: "Excelente en actos notariales. Documentos perfectos y sin complicaciones.", author: "Carlos R., Empresa local", stars: 5 },
  { text: "Me ayudó con un caso de violencia intrafamiliar. Me sentí protegida en todo momento.", author: "Ana L.", stars: 5 },
  { text: "Profesional, clara y siempre disponible. La recomiendo al 100%.", author: "Jorge M., Milagro", stars: 5 },
  { text: "Gracias a Cristina, mi caso de tránsito se resolvió sin problemas. ¡Muy agradecido!", author: "Luis F., Milagro", stars: 5 },
  { text: "Su asesoría legal me dio la tranquilidad que necesitaba en un momento difícil.", author: "Sofía P., Milagro", stars: 5 },
  { text: "Cristina es una abogada excepcional. Su dedicación marcó la diferencia en mi caso.", author: "Miguel A., Milagro", stars: 5 },
  { text: "Me asesoró con un contrato importante y su atención al detalle fue impresionante.", author: "Laura V., Milagro", stars: 5 },
  { text: "Su apoyo legal me dio la confianza para enfrentar mi situación. Muy agradecida.", author: "Elena S., Milagro", stars: 5 },
  { text: "Recuperé lo que me correspondía en mi liquidación laboral. Proceso transparente.", author: "Javier M., Guayaquil", stars: 5 },
  { text: "Mi trámite de herencia lo resolvieron en tiempo récord. Muy profesionales.", author: "Elena S., Quito", stars: 5 },
  { text: "Excelente gestión en el cobro de deudas. Recuperamos la cartera de mi negocio.", author: "Roberto D., Comerciante local", stars: 5 },
  { text: "Lo que más valoro es que me hablaron claro desde el primer día. Solo soluciones.", author: "Patricia V., Milagro", stars: 5 },
  { text: "Atención personalizada de verdad. Sienten tu problema como propio.", author: "Luis F., Cuenca", stars: 5 },
  { text: "Me asesoraron en la compra de mi primera propiedad. Seguridad legal total.", author: "Mónica T., Inversionista extranjera en Ecuador", stars: 5 },
  { text: "En un momento difícil con mi custodia, fueron mi mayor apoyo. Expertos y humanos.", author: "Gabriela P., Milagro", stars: 5 },
  { text: "Resolvieron mi situación migratoria de manera impecable. Estamos tranquilos.", author: "Juan C., Residente extranjero en Ecuador", stars: 5 },
  { text: "Llevan todos los contratos de mi empresa. No hemos tenido ni un solo vacío legal.", author: "Ricardo H., Emprendedor local", stars: 5 },
  { text: "Trámite notarial ágil y seguro. Difícil encontrar un servicio tan detallista hoy.", author: "Sofía L., Inmobiliaria local", stars: 5 }
];

function initTestimonialsCarousel() {
  const track = document.getElementById("testimonials-track");
  if (!track) return;

  function createCard(t) {
    const card = document.createElement("div");
    card.className = "testimonial-card";
    card.innerHTML = `
      <div class="stars">${"★".repeat(t.stars || 5)}</div>
      <p>"${t.text}"</p>
      <cite>— ${t.author}</cite>
    `;
    return card;
  }

  // ✅ CORRECTO: spread operator para iterar cada testimonio DOS veces
  [...testimonials, ...testimonials].forEach(t => {
    track.appendChild(createCard(t));
  });
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


// === 7. CONTADOR ANIMADO ===
function animateCounters() {
  const counters = document.querySelectorAll(".stat-number");
  if (!counters.length) return;

  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute("data-target"));
    const suffix = counter.getAttribute("data-suffix") || "";
    const duration = 2000;
    const steps = 60;
    let step = 0;

    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    const timer = setInterval(() => {
      step++;
      const progress = easeOut(step / steps);
      counter.textContent = Math.round(progress * target) + suffix;

      if (step >= steps) {
        counter.textContent = target + suffix;
        clearInterval(timer);
      }
    }, duration / steps);
  });
}

let countersTriggered = false;

function checkCounters() {
  if (countersTriggered) return;
  const statsSection = document.getElementById("stats");
  if (!statsSection) return;

  if (statsSection.getBoundingClientRect().top < window.innerHeight * 0.85) {
    countersTriggered = true;
    animateCounters();
  }
}

// === FAQ ACORDEÓN ===
  function initFAQ() {
    document.querySelectorAll(".faq-question").forEach(btn => {
      btn.addEventListener("click", () => {
        const item     = btn.closest(".faq-item");
        const isActive = item.classList.contains("active");

        // Cierra todos
        document.querySelectorAll(".faq-item").forEach(i => {
          i.classList.remove("active");
          i.querySelector(".faq-question").setAttribute("aria-expanded", "false");
        });

        // Abre el clickeado si estaba cerrado
        if (!isActive) {
          item.classList.add("active");
          btn.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

// === 8. INICIALIZACIÓN — todo arranca aquí ===
document.addEventListener("DOMContentLoaded", () => {

  applyTranslations(currentLanguage);

  const select = document.getElementById("language-select");
  if (select) {
    select.addEventListener("change", (e) => {
      currentLanguage = e.target.value;
      localStorage.setItem("lang", currentLanguage);
      applyTranslations(currentLanguage);

      // Sincronizar texto rotante con el nuevo idioma
      phraseIndex = 0;
      const textElement = document.getElementById("rotating-text");
      if (textElement) {
        textElement.textContent = phrases[currentLanguage][0];
      }
    });
  }

  if (document.getElementById("rotating-text")) {
    setInterval(updateRotatingText, 6500);
  }

  // Inicializar iconos Lucide
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  initTestimonialsCarousel();
  initMenu();
  revealOnScroll();
  checkCounters();
  initFAQ();

  if (typeof lucide !== "undefined") lucide.createIcons();
  
});

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("scroll", checkCounters);