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
    "Asesoría personalizada para cada situación legal",
    "Seguridad jurídica para sus decisiones más importantes. Estamos listos para representar sus intereses",
    "Resolvamos su situación legal hoy: agende una consulta técnica y recupere su tranquilidad",
    "No deje su bienestar al azar; tome el control de su caso con nuestra asesoría especializada",
    "Transformamos procesos complejos en soluciones claras. Hablemos sobre cómo podemos ayudarle",
    "Justicia con resultados, no solo promesas. Solicite su evaluación inicial y conozca sus opciones reales",
    "Seguridad jurídica para sus decisiones más importantes. Estamos listos para representar sus intereses",
    "Su caso merece una defensa sólida. Permítanos ser el respaldo legal que su familia o empresa necesita",
    "Asesoría legal de alto nivel a su alcance. Escríbanos y obtenga una hoja de ruta clara para su caso",
    "Protección legal experta sin tecnicismos innecesarios. Iniciemos hoy la defensa de sus derechos",
    "Experiencia probada al servicio de su causa. Agende una cita y asegure el respaldo que su situación exige"
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
    "Legal certainty for your most critical decisions. We are ready to represent your best interests",
    "Resolve your legal situation today: schedule a technical consultation and regain your peace of mind",
    "Don't leave your well-being to chance; take control of your case with our specialized advice",
    "We turn complex processes into clear solutions. Let's talk about how we can help you",
    "Justice with results, not just promises. Request your initial evaluation and learn about your real options",
    "Legal certainty for your most important decisions. We are ready to represent your interests",
    "Your case deserves a solid defense. Let us be the legal support your family or business needs",
    "High-level legal advice within your reach. Write to us and get a clear roadmap for your case",
    "Expert legal protection without unnecessary jargon. Let's start defending your rights today",
    "Proven experience at the service of your cause. Schedule an appointment and secure the support your situation demands"
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
  { text: "Profesional, clara y siempre disponible. La recomiendo al 100%.", author: "Jorge M., Milagro" },
  { text: "Gracias a Cristina, mi caso de tránsito se resolvió sin problemas. ¡Muy agradecido!", author: "Luis F., Milagro" },
  { text: "Su asesoría legal me dio la tranquilidad que necesitaba en un momento difícil. ¡Gracias, Cristina!", author: "Sofía P., Milagro" },
  { text: "Cristina es una abogada excepcional. Su dedicación y conocimiento marcaron la diferencia en mi caso.", author: "Miguel A., Milagro" },
  { text: "Me asesoró con un contrato importante y su atención al detalle fue impresionante. ¡Muy recomendable!", author: "Laura V., Milagro" },
  { text: "Su apoyo legal me dio la confianza para enfrentar mi situación. Estoy muy agradecida por su ayuda.", author: "Elena S., Milagro" },
  { text: "Recuperé lo que me correspondía en mi liquidación laboral gracias a su asesoría. Proceso transparente y sin vueltas.", author: "Javier M., Guayaquil"},
  { text: "Pensé que mi trámite de herencia tardaría años, pero lo resolvieron en tiempo récord. Muy profesionales.", author: "Elena S., Quito"},
  { text: "Su asesoría en mi caso de violencia intrafamiliar fue fundamental. Me sentí segura y apoyada en todo momento.", author: "María G., Milagro" },
  { text: "Pensé que mi trámite de herencia tardaría años, pero lo resolvieron en tiempo récord. Muy profesionales.", author: "Elena S., Quito"},
  { text: "Excelente gestión en el cobro de deudas. Recuperamos la cartera de mi negocio de forma ética y rápida.", author: "Roberto D., Comerciante local"},
  { text: "Lo que más valoro es que me hablaron claro desde el primer día. Sin términos complicados, solo soluciones.", author: "Patricia V., Milagro" },
  { text: "Atención personalizada de verdad. Sienten tu problema como propio y no te dejan solo en ninguna audiencia.", author: "Luis F., Cuenca" },
  { text: "Me asesoraron en la compra de mi primera propiedad. Me dieron la seguridad legal que necesitaba para invertir.", author: "Mónica T., Inversionista extranjera en Ecuador" },
  { text: "En un momento de mucha incertidumbre con mi custodia, fueron mi mayor apoyo. Expertos y muy humanos.", author: "Gabriela P., Milagro" },
  { text: "Su atención y profesionalismo me hicieron sentir segura en todo momento.", author: "Isabel R., Milagro" },
  { text: "Muy satisfecha con el servicio recibido. Cristina es una abogada comprometida y profesional.", author: "Ana L., Milagro"},
  { text: "Su compromiso y profesionalismo me hicieron sentirme segura en todo momento.", author: "Elena S., Milagro"},
  { text: "Excelente trabajo. Me ayudaron a resolver mi caso de forma rápida y eficiente.", author: "Carlos R., Empresa local" },
  { text: "Cristina es una abogada excepcional. Su dedicación y conocimiento marcaron la diferencia en mi caso.", author: "Miguel A., Milagro" },
  { text: "Resolvieron mi situación migratoria de manera impecable. Ahora mi familia y yo estamos tranquilos.", author: "Juan C., Residente extranjero en Ecuador"},
  { text: "Llevan todos los contratos de mi empresa. Desde que están con nosotros, no hemos tenido ni un solo vacío legal.", author: "Ricardo H., Emprendedor local"},
  { text: "Trámite notarial ágil y seguro. Es difícil encontrar un servicio tan puntual y detallista hoy en día.", author: "Sofía L., Inmobiliaria local"}
];

function initTestimonialsCarousel() {
  const track = document.getElementById("testimonials-track");
  if (!track) return;

  // Función para crear una tarjeta
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

  // Generar todas las tarjetas
  // Renderiza las tarjetas DOS veces — así el loop parece infinito
  [testimonials,testimonials].forEach(t => {
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
    setInterval(updateRotatingText, 6500);
  }

  // Iniciar testimonios si existe el carrusel
  initTestimonialsCarousel();

  // Iniciar menú hamburguesa
  initMenu();

  // Reveal inicial (secciones ya visibles al cargar)
  revealOnScroll();

  checkCounters(); // por si ya está visible al cargar
});

// Reveal mientras scrolleas
window.addEventListener("scroll", revealOnScroll);

// === CONTADOR ANIMADO ===
function animateCounters() {
  const counters = document.querySelectorAll(".stat-number");
  if (!counters.length) return;

  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute("data-target"));
    const suffix = counter.getAttribute("data-suffix") || "";
    const duration = 2000; // 2 segundos para llegar al número final
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    let step = 0;

    // Efecto easing — empieza rápido y frena al final
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    const timer = setInterval(() => {
      step++;
      const progress = easeOut(step / steps);
      current = Math.round(progress * target);
      counter.textContent = current + suffix;

      if (step >= steps) {
        counter.textContent = target + suffix;
        clearInterval(timer);
      }
    }, duration / steps);
  });
}

// Activar el contador cuando la sección entra en pantalla (solo 1 vez)
let countersTriggered = false;

function checkCounters() {
  if (countersTriggered) return;
  const statsSection = document.getElementById("stats");
  if (!statsSection) return;

  const top = statsSection.getBoundingClientRect().top;
  if (top < window.innerHeight * 0.85) {
    countersTriggered = true;
    animateCounters();
  }
}

window.addEventListener("scroll", checkCounters);

