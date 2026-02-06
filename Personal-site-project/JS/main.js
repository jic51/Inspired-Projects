// === Rotating Text en Hero ===
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

let currentLanguage = "es";
let phraseIndex = 0;

function updateRotatingText() {
  const textElement = document.getElementById("rotating-text");
  if (!textElement) return;

  textElement.style.opacity = 0;

  setTimeout(() => {
    phraseIndex = (phraseIndex + 1) % phrases[currentLanguage].length;
    textElement.textContent = phrases[currentLanguage][phraseIndex];
    textElement.style.opacity = 1;
  }, 500);
}

// Iniciar rotación
setInterval(updateRotatingText, 4000);

// Cambiar idioma y resetear frase
document.getElementById("language-select").addEventListener("change", (e) => {
  currentLanguage = e.target.value;
  phraseIndex = 0;
  const textElement = document.getElementById("rotating-text");
  textElement.textContent = phrases[currentLanguage][phraseIndex];
  textElement.style.opacity = 1;
});

// === Menú hamburguesa mejorado ===
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
  // Abrir/cerrar al clic en hamburguesa
  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation(); // evita que el clic se propague y cierre inmediatamente
    navLinks.classList.toggle("active");
    menuToggle.textContent = navLinks.classList.contains("active") ? "✖" : "☰";
  });

  // Cerrar al clic fuera del menú o toggle
  document.addEventListener("click", (event) => {
    const isClickInside = menuToggle.contains(event.target) || navLinks.contains(event.target);
    
    if (!isClickInside && navLinks.classList.contains("active")) {
      navLinks.classList.remove("active");
      menuToggle.textContent = "☰";
    }
  });

  // Cerrar al hacer clic en un enlace del menú (útil en móvil)
  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      menuToggle.textContent = "☰";
    });
  });
}

// === Reveal on scroll ===
const sections = document.querySelectorAll("section");

const revealOnScroll = () => {
  const triggerBottom = window.innerHeight * 0.85;
  sections.forEach((section) => {
    const sectionTop = section.getBoundingClientRect().top;
    if (sectionTop < triggerBottom) {
      section.classList.add("reveal");
    }
  });
};

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

// === Testimonials carrusel ===
const testimonials = [
  { text: "Cristina resolvió mi divorcio de forma rápida y humana. ¡Total confianza!", author: "María G., Milagro" },
  { text: "Excelente en actos notariales. Documentos perfectos y sin complicaciones.", author: "Carlos R., Empresa local" },
  { text: "Me ayudó con un caso de violencia intrafamiliar. Me sentí protegida en todo momento.", author: "Ana L." },
];

let current = 0;
const carousel = document.getElementById("testimonial-carousel");

function showTestimonial() {
  if (carousel) {
    const t = testimonials[current];
    carousel.innerHTML = `
      <blockquote>
        <p>“${t.text}”</p>
        <cite>— ${t.author}</cite>
      </blockquote>
    `;
    current = (current + 1) % testimonials.length;
  }
}

if (carousel) {
  showTestimonial();
  setInterval(showTestimonial, 7000);
}