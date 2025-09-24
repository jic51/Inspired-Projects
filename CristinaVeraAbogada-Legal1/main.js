document.addEventListener("DOMContentLoaded", () => {
    // Mobile navigation toggle
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });
    }

    // Language switcher
    const translations = {
        es: {
            nav_home: "Inicio",
            nav_about: "Sobre mí",
            nav_services: "Servicios",
            nav_contact: "Contactanos",
            nav_faq: "Preguntas Frequentes",
            head_h1: "Abogada Cristina Vera",
            hero_title: "Tu Asesor Legal de Confianza",
            hero_subtitle: "Experiencia, Honestidad, Compromiso y Solucion a sus problemas juridicos.",
            hero_cta: "Solicita una Consulta",
            about_title: "Abogada Cristina Vera",
            about_text1: "Con más de 10 años de experiencia legal, Cristina Vera se ha consolidado como una asesora y defensora de confianza para cientos de personas y pequeñas empresas en Milagro y en todo Ecuador. Su experiencia abarca una amplia gama de áreas legales, incluyendo derecho civil, derecho corporativo, derecho de familia, planificación patrimonial y actos notariales como contratos, poderes notariales y transacciones inmobiliarias.",
            about_text1_1: "Conoce mas sobre Cristina Vera",
            about_text2: "Cristina está profundamente comprometida con brindar soluciones legales personalizadas, adaptadas a las necesidades únicas de cada cliente. Es reconocida por su enfoque minucioso, comunicación clara y dedicación inquebrantable para lograr los mejores resultados posibles. Ya sea asistiendo a clientes en litigios complejos o guiándolos en asuntos transaccionales, Cristina combina su amplio conocimiento con una comprensión compasiva del impacto personal que pueden tener los problemas legales.",
            about_text2_1: "Conoce mas sobre los Servicios legales",
            about_text3: "Su pasión por la justicia y la defensa del cliente impulsa su continuo desarrollo profesional y su compromiso de mantenerse al día con los cambios en la legislación ecuatoriana. El objetivo de Cristina Vera es empoderar a sus clientes mediante asesoría legal transparente, asegurándose de que se sientan apoyados y seguros en cada paso del proceso.",
            about_text3_1: "Agenda una consulta legal hoy",
            services_title: "Servicios",
            services_title1: "Entre los servicios legales que ofrece Cristina Vera se incluyen:",
            service_1: "Familia",
            service_1_1: "El derecho de familia en Ecuador abarca temas como divorcio, custodia, pensión alimenticia, régimen de visitas y protección de menores.",
            service_1_2: "Cristina guía a sus clientes en estos procesos emocionales con atención personalizada y precisión legal, preparando documentos, representando en audiencias o mediando acuerdos.",
            service_1_3: "Los conflictos familiares son delicados y tienen consecuencias a largo plazo. La experiencia de Cristina garantiza que las decisiones legales protejan tus derechos y el bienestar de tu familia.",
            service_2: "Mujer",
            service_2_1: "Asesoría y representación en casos de violencia de género, derechos laborales, y protección legal para mujeres. Esta área se enfoca en proteger a mujeres víctimas de violencia intrafamiliar, abandono, abuso o discriminación, especialmente en el entorno familiar.",
            service_2_2: "Ofrece intervención legal rápida: medidas de protección, procesos de separación, custodia de hijos y acompañamiento jurídico con enfoque humano.",
            service_2_3: "Cristina comprende la urgencia y el peso emocional de estos casos. Brinda defensa firme, trato empático y acción legal inmediata para protegerte.",
            service_3: "Niñez y Adolescencia",
            service_3_1: "Se refiere a casos legales que involucran a menores: custodia, patria potestad, pensión alimenticia, visitas, tutela y protección en situaciones vulnerables.",
            service_3_2: "Cristina asegura que el interés superior del niño sea respetado, ya sea gestionando custodias, redactando acuerdos de alimentos o solicitando medidas judiciales de protección.",
            service_3_3: "Los casos con menores requieren protocolos estrictos y sensibilidad. Cristina ofrece representación legal sólida, con enfoque en la niñez y respeto por la ley ecuatoriana.",
            service_4: "Actos notariales (Escrituras, Contratos, Poderes, etc)",
            service_4_1: "Son documentos legales que deben ser validados ante notario: contratos, escrituras, poderes, autorizaciones, declaraciones juramentadas, entre otros.",
            service_4_2: "Ella redacta y revisa tus documentos para asegurar que sean claros, legales y protejan tus intereses antes de ser firmados ante un notario.",
            service_4_3: "Un documento mal redactado puede traer grandes problemas. Cristina garantiza estructura legal correcta y evita errores que puedan afectar tu seguridad jurídica.",
            service_5: "Violencia intrafamiliar",
            service_5_1: "La violencia intrafamiliar incluye abuso físico, psicológico, sexual o económico que ocurre en relaciones familiares o íntimas. En Ecuador, está regulada por la Ley Orgánica Integral para Prevenir y Erradicar la Violencia contra las Mujeres y el Código Orgánico Integral Penal (COIP). Las víctimas pueden solicitar medidas de protección, custodia de hijos, boletas de auxilio e incluso procesos penales contra el agresor.",
            service_5_2: "Cristina Vera brinda apoyo legal inmediato a víctimas, solicitando medidas de protección, presentando denuncias formales y guiando a las personas en los procesos ante la policía y la justicia. Ella asegura que las instituciones traten el caso con la seriedad y respeto que merece.",
            service_5_3: "Los casos de violencia intrafamiliar son delicados y requieren acción legal firme, rápida y con sensibilidad. Cristina combina su conocimiento jurídico con comprensión humana, protegiendo tu seguridad, tus derechos y ayudándote a recuperar el control de tu vida.",
            service_6: "Tránsito",
            service_6_1: "Incluye infracciones, accidentes, multas, suspensión de licencias y trámites administrativos ante la Agencia Nacional de Tránsito (ANT).",
            service_6_2: "Cristina brinda asesoría en todo el proceso de defensa legal, desde la presentación de descargos hasta la representación en audiencias de tránsito.",
            service_6_3: "El derecho de tránsito tiene plazos muy estrictos. La representación legal experta te ayuda a manejar los aspectos técnicos, evitar errores y defender tus derechos como conductor.",
            faq_title: "Preguntas Frecuentes",
            faq_q1: "¿Cuánto cuesta una consulta inicial?",
            faq_a1: "La consulta inicial puede variar según el tipo de caso, pero muchas veces ofrecemos una primera evaluación gratuita.",
            faq_q2: "¿Qué documentos debo llevar a mi cita?",
            faq_a2: "Documentación básica como cédula de identidad, contratos, escrituras, etc., según el caso.",
            faq_q3: "¿Es necesario que haga una cita en linea?",
            faq_a3: "Si, la cita en linea es una forma de que te comuniques de forma segura y rapida conmigo.",
            faq_q4: "¿Por qué trabajar con un abogado?",
            faq_a4: "Un abogado no solo representa legalmente, sino que es tu guía y estratega para tomar decisiones en temas importantes. La abogada Cristina Vera combina experiencia y un trato humano, garantizando que tengas una representación legal sólida y transparente.",
            contact_title: "Contáctanos",
            label_name: "Nombre completo:",
            label_cedula: "Numero de cedula:",
            label_email: "Correo electrónico:",
            label_motivo: "Motivo de consulta:",
            opt_familia: "Asunto de Familia",
            opt_mujer: "Asuntos de Mujer",
            opt_niñez: "Asuntos de niñez y a dolecensia",
            opt_notariales: "Escrituras, Contratos, Poderes, etc",
            opt_intrafamiliar: "Violencia en la familia",
            opt_transito: "Transito",
            opt_otro: "Otro",
            opt_otro1: "Por favor, especifique:",
            btn_submit: "Enviar Consulta",
            phone: "Teléfono: +593992347656",
            contact_location: "Ubicación: Milagro, Ecuador",
            calendly_btn: "Agenda una Cita en Calendly",
            footer_rights: "© 2024 Cristina Vera. Todos los derechos reservados."
        },
        en: {
            nav_home: "Home",
            nav_about: "About me",
            nav_services: "Services",
            nav_contact: "Contact us",
            nav_faq: "FAQ",
            head_h1: "Attorney Cristina Vera",
            hero_title: "Your Trusted Legal Advisor",
            hero_subtitle: "Experience, Honesty, Commitment, and Solutions to your legal problems.",
            hero_cta: "Request a Consultation",
            about_title: "Attorney Cristina Vera",
            about_text1: "With over 10 years of legal experience, Cristina Vera has established herself as a trusted advisor and advocate for hundreds of individuals and small businesses in Milagro and throughout Ecuador. Her expertise spans a wide range of legal areas, including civil law, corporate law, family law, estate planning, and notarial acts such as contracts, powers of attorney, and real estate transactions.",
            about_text1_1: "Find out more about Cristina Vera",
            about_text2: "Cristina is deeply committed to providing personalized legal solutions tailored to each client's unique needs. She is known for her meticulous approach, clear communication, and unwavering dedication to achieving the best possible outcomes. Whether assisting clients in complex litigation or guiding them through transactional matters, Cristina combines her extensive knowledge with a compassionate understanding of the personal impact legal issues can have.",
            about_text2_1: "Find out more about the legal services",
            about_text3: "Her passion for justice and client advocacy drives her continuous professional development and her commitment to staying up-to-date with changes in Ecuadorian legislation. Cristina Vera's goal is to empower her clients through transparent legal advice, ensuring they feel supported and confident at every step of the process.",
            about_text3_1: "Schedule a legal consultation today",
            services_title: "Services",
            services_title1: "Among the legal services offered by Cristina Vera are:",
            service_1: "Family",
            service_1_1: "Family law in Ecuador covers issues such as divorce, custody, child support, visitation rights, and the protection of minors.",
            service_1_2: "Cristina guides her clients through these emotional processes with personalized attention and legal precision, preparing documents, representing them in hearings or mediating agreements.",
            service_1_3: "Family conflicts are delicate and have long-term consequences. Cristina's experience ensures that legal decisions protect your rights and your family's well-being.",
            service_2: "Women",
            service_2_1: "Counseling and representation in cases of gender-based violence, labor rights, and legal protection for women. This area focuses on protecting women who are victims of domestic violence, abandonment, abuse, or discrimination, especially within the family environment.",
            service_2_2: "She offers swift legal intervention: protection measures, separation proceedings, child custody, and legal support with a human-centered approach.",
            service_2_3: "Cristina understands the urgency and emotional weight of these cases. She provides a firm defense, empathetic treatment, and immediate legal action to protect you.",
            service_3: "Children and Adolescents",
            service_3_1: "Refers to legal cases involving minors: custody, parental authority, child support, visitation, guardianship, and protection in vulnerable situations.",
            service_3_2: "Cristina ensures that the best interest of the child is respected, whether by managing custody, drafting child support agreements, or requesting judicial protection measures.",
            service_3_3: "Cases involving minors require strict protocols and sensitivity. Cristina offers solid legal representation, with a focus on childhood and respect for Ecuadorian law.",
            service_4: "Notarial Acts (Deeds, Contracts, Powers of Attorney, etc.)",
            service_4_1: "These are legal documents that must be validated before a notary: contracts, deeds, powers of attorney, authorizations, sworn statements, among others.",
            service_4_2: "She drafts and reviews your documents to ensure they are clear, legal, and protect your interests before being signed before a notary.",
            service_4_3: "A poorly drafted document can lead to major problems. Cristina ensures correct legal structure and prevents errors that could affect your legal security.",
            service_5: "Domestic Violence",
            service_5_1: "Domestic violence includes physical, psychological, sexual, or economic abuse that occurs in family or intimate relationships. In Ecuador, it is regulated by the Comprehensive Organic Law to Prevent and Eradicate Violence Against Women and the Comprehensive Organic Criminal Code (COIP). The victims can request protection measures, child custody, emergency assistance forms, and even criminal proceedings against the abuser.",
            service_5_2: "Cristina Vera provides immediate legal support to victims, requesting protection measures, filing formal complaints, and guiding people through the processes with the police and the justice system. She ensures that institutions treat the case with the seriousness and respect it deserves.",
            service_5_3: "Domestic violence cases are delicate and require firm, swift, and sensitive legal action. Cristina combines her legal knowledge with human understanding, protecting your safety, your rights, and helping you regain control of your life.",
            service_6: "Traffic",
            service_6_1: "Includes infractions, accidents, fines, license suspension, and administrative procedures before the National Transit Agency (ANT).",
            service_6_2: "Cristina provides advice throughout the legal defense process, from filing discharges to representation in traffic hearings.",
            service_6_3: "Traffic law has very strict deadlines. Expert legal representation helps you manage the technical aspects, avoid errors, and defend your rights as a driver.",
            faq_title: "Frequently Asked Questions",
            faq_q1: "How much does an initial consultation cost?",
            faq_a1: "The initial consultation may vary depending on the type of case, but we often offer a free initial assessment.",
            faq_q2: "What documents should I bring to my appointment?",
            faq_a2: "Basic documentation such as ID, contracts, deeds, etc., depending on the case.",
            faq_q3: "Is it necessary to make an appointment online?",
            faq_a3: "Yes, an online appointment is a safe and fast way to communicate with me.",
            faq_q4: "Why work with an attorney?",
            faq_a4: "An attorney not only provides legal representation but also serves as your guide and strategist for making important decisions. Attorney Cristina Vera combines experience with a human touch, ensuring that you have solid and transparent legal representation.",
            contact_title: "Contact Us",
            label_name: "Full Name:",
            label_cedula: "ID Number:",
            label_email: "Email Address:",
            label_motivo: "Reason for Inquiry:",
            opt_familia: "Family Matter",
            opt_mujer: "Women's Issues",
            opt_niñez: "Children and Adolescents Issues",
            opt_notariales: "Notarial Acts",
            opt_intrafamiliar: "Domestic Violence",
            opt_transito: "Traffic",
            opt_otro: "Other",
            opt_otro1: "Please specify:",
            btn_submit: "Submit Inquiry",
            phone: "Phone: +593992347656",
            contact_location: "Location: Milagro, Ecuador",
            calendly_btn: "Schedule a Consultation on Calendly",
            footer_rights: "© 2024 Cristina Vera. All rights reserved."
        }
    };
    
    const select = document.getElementById("language-select");
    select.addEventListener("change", (e) => {
        const lang = e.target.value;
        document.querySelectorAll("[data-i18n]").forEach(el => {
            const key = el.getAttribute("data-i18n");
            if (translations[lang] && translations[lang][key]) {
                el.innerText = translations[lang][key];
            }
        });
    });

    // Rotating text functionality
    const texts = [
        "Asesoría legal",
        "Servicios legales",
        "Atención personalizada",
        "Soluciones confiables"
    ];
    let currentIndex = 0;
    const rotatingTextElement = document.getElementById("rotating-text");

    if (rotatingTextElement) {
        function updateText() {
            rotatingTextElement.style.opacity = '0';
            setTimeout(() => {
                rotatingTextElement.innerText = texts[currentIndex];
                rotatingTextElement.style.opacity = '1';
                currentIndex = (currentIndex + 1) % texts.length;
            }, 800); // Wait for fade out
        }

        setInterval(updateText, 3000); // Change text every 3 seconds
        updateText(); // Initial call
    }

    // Function to show/hide the 'other' reason text area
    function showOtherField() {
        const motivoSelect = document.getElementById("motivo");
        const otherReasonContainer = document.getElementById("other-reason-container");
        if (motivoSelect.value === "otro") {
            otherReasonContainer.style.display = "block";
            otherReasonContainer.querySelector('textarea').setAttribute('required', 'required');
        } else {
            otherReasonContainer.style.display = "none";
            otherReasonContainer.querySelector('textarea').removeAttribute('required');
        }
    }

    // Call this function on page load if the select element exists
    const motivoSelect = document.getElementById("motivo");
    if (motivoSelect) {
        motivoSelect.addEventListener('change', showOtherField);
        showOtherField(); // To set initial state
    }
});