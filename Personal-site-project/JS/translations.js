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

    // --- BOTÓN WHATSAPP (todas las páginas) ---
    wa_text: "Consultar por WhatsApp",

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
    about_text1: "Con más de 10 años de experiencia legal, Cristina Vera se ha consolidado como una asesora y defensora de confianza para cientos de personas y pequeñas empresas en Milagro y en todo Ecuador. Su experiencia abarca varias ramas del derecho, incluyendo derecho civil, derecho corporativo, derecho de familia, planificación patrimonial y actos notariales como contratos, poderes notariales y todo tipo de escrituras.",
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
    
    about_me_text3: "Lo que distingue a Cristina Vera es su combinación única de conocimiento legal y comprensión humana. No ve a sus clientes como simples expedientes, sino como personas enfrentando desafíos reales. Cristina se toma el tiempo para explicar cada paso del proceso legal en términos claros y accesibles, asegurando que sus clientes puedan tomar decisiones informadas. Su sitio web bilingüe y las opciones para subir documentos en línea facilitan el contacto desde cualquier parte de Ecuador.",
    about_me_text3_1: "¡Agenda una consulta legal hoy!",

    // --- SECCIÓN SERVICIOS (index.html — versión corta) ---
    services_title: "Servicios",
    services_title1: "Entre los servicios legales que ofrece Cristina Vera se incluyen:",
    service_1:   "Familia, Mujer, Niñez y Adolescencia",
    service_1_1: "El derecho de familia en Ecuador regula las relaciones entre sus miembros e incluye temas como divorcio, separación, custodia, pensión alimenticia, régimen de visitas y protección de menores. La niñez y adolescencia forma parte integral de este campo legal.",
    service_1_2: "Cristina representa a sus clientes en procesos de divorcio, acuerdos de custodia, fijación y cobro de pensiones alimenticias, patria potestad, tutela, adopción y medidas de protección para menores en situaciones de vulnerabilidad.",
    service_1_3: "Los conflictos familiares tienen consecuencias emocionales y legales a largo plazo. Cristina garantiza que las decisiones judiciales protejan tanto los derechos de los adultos como el interés superior del niño, aplicando siempre el marco del Código de la Niñez y Adolescencia ecuatoriano.",
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
    service_5_2: "Cristina Vera brinda apoyo legal inmediato a víctimas, solicitando medidas de protección, presentando denuncias formales y guiando a las personas en todo el proceso",
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
    photo_badge_sub:       "Guayas, Ecuador",
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

    error_404_title:    "Esta página no existe",
    error_404_text:     "La página que buscas no fue encontrada. Es posible que haya sido movida o eliminada.",
    error_go_home:      "Ir al inicio",
    error_contact:      "Contactar a Cristina",
    error_helpful_links: "O visita una de estas páginas:",

    why_eyebrow:        "Tu mejor decisión legal",
    why_title:          "¿Por qué elegir a la Abogada Cristina Vera?",
    why_subtitle:       "Miles de personas en Ecuador y en el mundo confían en Cristina para defender sus derechos.",
    why_1_title:        "Confidencialidad total",
    why_1_text:         "Todo lo que compartes es estrictamente confidencial desde el primer contacto.",
    why_2_title:        "Respuesta rápida",
    why_2_text:         "Respondemos en menos de 24 horas y brindamos atención urgente cuando es necesario.",
    why_3_title:        "Atención internacional",
    why_3_text:         "Atendemos clientes dentro y fuera del Ecuador.",
    why_4_title:        "Comunicación clara",
    why_4_text:         "Explicamos cada paso sin tecnicismos. Siempre sabes qué pasa con tu caso.",
    why_5_title:        "Trato humano y empático",
    why_5_text:         "Entendemos que detrás de cada caso hay una persona con una situación real.",
    why_6_title:        "Resultados comprobados",
    why_6_text:         "Más de 500 clientes atendidos con 95% de tasa de éxito.",
    why_cta_secondary:  "Conocer más sobre Cristina",

    faq_q4: "¿Atienden clientes fuera de Ecuador?",
    faq_a4: "Sí. Atendemos clientes dentro y fuera del Ecuador. Todo puede gestionarse de forma remota.",
    faq_q5: "¿Cuánto tiempo toma resolver un caso?",
    faq_a5: "Depende del caso. Trámites notariales: días. Divorcio de mutuo acuerdo: semanas. Casos judiciales: meses. En la consulta inicial te damos un estimado real.",
    faq_q6: "¿Necesito ir en persona o puedo hacer todo en línea?",
    faq_a6: "Muchos trámites pueden iniciarse en línea. Te indicamos exactamente qué necesita presencia física desde la primera consulta.",
    faq_q7: "¿Pueden ayudarme con documentos en inglés?",
    faq_a7: "Sí. Contamos con atención bilingüe español-inglés para clientes extranjeros o ecuatorianos en el exterior.",
    faq_q8: "¿Cómo funciona la primera consulta?",
    faq_a8: "Agendas por WhatsApp, formulario o Calendly. Analizamos tu caso, explicamos opciones y damos un estimado de tiempos y costos. Sin compromisos.",
    faq_q9: "¿Qué pasa si soy extranjero y necesito un abogado en Ecuador?",
    faq_a9: "Atendemos a extranjeros con frecuencia — inversores, residentes y expatriados. Conocemos los procesos para extranjeros en español e inglés.",

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

    // --- whatsapp button (all pages) ---
    wa_text: "Consult via WhatsApp",

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
    about_text1: "With over 10 years of legal experience, Cristina Vera has established herself as a trusted advisor and advocate for hundreds of individuals and small businesses in Milagro and across Ecuador. Her expertise spans a wide range of legal areas, including civil law, corporate law, family law, estate planning, and notarial acts such as contracts, powers of attorney, and all types of deeds.",
    about_text1_1: "Learn more about <a href='About_me.html'>Cristina Vera</a>",
    about_text2: "Cristina is deeply committed to providing personalized legal solutions tailored to each client's unique needs. She is recognized for her meticulous approach, clear communication, and unwavering dedication to achieving the best possible outcomes.",
    about_text2_1: "Learn more about <a href='services.html'>Legal Services</a>",
    about_text3: "Her passion for justice and client advocacy drives her continuous professional development and her commitment to staying current with changes in Ecuadorian legislation.",
    about_text3_1: "Schedule a legal consultation today",

    // --- ABOUT ME PAGE ---
    about_page_title: "Meet Your Attorney",
    about_me_text1: "Cristina Vera is not only a seasoned attorney but also a person deeply committed to service, integrity, and empathy. Originally from Milagro, Ecuador, Cristina grew up with a strong sense of community and a passion for justice. Her personal values — honesty, compassion, and resilience — guide her daily interactions with clients, colleagues, and the broader community. She is known for her ability to listen attentively, communicate clearly, and build trust with those who seek her counsel. Outside of her legal practice, Cristina is actively involved in local initiatives that support women and families, reflecting her dedication to protecting and empowering the most vulnerable.",
    about_me_text2: "With over a decade of legal experience, Cristina Vera has built a reputable law practice focused on delivering strategic and personalized legal solutions. She specializes in civil law, family law, estate planning, notarial services, and traffic law, all within the framework of Ecuadorian legislation. Her services include complex divorce, custody and child support cases, contract drafting and review, assistance with inheritance and property transfers, and representation in traffic and domestic violence cases.",
    
    about_me_text3: "What sets Cristina Vera apart is her rare combination of legal expertise and human understanding. She does not see clients as case numbers but as individuals facing real-life challenges. Cristina takes the time to explain each step of the legal process in clear, accessible terms, ensuring clients are empowered to make informed decisions. Her bilingual website makes it easy for people across Ecuador and internationally to reach her, regardless of location.",
    about_me_text3_1: "Schedule a legal consultation today!",

    // --- SERVICES (index.html — short version) ---
    services_title: "Services",
    services_title1: "Legal services offered by Cristina Vera include:",
    service_1:   "Family, Children and Adolescents",
    service_1_1: "Divorce, custody, child support, parental rights and protection of the best interests of the child.",
    service_1_2: "Cristina represents clients in divorce proceedings, custody agreements, child support, guardianship, adoption and protective measures for minors.",
    service_1_3: "Family conflicts have long-term emotional and legal consequences. Cristina ensures decisions that protect both adults and minors under Ecuador's Code of Children and Adolescents.",
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
    service_5_2: "Cristina Vera provides immediate legal support to victims — requesting protection orders, filing formal complaints, and guiding individuals through all the process.",
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
    photo_badge_sub:       "Guayas, Ecuador",
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
    
    error_404_title:    "This page doesn't exist",
    error_404_text:     "The page you're looking for was not found. It may have been moved or deleted.",
    error_go_home:      "Go to homepage",
    error_contact:      "Contact Cristina",
    error_helpful_links: "Or visit one of these pages:",

    why_eyebrow:        "Your best legal decision",
    why_title:          "Why choose Attorney Cristina Vera?",
    why_subtitle:       "Thousands of people in Ecuador and worldwide trust Cristina to defend their rights.",
    why_1_title:        "Full confidentiality",
    why_1_text:         "Everything you share is strictly confidential from the very first contact.",
    why_2_title:        "Fast response",
    why_2_text:         "We respond within 24 hours and provide urgent attention when needed.",
    why_3_title:        "International service",
    why_3_text:         "We serve clients within and outside of Ecuador.",
    why_4_title:        "Clear communication",
    why_4_text:         "We explain every step without jargon. You always know what's happening.",
    why_5_title:        "Human and empathetic treatment",
    why_5_text:         "We understand that behind every case is a real person facing a real challenge.",
    why_6_title:        "Proven results",
    why_6_text:         "Over 500 clients served with a 95% success rate.",
    why_cta_secondary:  "Learn more about Cristina",

    faq_q4: "Do you serve clients outside Ecuador?",
    faq_a4: "Yes. We serve clients within and outside of Ecuador. Everything can be handled remotely.",
    faq_q5: "How long does it take to resolve a case?",
    faq_a5: "It depends on the case. Notarial procedures: days. Mutual divorce: weeks. Court cases: months. We give you a realistic estimate at the first consultation.",
    faq_q6: "Do I need to come in person or can everything be done online?",
    faq_a6: "Many procedures can be started online. We'll tell you exactly what requires physical presence from the first consultation.",
    faq_q7: "Can you help me with documents in English?",
    faq_a7: "Yes. We offer bilingual Spanish-English service for foreign clients or Ecuadorians living abroad.",
    faq_q8: "How does the first consultation work?",
    faq_a8: "Schedule via WhatsApp, form or Calendly. We analyze your case, explain options and give a time and cost estimate. No commitment.",
    faq_q9: "What if I'm a foreigner and need a lawyer in Ecuador?",
    faq_a9: "We frequently work with foreigners — investors, residents and expats. We know the processes for foreigners in Spanish and English.",
  }
};

