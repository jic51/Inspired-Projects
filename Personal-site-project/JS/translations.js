// ============================================================
// JS/translations.js
// Traducciones centralizadas para todas las páginas del sitio
// Páginas cubiertas: index.html, About_me.html, services.html, contact.html
// ============================================================

const translations = {

  // ==========================================================
  // ESPAÑOL — valores por defecto (lo que ya está en el HTML)
  // ==========================================================
  es: {

    // --- HEADER (todas las páginas) ---
    head_h1: "Abogada Cristina Vera",
    nav_home: "Inicio",
    nav_about: "Sobre mí",
    nav_services: "Servicios",
    nav_contact: "Contacto",
    nav_faq: "Preguntas Frecuentes",

    // --- HERO (index.html) ---
    hero_title: "Tu Asesor Legal de Confianza",
    hero_subtitle: "Experiencia, Honestidad, Compromiso y Soluciones a tus problemas jurídicos.",
    hero_cta: "Solicita una Consulta",

    // --- SECCIÓN ESTADÍSTICAS (index.html) ---
    stat_clients: "Clientes atendidos",
    stat_years: "Años de experiencia",
    stat_success: "Casos resueltos exitosamente",
    stat_areas: "Áreas de práctica legal",

    // --- SECCIÓN ABOUT (index.html) ---
    about_title: "Abogada Cristina Vera",
    about_text1: "Con más de 10 años de experiencia legal, Cristina Vera se ha consolidado como una asesora y defensora de confianza para cientos de personas y pequeñas empresas en Milagro y en todo Ecuador. Su experiencia abarca una amplia gama de áreas legales, incluyendo derecho civil, derecho corporativo, derecho de familia, planificación patrimonial y actos notariales como contratos, poderes notariales y transacciones inmobiliarias.",
    // ⚠️ PROBLEMA A: estas claves usan innerHTML porque contienen links <a>
    about_text1_1: "Conoce más sobre <a href='About_me.html'>Cristina Vera</a>",
    about_text2: "Cristina está profundamente comprometida con brindar soluciones legales personalizadas, adaptadas a las necesidades únicas de cada cliente. Es reconocida por su enfoque minucioso, comunicación clara y dedicación inquebrantable para lograr los mejores resultados posibles.",
    about_text2_1: "Conoce más sobre los <a href='services.html'>Servicios legales</a>",
    about_text3: "Su pasión por la justicia y la defensa del cliente impulsa su continuo desarrollo profesional y su compromiso de mantenerse al día con los cambios en la legislación ecuatoriana.",
    about_text3_1: "Agenda una consulta legal hoy",

    // --- PÁGINA ABOUT ME (About_me.html) ---
    // ⚠️ PROBLEMA B: renombrada para no chocar con about_title de index.html
    // Cambia data-i18n="about_title" por data-i18n="about_page_title" en About_me.html
    about_page_title: "Conoce a tu abogada",
    about_me_text1: "Cristina Vera no es solo una abogada con experiencia, sino también una persona profundamente comprometida con el servicio, la integridad y la empatía. Originaria de Milagro, Ecuador, Cristina creció con un fuerte sentido de comunidad y una pasión por la justicia. Sus valores personales —honestidad, compasión y resiliencia— guían sus interacciones diarias con clientes, colegas y con la comunidad en general. Es conocida por su capacidad de escuchar con atención, comunicarse con claridad y generar confianza con quienes buscan su asesoría. Fuera del ámbito legal, Cristina participa activamente en iniciativas locales que apoyan a mujeres y familias, reflejando su dedicación a proteger y fortalecer a los más vulnerables.",
    about_me_text2: "Con más de una década de experiencia legal, Cristina Vera ha construido una práctica jurídica reconocida por brindar soluciones legales estratégicas y personalizadas. Se especializa en derecho civil, derecho de familia, planificación patrimonial, actos notariales y derecho de tránsito, todo dentro del marco de la legislación ecuatoriana. Sus servicios incluyen casos complejos de divorcio, custodia y pensión alimenticia, redacción y revisión de contratos, asesoramiento en herencias y transferencias de propiedades, así como representación en casos de tránsito y violencia intrafamiliar.",
    about_me_text2_1: "Conoce más sobre los <a href='services.html'>Servicios legales</a>",
    about_me_text3: "Lo que distingue a Cristina Vera es su combinación única de conocimiento legal y comprensión humana. No ve a sus clientes como simples expedientes, sino como personas enfrentando desafíos reales. Cristina se toma el tiempo para explicar cada paso del proceso legal en términos claros y accesibles, asegurando que sus clientes puedan tomar decisiones informadas. Su sitio web bilingüe y las opciones para subir documentos en línea facilitan el contacto desde cualquier parte de Ecuador.",
    about_me_text3_1: "¡Agenda una consulta legal hoy!",

    // --- SECCIÓN SERVICIOS (index.html — versión corta) ---
    services_title: "Servicios",
    services_title1: "Entre los servicios legales que ofrece Cristina Vera se incluyen:",
    service_1: "Familia",
    service_1_1: "El derecho de familia en Ecuador abarca temas como divorcio, custodia, pensión alimenticia, régimen de visitas y protección de menores.",
    service_2: "Mujer",
    service_2_1: "Asesoría y representación en casos de violencia de género, derechos laborales y protección legal para mujeres.",
    service_3: "Niñez y Adolescencia",
    service_3_1: "Casos legales que involucran a menores: custodia, patria potestad, pensión alimenticia, visitas y tutela.",
    service_4: "Actos notariales",
    service_4_1: "Documentos legales validados ante notario: contratos, escrituras, poderes, autorizaciones y declaraciones juramentadas.",
    service_5: "Violencia intrafamiliar",
    service_5_1: "Asesoría en casos de abuso físico, psicológico, sexual o económico regulados por la ley ecuatoriana.",
    service_6: "Tránsito",
    service_6_1: "Infracciones, accidentes, multas, suspensión de licencias y trámites ante la ANT.",

    // --- PÁGINA SERVICIOS (services.html — versión extendida) ---
    service_1_2: "Cristina guía a sus clientes en estos procesos emocionales con atención personalizada y precisión legal, preparando documentos, representando en audiencias o mediando acuerdos.",
    service_1_3: "Los conflictos familiares son delicados y tienen consecuencias a largo plazo. La experiencia de Cristina garantiza que las decisiones legales protejan tus derechos y el bienestar de tu familia.",
    service_2_2: "Ofrece intervención legal rápida: medidas de protección, procesos de separación, custodia de hijos y acompañamiento jurídico con enfoque humano.",
    service_2_3: "Cristina comprende la urgencia y el peso emocional de estos casos. Brinda defensa firme, trato empático y acción legal inmediata para protegerte.",
    service_3_2: "Cristina asegura que el interés superior del niño sea respetado, ya sea gestionando custodias, redactando acuerdos de alimentos o solicitando medidas judiciales de protección.",
    service_3_3: "Los casos con menores requieren protocolos estrictos y sensibilidad. Cristina ofrece representación legal sólida, con enfoque en la niñez y respeto por la ley ecuatoriana.",
    service_4_2: "Ella redacta y revisa tus documentos para asegurar que sean claros, legales y protejan tus intereses antes de ser firmados ante un notario.",
    service_4_3: "Un documento mal redactado puede traer grandes problemas. Cristina garantiza estructura legal correcta y evita errores que puedan afectar tu seguridad jurídica.",
    service_5_2: "Cristina Vera brinda apoyo legal inmediato a víctimas, solicitando medidas de protección, presentando denuncias formales y guiando a las personas en los procesos ante la policía y la justicia.",
    service_5_3: "Los casos de violencia intrafamiliar son delicados y requieren acción legal firme, rápida y con sensibilidad. Cristina combina su conocimiento jurídico con comprensión humana, protegiendo tu seguridad, tus derechos y ayudándote a recuperar el control de tu vida.",
    service_6_2: "Cristina defiende tus derechos, apela sanciones injustas, gestiona documentación y te representa en audiencias o negociaciones tras incidentes de tránsito.",
    service_6_3: "Los problemas de tránsito pueden generar antecedentes, pérdida de licencia o multas innecesarias. Cristina asegura que se respeten tus derechos y el debido proceso.",

    // --- TESTIMONIOS (index.html) ---
    testimonials_title: "Lo que dicen nuestros clientes",

    // --- FAQ (index.html) ---
    faq_title: "Preguntas Frecuentes",
    faq_q1: "¿Cuánto cuesta una consulta inicial?",
    faq_a1: "La consulta inicial puede variar según el tipo de caso, pero muchas veces ofrecemos una primera evaluación gratuita.",
    faq_q2: "¿Qué documentos debo llevar a mi cita?",
    faq_a2: "Documentación básica como cédula de identidad, contratos, escrituras, etc., según el caso.",
    faq_q3: "¿Es necesario agendar una cita en línea?",
    faq_a3: "Sí, la cita en línea es necesaria para reservar el tiempo. Sin agendar previamente, deberá esperar disponibilidad.",

    // --- CONTACTO (contact.html) ---
    contact_title: "Contáctanos",
    label_name: "Nombre completo:",
    label_cedula: "Número de cédula/ID:",
    label_email: "Correo electrónico:",
    label_phone: "Número de teléfono:",
    label_motivo: "Motivo de consulta:",
    opt_familia: "Asunto de Familia",
    opt_mujer: "Asuntos de Mujer",
    opt_ninez: "Asuntos de Niñez y Adolescencia",
    opt_notariales: "Escrituras, Contratos, Poderes, etc.",
    opt_intrafamiliar: "Violencia en la Familia",
    opt_transito: "Tránsito",
    opt_otro: "Otro",
    label_specify: "Especifique:",
    btn_submit: "Enviar Consulta",
    contact_phone: "Teléfono: +593992347656",
    contact_location: "Ubicación: Ecuador",
    calendly_btn: "Agendar vía Calendly",

    // --- FOOTER (todas las páginas) ---
    footer_rights: "Todos los derechos reservados.",

    about_eyebrow:         "La abogada",
    about_block1_title:    "Persona y valores",
    about_block2_title:    "Trayectoria profesional",
    about_block3_title:    "¿Por qué elegir a Cristina?",
    photo_badge_title:     "Abogada certificada",
    photo_badge_sub:       "Milagro, Ecuador",
    about_see_services:    "Ver servicios",
  
    services_eyebrow:      "Áreas de práctica",
    services_intro:        "Ofrecemos representación legal especializada en las siguientes áreas, siempre dentro del marco de la legislación ecuatoriana.",
    services_cta_text:     "¿No encuentras tu caso aquí? Contáctanos — atendemos cualquier consulta legal.",
    service_link:          "Ver más →",
  
    sfc_tag_civil:         "Derecho Civil",
    sfc_tag_protection:    "Protección legal",
    sfc_tag_minors:        "Menores",
    sfc_tag_notarial:      "Notarial",
    sfc_tag_urgent:        "Atención urgente",
    sfc_tag_transit:       "ANT · Ecuador",

    label_city:          "Ciudad de residencia:",
    error_city:          "Por favor ingresa tu ciudad de residencia.",
    privacy_label:       "He leído y acepto el aviso de privacidad.",
    privacy_title:       "Aviso de Privacidad",
    privacy_p1:          "Los datos que proporciona serán tratados de manera confidencial.",
    privacy_p2:          "Finalidad: responder su consulta, coordinar citas y mejorar el servicio.",
    privacy_p3:          "Sus datos NO serán vendidos ni compartidos con terceros bajo ninguna circunstancia.",
    privacy_p4:          "Sus datos se conservarán solo durante el tiempo necesario para gestionar su caso.",
    privacy_p5:          "Para ejercer sus derechos escriba a: cristina.vera.abogada@gmail.com",
    privacy_close:       "Entendido",
    success_title:       "¡Consulta enviada correctamente!",
    success_text:        "La Abogada Cristina Vera revisará tu caso y se pondrá en contacto pronto.",
    success_calendly_text: "Mientras tanto, puedes agendar tu cita directamente:",
  },


  // ==========================================================
  // ENGLISH
  // ==========================================================
  en: {

    // --- HEADER ---
    head_h1: "Attorney Cristina Vera",
    nav_home: "Home",
    nav_about: "About Me",
    nav_services: "Services",
    nav_contact: "Contact",
    nav_faq: "FAQ",

    // --- HERO ---
    hero_title: "Your Trusted Legal Advisor",
    hero_subtitle: "Experience, Honesty, Commitment and Solutions to your legal problems.",
    hero_cta: "Request a Consultation",

    // --- STATISTICS SECTION (index.html) ---
    stat_clients: "Clients Served",
    stat_years: "Years of Experience",
    stat_success: "Cases Successfully Resolved",
    stat_areas: "Legal Practice Areas",

    // --- ABOUT (index.html) ---
    about_title: "Attorney Cristina Vera",
    about_text1: "With over 10 years of legal experience, Cristina Vera has established herself as a trusted advisor and advocate for hundreds of individuals and small businesses in Milagro and across Ecuador. Her expertise spans a wide range of legal areas, including civil law, corporate law, family law, estate planning, and notarial acts such as contracts, powers of attorney, and real estate transactions.",
    about_text1_1: "Learn more about <a href='About_me.html'>Cristina Vera</a>",
    about_text2: "Cristina is deeply committed to providing personalized legal solutions tailored to each client's unique needs. She is recognized for her meticulous approach, clear communication, and unwavering dedication to achieving the best possible outcomes.",
    about_text2_1: "Learn more about <a href='services.html'>Legal Services</a>",
    about_text3: "Her passion for justice and client advocacy drives her continuous professional development and her commitment to staying current with changes in Ecuadorian legislation.",
    about_text3_1: "Schedule a legal consultation today",

    // --- ABOUT ME PAGE ---
    about_page_title: "Meet Your Attorney",
    about_me_text1: "Cristina Vera is not only a seasoned attorney but also a person deeply committed to service, integrity, and empathy. Originally from Milagro, Ecuador, Cristina grew up with a strong sense of community and a passion for justice. Her personal values — honesty, compassion, and resilience — guide her daily interactions with clients, colleagues, and the broader community. She is known for her ability to listen attentively, communicate clearly, and build trust with those who seek her counsel. Outside of her legal practice, Cristina is actively involved in local initiatives that support women and families, reflecting her dedication to protecting and empowering the most vulnerable.",
    about_me_text2: "With over a decade of legal experience, Cristina Vera has built a reputable law practice focused on delivering strategic and personalized legal solutions. She specializes in civil law, family law, estate planning, notarial services, and traffic law, all within the framework of Ecuadorian legislation. Her services include complex divorce, custody and child support cases, contract drafting and review, assistance with inheritance and property transfers, and representation in traffic and domestic violence cases.",
    about_me_text2_1: "Learn more about <a href='services.html'>Legal Services</a>",
    about_me_text3: "What sets Cristina Vera apart is her rare combination of legal expertise and human understanding. She does not see clients as case numbers but as individuals facing real-life challenges. Cristina takes the time to explain each step of the legal process in clear, accessible terms, ensuring clients are empowered to make informed decisions. Her bilingual website makes it easy for people across Ecuador and internationally to reach her, regardless of location.",
    about_me_text3_1: "Schedule a legal consultation today!",

    // --- SERVICES (index.html — short version) ---
    services_title: "Services",
    services_title1: "Legal services offered by Cristina Vera include:",
    service_1: "Family",
    service_1_1: "Family law in Ecuador covers matters such as divorce, custody, child support, visitation rights, and protection of minors.",
    service_2: "Women",
    service_2_1: "Legal advice and representation in gender violence cases, labor rights, and legal protection for women.",
    service_3: "Childhood and Adolescence",
    service_3_1: "Legal cases involving minors: custody, parental rights, child support, visitation, and guardianship.",
    service_4: "Notarial Acts",
    service_4_1: "Legally notarized documents: contracts, deeds, powers of attorney, authorizations, and sworn statements.",
    service_5: "Domestic Violence",
    service_5_1: "Legal advice in cases of physical, psychological, sexual, or economic abuse regulated under Ecuadorian law.",
    service_6: "Traffic Law",
    service_6_1: "Traffic violations, accidents, fines, license suspensions, and administrative procedures before the ANT.",

    // --- SERVICES PAGE (extended version) ---
    service_1_2: "Cristina guides clients through these emotionally charged cases with personalized care and legal precision — preparing documents, representing them in hearings, or mediating agreements.",
    service_1_3: "Family conflicts are sensitive and have long-term consequences. Cristina's experience ensures that legal decisions protect your rights and your family's well-being.",
    service_2_2: "She provides rapid legal intervention: protection orders, separation processes, child custody arrangements, and legal support with a human-centered approach.",
    service_2_3: "Cristina understands the urgency and emotional weight of these cases. She offers firm advocacy, empathetic treatment, and swift legal action to protect you.",
    service_3_2: "Cristina ensures the best interests of the child are always prioritized, whether managing custody arrangements, drafting support agreements, or seeking protective court orders.",
    service_3_3: "Cases involving minors require strict protocols and sensitivity. Cristina provides strong legal representation with a child-focused approach and respect for Ecuadorian juvenile law.",
    service_4_2: "She drafts and reviews your documents to ensure they are clear, lawful, and protect your interests before being signed before a notary.",
    service_4_3: "A poorly drafted document can cause serious problems. Cristina ensures correct legal structure and avoids mistakes that could compromise your legal security.",
    service_5_2: "Cristina Vera provides immediate legal support to victims — requesting protection orders, filing formal complaints, and guiding individuals through the process with the police and the justice system.",
    service_5_3: "Domestic violence cases are highly sensitive and require firm, fast, and compassionate legal action. Cristina combines her legal expertise with human understanding, protecting your safety, your rights, and helping you regain control of your life.",
    service_6_2: "Cristina defends your rights, appeals unjust sanctions, manages documentation, and represents you in hearings or negotiations following traffic incidents.",
    service_6_3: "Traffic issues can result in criminal records, license loss, or unnecessary fines. Cristina ensures your rights and due process are fully respected.",

    // --- TESTIMONIALS ---
    testimonials_title: "What Our Clients Say",

    // --- FAQ ---
    faq_title: "Frequently Asked Questions",
    faq_q1: "How much does an initial consultation cost?",
    faq_a1: "The initial consultation may vary depending on the type of case. We often offer a free first evaluation.",
    faq_q2: "What documents should I bring to my appointment?",
    faq_a2: "Basic documentation such as a national ID, contracts, deeds, etc., depending on your case.",
    faq_q3: "Do I need to schedule an appointment online?",
    faq_a3: "Yes, scheduling online is required to reserve your time slot. Without a prior appointment, you will need to wait for availability.",

    // --- CONTACT ---
    contact_title: "Contact Us",
    label_name: "Full Name:",
    label_cedula: "ID Number:",
    label_email: "Email Address:",
    label_phone: "Phone Number:",
    label_motivo: "Reason for Inquiry:",
    opt_familia: "Family",
    opt_mujer: "Women's Affairs",
    opt_ninez: "Childhood and Adolescence",
    opt_notariales: "Notarial Matters",
    opt_intrafamiliar: "Domestic Violence",
    opt_transito: "Traffic",
    opt_otro: "Other",
    label_specify: "Please specify:",
    btn_submit: "Submit Inquiry",
    contact_phone: "Phone: +593992347656",
    contact_location: "Location: Ecuador",
    calendly_btn: "Schedule via Calendly",

    // --- FOOTER ---
    footer_rights: "All rights reserved.",

    about_eyebrow:         "The attorney",
    about_block1_title:    "Person and values",
    about_block2_title:    "Professional background",
    about_block3_title:    "Why choose Cristina?",
    photo_badge_title:     "Certified attorney",
    photo_badge_sub:       "Milagro, Ecuador",
    about_see_services:    "View services",
  
    services_eyebrow:      "Practice areas",
    services_intro:        "We provide specialized legal representation in the following areas, always within the framework of Ecuadorian legislation.",
    services_cta_text:     "Can't find your case here? Contact us — we handle any legal inquiry.",
    service_link:          "Learn more →",
  
    sfc_tag_civil:         "Civil Law",
    sfc_tag_protection:    "Legal protection",
    sfc_tag_minors:        "Minors",
    sfc_tag_notarial:      "Notarial",
    sfc_tag_urgent:        "Urgent attention",
    sfc_tag_transit:       "ANT · Ecuador",

    label_city:          "City of residence:",
    error_city:          "Please enter your city of residence.",
    privacy_label:       "I have read and accept the privacy notice.",
    privacy_title:       "Privacy Notice",
    privacy_p1:          "The data you provide will be treated confidentially.",
    privacy_p2:          "Purpose: to respond to your inquiry, coordinate appointments and improve our service.",
    privacy_p3:          "Your data will NOT be sold or shared with third parties under any circumstances.",
    privacy_p4:          "Your data will be retained only for as long as necessary to handle your case.",
    privacy_p5:          "To exercise your rights write to: cristina.vera.abogada@gmail.com",
    privacy_close:       "Understood",
    success_title:       "Inquiry sent successfully!",
    success_text:        "Attorney Cristina Vera will review your case and get in touch soon.",
    success_calendly_text: "In the meantime, you can schedule your appointment directly:",

  }
};

