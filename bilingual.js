(function () {
  const STORAGE_KEY = "gc-language";
  const dictionary = {
    "Home": "Inicio",
    "Shop": "Tienda",
    "Portraits": "Retratos",
    "Experiences": "Experiencias",
    "Cultural agenda": "Agenda cultural",
    "Visit": "Visita",
    "Contact": "Contacto",
    "Available artwork": "Obra disponible",
    "Worldwide shipping": "Envíos a todo el mundo",
    "Artists & work": "Artistas y obra",
    "Explore portfolio →": "Explorar portafolio →",
    "Visit Instagram →": "Visitar Instagram →",
    "COMMISSIONED WORK": "OBRA POR ENCARGO",
    "Portrait Commissions": "Retratos por encargo",
    "by Indhira pintora": "por Indhira pintora",
    "Explore more →": "Explorar más →",
    "Request a Portrait": "Solicitar un retrato",
    "Create inside a working gallery": "Crea dentro de una galería en activo",
    "Ask by WhatsApp": "Preguntar por WhatsApp",
    "Book on Airbnb": "Reservar en Airbnb",
    "Visit us": "Visítanos",
    "Get Directions": "Cómo llegar",
    "Subscribe to our newsletter": "Suscríbete a nuestro boletín",
    "Collect something original.": "Colecciona algo original.",
    "Artists & collections": "Artistas y colecciones",
    "View catalogue →": "Ver catálogo →",
    "Commission a portrait →": "Encargar un retrato →",
    "Preview project →": "Ver proyecto →",
    "Coming soon": "Próximamente",
    "Prefer a private edit?": "¿Prefieres una selección privada?",
    "Request private edit": "Solicitar selección privada",
    "Choose how to connect": "Elige cómo conectar",
    "Printable collection": "Colección imprimible",
    "Open Jacarandas shop": "Abrir tienda Jacarandas",
    "Private commission": "Encargo privado",
    "Oil portrait": "Retrato al óleo",
    "View portrait commissions": "Ver retratos por encargo",
    "Portrait commissions": "Retratos por encargo",
    "Request your portrait": "Solicita tu retrato",
    "The process": "El proceso",
    "Selected works": "Obras seleccionadas",
    "Frequently asked questions": "Preguntas frecuentes",
    "Start your commission": "Inicia tu encargo",
    "Contact the artist": "Contactar a la artista",
    "Jacarandas digital shop": "Tienda digital Jacarandas",
    "Complete collection": "Colección completa",
    "Printable artwork": "Obra imprimible",
    "Purchase / Comprar": "Comprar / Purchase",
    "Secure payment": "Pago seguro",
    "Immediate delivery": "Entrega inmediata",
    "Personal use": "Uso personal",
    "About the experience": "Sobre la experiencia",
    "Reserve your experience": "Reserva tu experiencia",
    "Gallery or studio": "Galería o estudio",
    "Cultural agenda in San Miguel de Allende": "Agenda cultural en San Miguel de Allende",
    "Plan your visit": "Planea tu visita",
    "Opening hours": "Horario",
    "Location": "Ubicación",
    "Send us a message": "Envíanos un mensaje",
    "Listen to our story": "Escucha nuestra historia",
    "English": "Inglés",
    "Spanish": "Español",
    "Back to top": "Volver arriba"
  };

  const originals = new WeakMap();

  function translateTextNode(node, language) {
    if (!originals.has(node)) originals.set(node, node.nodeValue);
    const original = originals.get(node);
    if (language === "en") {
      node.nodeValue = original;
      return;
    }
    const trimmed = original.trim().replace(/\s+/g, " ");
    const translated = dictionary[trimmed];
    if (!translated) return;
    const leading = original.match(/^\s*/)[0];
    const trailing = original.match(/\s*$/)[0];
    node.nodeValue = leading + translated + trailing;
  }

  function applyLanguage(language) {
    document.documentElement.lang = language;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || /^(SCRIPT|STYLE|NOSCRIPT)$/.test(parent.tagName)) return NodeFilter.FILTER_REJECT;
        return node.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => translateTextNode(node, language));
    document.querySelectorAll(".gc-language-button").forEach(button => {
      const active = button.dataset.language === language;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    try { localStorage.setItem(STORAGE_KEY, language); } catch (error) {}
  }

  function buildSelector() {
    if (document.querySelector(".gc-language-switch")) return;
    const host = document.querySelector("header") || document.body;
    const selector = document.createElement("div");
    selector.className = "gc-language-switch";
    selector.setAttribute("aria-label", "Idioma / Language");
    selector.innerHTML = '<button type="button" class="gc-language-button" data-language="es">ES</button><span aria-hidden="true">/</span><button type="button" class="gc-language-button" data-language="en">EN</button>';
    host.appendChild(selector);
    selector.querySelectorAll("button").forEach(button => {
      button.addEventListener("click", () => applyLanguage(button.dataset.language));
    });
  }

  const style = document.createElement("style");
  style.textContent = '.gc-language-switch{display:flex;align-items:center;gap:6px;margin-left:auto;font:700 11px/1 Arial,sans-serif;letter-spacing:.12em;color:#666;white-space:nowrap}.gc-language-button{border:0;background:transparent;color:inherit;padding:6px 2px;cursor:pointer;opacity:.45}.gc-language-button.is-active{opacity:1;text-decoration:underline;text-underline-offset:4px}@media(max-width:800px){.gc-language-switch{position:absolute;top:18px;right:20px}}';
  document.head.appendChild(style);

  function start() {
    buildSelector();
    let language = "";
    try { language = localStorage.getItem(STORAGE_KEY) || ""; } catch (error) {}
    if (!language) language = navigator.language.toLowerCase().startsWith("es") ? "es" : "en";
    applyLanguage(language);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
