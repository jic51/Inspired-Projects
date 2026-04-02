// ============================================================
// JS/blog-posts.js
// Base de datos de artículos del blog
// Para agregar un artículo, usa el panel de administración:
// admin/index.html
// ============================================================

const blogPosts = [
  {
    id: "divorcio-ecuador-2026",
    title: "¿Cómo funciona el divorcio en Ecuador? Todo lo que necesitas saber",
    title_en: "How Does Divorce Work in Ecuador? Everything You Need to Know",
    excerpt: "El proceso de divorcio en Ecuador puede ser de mutuo acuerdo o contencioso. Te explicamos los pasos, documentos y tiempos reales.",
    excerpt_en: "Divorce in Ecuador can be by mutual agreement or contested. We explain the steps, documents and realistic timelines.",
    category: "familia",
    date: "29 de marzo de 2026",
    author: "Abogada Cristina Vera",
    content: `
      <p>El divorcio es uno de los procesos legales más frecuentes en Ecuador y, aunque puede parecer abrumador, entender sus etapas te ayuda a tomar decisiones informadas desde el principio.</p>

      <h2>Tipos de divorcio en Ecuador</h2>
      <p>En Ecuador existen dos modalidades principales:</p>
      <ul>
        <li><strong>Divorcio de mutuo acuerdo:</strong> Ambas partes están de acuerdo en separarse y en los términos. Es más rápido, económico y menos conflictivo. Se puede tramitar notarialmente si no hay hijos menores de edad.</li>
        <li><strong>Divorcio contencioso:</strong> Una de las partes no está de acuerdo o no se pueden llegar a acuerdos sobre custodia, bienes o pensiones. Requiere un proceso judicial.</li>
      </ul>

      <h2>Causales de divorcio en el Ecuador</h2>
      <p>El Código Civil ecuatoriano establece causales específicas para el divorcio contencioso, entre ellas: adulterio, sevicia, injurias graves, abandono voluntario, separación de hecho por más de 3 años, y otras. El divorcio de mutuo acuerdo no requiere invocar una causal específica.</p>

      <h2>¿Qué pasa con los hijos?</h2>
      <p>Cuando hay hijos menores de edad, el proceso siempre involucra decisiones sobre:</p>
      <ul>
        <li>Custodia (con quién viven los hijos)</li>
        <li>Régimen de visitas para el progenitor no custodio</li>
        <li>Pensión alimenticia (monto y forma de pago)</li>
        <li>Patria potestad (quién toma decisiones sobre su educación, salud, etc.)</li>
      </ul>

      <h2>Documentos necesarios</h2>
      <p>Generalmente se requiere: cédulas de identidad de ambos cónyuges, partida de matrimonio, partidas de nacimiento de los hijos (si los hay), inventario de bienes si hay sociedad conyugal, y según el caso, otros documentos específicos.</p>

      <h2>¿Cuánto tiempo toma?</h2>
      <p>Un divorcio de mutuo acuerdo sin hijos puede resolverse en semanas. Con hijos o de manera contenciosa, el proceso puede durar entre 3 meses y más de un año, dependiendo de la complejidad del caso y la carga del juzgado.</p>

      <blockquote>
        "Cada caso de divorcio es único. Lo más importante es proteger el bienestar de los hijos y tomar decisiones que todos puedan cumplir a largo plazo."
        <cite>— Abogada Cristina Vera</cite>
      </blockquote>
    `,
    content_en: `
      <p>Divorce is one of the most common legal processes in Ecuador. Understanding its stages helps you make informed decisions from the start.</p>

      <h2>Types of divorce in Ecuador</h2>
      <p>There are two main types:</p>
      <ul>
        <li><strong>Mutual agreement divorce:</strong> Both parties agree to separate and on the terms. Faster, cheaper and less conflictual. Can be processed notarially if there are no minor children.</li>
        <li><strong>Contested divorce:</strong> One party disagrees or terms cannot be settled. Requires a judicial process.</li>
      </ul>

      <h2>What about children?</h2>
      <p>When minor children are involved, decisions must be made about custody, visitation, child support, and parental rights.</p>

      <blockquote>
        "Each divorce case is unique. The most important thing is to protect the well-being of the children."
        <cite>— Attorney Cristina Vera</cite>
      </blockquote>
    `
  },
  {
    id: "poder-notarial-ecuador",
    title: "¿Qué es un poder notarial y cuándo necesitas uno en Ecuador?",
    title_en: "What Is a Power of Attorney and When Do You Need One in Ecuador?",
    excerpt: "Un poder notarial te permite que otra persona actúe en tu nombre legalmente. Conoce sus tipos, usos y cómo obtenerlo en Ecuador.",
    excerpt_en: "A power of attorney allows someone to act on your behalf legally. Learn about its types, uses and how to obtain one in Ecuador.",
    category: "notarial",
    date: "20 de marzo de 2026",
    author: "Abogada Cristina Vera",
    content: `
      <p>El poder notarial es uno de los documentos legales más utilizados en Ecuador, especialmente por personas que viven en el extranjero y necesitan realizar trámites en el país.</p>

      <h2>¿Qué es exactamente?</h2>
      <p>Es un documento legal mediante el cual una persona (el poderdante) autoriza a otra (el apoderado) para que actúe en su nombre en actos jurídicos específicos. Debe ser otorgado ante un notario para tener validez legal.</p>

      <h2>Tipos de poder notarial</h2>
      <ul>
        <li><strong>Poder general:</strong> Amplio, permite al apoderado realizar casi cualquier acto legal en nombre del poderdante.</li>
        <li><strong>Poder especial:</strong> Limitado a actos específicos. Por ejemplo: "para vender el inmueble ubicado en la calle X".</li>
        <li><strong>Poder para pleitos:</strong> Específicamente para que un abogado te represente en procesos judiciales.</li>
      </ul>

      <h2>Casos comunes en Ecuador</h2>
      <ul>
        <li>Ecuatorianos en el exterior que necesitan vender propiedades</li>
        <li>Cobrar herencias o realizar trámites bancarios</li>
        <li>Representación en procesos judiciales</li>
        <li>Trámites vehiculares o migratorios</li>
        <li>Gestiones ante instituciones públicas</li>
      </ul>

      <h2>¿Cómo se obtiene desde el extranjero?</h2>
      <p>Si estás fuera de Ecuador, puedes otorgar un poder notarial ante un notario del país donde te encuentras. Luego debe ser apostillado (si el país firmó el Convenio de La Haya) o legalizado ante el consulado ecuatoriano más cercano. Finalmente se traduce si está en otro idioma y se registra en Ecuador.</p>
    `,
    content_en: `
      <p>The power of attorney is one of the most used legal documents in Ecuador, especially for people living abroad who need to handle matters in the country.</p>

      <h2>What exactly is it?</h2>
      <p>It is a legal document by which one person (the grantor) authorizes another (the agent) to act on their behalf in specific legal matters. It must be granted before a notary to be legally valid.</p>

      <h2>Types of power of attorney</h2>
      <ul>
        <li><strong>General power:</strong> Broad, allows the agent to perform almost any legal act.</li>
        <li><strong>Special power:</strong> Limited to specific acts, like selling a specific property.</li>
        <li><strong>Power for litigation:</strong> Specifically for legal representation in court.</li>
      </ul>
    `
  }
];
