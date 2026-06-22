export type CategoryType = "service_provider" | "material_store";

export type SeedCategory = {
  name: string;
  slug: string;
  type: CategoryType;
  description: string;
};

export type SeedLocation = {
  name: string;
  slug: string;
};

export type SeedPlan = {
  name: string;
  slug: string;
  price: number;
  summary: string;
  features: string[];
  highlighted?: boolean;
};

export const serviceCategories: SeedCategory[] = [
  {
    name: "Aire acondicionado",
    slug: "aire-acondicionado",
    type: "service_provider",
    description: "Instalación, mantenimiento, limpieza y reparación de minisplits.",
  },
  {
    name: "Plomería",
    slug: "plomeria",
    type: "service_provider",
    description: "Fugas, bombas, tinacos, baños, cocinas y emergencias hidráulicas.",
  },
  {
    name: "Electricidad",
    slug: "electricidad",
    type: "service_provider",
    description: "Instalaciones, centros de carga, apagadores, iluminación y revisiones.",
  },
  {
    name: "Limpieza del hogar",
    slug: "limpieza-del-hogar",
    type: "service_provider",
    description: "Limpiezas profundas, recurrentes, post obra y preparación de estancias.",
  },
  {
    name: "Fumigación",
    slug: "fumigacion",
    type: "service_provider",
    description: "Control de plagas para casas, departamentos, oficinas y rentas vacacionales.",
  },
  {
    name: "Jardinería",
    slug: "jardineria",
    type: "service_provider",
    description: "Poda, mantenimiento, riego, plantas y recuperación de áreas verdes.",
  },
  {
    name: "Pintura",
    slug: "pintura",
    type: "service_provider",
    description: "Pintura interior, exterior, impermeabilización y acabados.",
  },
  {
    name: "Albañilería",
    slug: "albanileria",
    type: "service_provider",
    description: "Reparaciones, remodelaciones, pisos, muros y trabajos de obra.",
  },
  {
    name: "Cerrajería",
    slug: "cerrajeria",
    type: "service_provider",
    description: "Aperturas, cambios de chapa, duplicados y atención urgente.",
  },
  {
    name: "Carpintería",
    slug: "carpinteria",
    type: "service_provider",
    description: "Muebles a medida, puertas, closets, cocinas y reparaciones.",
  },
  {
    name: "Mudanzas",
    slug: "mudanzas",
    type: "service_provider",
    description: "Traslados locales, carga, descarga y apoyo para cambios de casa.",
  },
  {
    name: "Mantenimiento general",
    slug: "mantenimiento-general",
    type: "service_provider",
    description: "Soluciones prácticas para pendientes pequeños y mantenimiento preventivo.",
  },
  {
    name: "Mantenimiento Airbnb",
    slug: "mantenimiento-airbnb",
    type: "service_provider",
    description: "Atención para anfitriones, checklists, reparaciones y respuesta rápida.",
  },
  {
    name: "Albercas",
    slug: "albercas",
    type: "service_provider",
    description: "Limpieza, químicos, bombas, filtros y mantenimiento regular.",
  },
  {
    name: "Cámaras de seguridad",
    slug: "camaras-de-seguridad",
    type: "service_provider",
    description: "Instalación, configuración y mantenimiento de CCTV y monitoreo.",
  },
];

export const materialCategories: SeedCategory[] = [
  {
    name: "Ferreterías",
    slug: "ferreterias",
    type: "material_store",
    description: "Herramientas, tornillería, consumibles y básicos para reparaciones.",
  },
  {
    name: "Material eléctrico",
    slug: "material-electrico",
    type: "material_store",
    description: "Cables, centros de carga, contactos, iluminación y accesorios.",
  },
  {
    name: "Material de plomería",
    slug: "material-de-plomeria",
    type: "material_store",
    description: "Tubos, conexiones, bombas, válvulas, tinacos y refacciones.",
  },
  {
    name: "Pinturas e impermeabilizantes",
    slug: "pinturas-e-impermeabilizantes",
    type: "material_store",
    description: "Pinturas, selladores, impermeabilizantes, brochas y rodillos.",
  },
  {
    name: "Herramientas",
    slug: "herramientas",
    type: "material_store",
    description: "Herramienta manual, eléctrica, consumibles y equipo de trabajo.",
  },
  {
    name: "Refacciones para electrodomésticos",
    slug: "refacciones-para-electrodomesticos",
    type: "material_store",
    description: "Partes para lavadoras, refrigeradores, estufas y equipos del hogar.",
  },
  {
    name: "Aire acondicionado y refacciones",
    slug: "aire-acondicionado-y-refacciones",
    type: "material_store",
    description: "Minisplits, gases, tarjetas, controles, tubería y accesorios.",
  },
  {
    name: "Materiales de construcción",
    slug: "materiales-de-construccion",
    type: "material_store",
    description: "Cemento, blocks, varilla, adhesivos, pisos y materiales de obra.",
  },
  {
    name: "Productos de limpieza",
    slug: "productos-de-limpieza",
    type: "material_store",
    description: "Insumos para limpieza residencial, profunda, industrial y Airbnb.",
  },
  {
    name: "Jardinería y viveros",
    slug: "jardineria-y-viveros",
    type: "material_store",
    description: "Plantas, tierra, fertilizantes, macetas y artículos de jardín.",
  },
  {
    name: "Maderas y carpintería",
    slug: "maderas-y-carpinteria",
    type: "material_store",
    description: "Maderas, tableros, herrajes, jaladeras y accesorios.",
  },
  {
    name: "Material para herrería",
    slug: "material-para-herreria",
    type: "material_store",
    description: "Perfiles, soldadura, discos, pinturas y consumibles metálicos.",
  },
];

export const categories = [...serviceCategories, ...materialCategories];

export const locations: SeedLocation[] = [
  { name: "Cancún Centro", slug: "cancun-centro" },
  { name: "Cancún y alrededores", slug: "cancun-y-alrededores" },
  { name: "Zona Hotelera", slug: "zona-hotelera" },
  { name: "Puerto Cancún", slug: "puerto-cancun" },
  { name: "Bonampak", slug: "bonampak" },
  { name: "Puerto Juárez", slug: "puerto-juarez" },
  { name: "Alfredo V. Bonfil", slug: "alfredo-v-bonfil" },
  { name: "Av. Huayacán", slug: "av-huayacan" },
  { name: "Cumbres Cancún", slug: "cumbres-cancun" },
  { name: "Jardines del Sur", slug: "jardines-del-sur" },
  { name: "Álamos Cancún", slug: "alamos-cancun" },
  { name: "Av. La Luna", slug: "av-la-luna" },
  { name: "Av. Kabah", slug: "av-kabah" },
  { name: "Av. Nichupté", slug: "av-nichupte" },
  { name: "Av. López Portillo", slug: "av-lopez-portillo" },
  { name: "Costa Mujeres", slug: "costa-mujeres" },
  { name: "Puerto Morelos", slug: "puerto-morelos" },
];

export const plans: SeedPlan[] = [
  {
    name: "Básico",
    slug: "basico",
    price: 179,
    summary: "Para negocios que quieren aparecer y recibir contactos directos.",
    features: [
      "Perfil público",
      "WhatsApp visible",
      "Teléfono y correo de contacto",
      "Zona de atención",
      "Descripción del negocio",
      "Hasta 2 categorías",
      "Hasta 3 fotos",
      "Aparición normal",
    ],
  },
  {
    name: "Pro",
    slug: "pro",
    price: 299,
    summary: "Más visibilidad para proveedores activos y tiendas locales.",
    highlighted: true,
    features: [
      "Todo lo del básico",
      "Hasta 5 categorías",
      "Hasta 8 fotos",
      "Etiqueta de proveedor recomendado",
      "Mejor posición en resultados",
      "Botón de WhatsApp destacado",
    ],
  },
  {
    name: "Premium",
    slug: "premium",
    price: 549,
    summary: "Prioridad alta y presencia destacada en las zonas clave.",
    features: [
      "Todo lo del Pro",
      "Hasta 8 categorías",
      "Hasta 15 fotos",
      "Perfil destacado en página principal",
      "Prioridad alta en búsquedas",
      "Aparición destacada en su categoría",
      "Promoción destacada",
    ],
  },
];

export const featuredBusinesses = [
  {
    name: "Clima Caribe Cancún",
    slug: "clima-caribe-cancun",
    category: "Aire acondicionado",
    location: "Cancún Centro, Zona Hotelera",
    description: "Mantenimiento, instalación y reparación de minisplits con respuesta rápida.",
    tags: ["Verificado", "Urgencias", "Garantía"],
    verified: true,
    featured: true,
  },
  {
    name: "Plomería Huayacán",
    slug: "plomeria-huayacan",
    category: "Plomería",
    location: "Av. Huayacán, Cumbres Cancún",
    description: "Fugas, bombas, tinacos y reparaciones para casas y departamentos.",
    tags: ["Factura", "Airbnb", "Responde rápido"],
    verified: true,
    featured: false,
  },
  {
    name: "Ferre Materiales Bonampak",
    slug: "ferre-materiales-bonampak",
    category: "Ferreterías",
    location: "Bonampak, Puerto Cancún",
    description: "Ferretería local con materiales para electricidad, plomería y obra ligera.",
    tags: ["Acepta tarjeta", "Entrega local", "Factura"],
    verified: false,
    featured: true,
  },
];
