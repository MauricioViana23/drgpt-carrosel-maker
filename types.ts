export interface Slide {
  slide_number: number;
  headline: string;
  body: string;
  retention_bridge: string;
  visual_direction: string;
  visual_element_suggestion: string;
  imagePrompt?: string; // Stores the generated text prompt for external use
}

export interface QualityCheck {
  envolvente: boolean;
  denso_nao_obvio: boolean;
  estrutura_ok: boolean;
  cta_alinhado: boolean;
  notes: string;
}

export interface CarouselResponse {
  status: "ok" | "need_briefing";
  missing_fields?: string[];
  carousel_title: string;
  strategy: string;
  objective: string;
  target_audience: string;
  tone: string;
  offer: string;
  cta_type: string;
  slides: Slide[];
  quality_check: QualityCheck;
}

export interface Briefing {
  specialty: string;
  topic: string;
  objective: string;
  targetAudience: string;
  tone: string;
  offer: string;
  ctaType: string;
  mandatoryPhrase: string;
  reference: string;
}

export interface StrategyCard {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const CAROUSEL_STRATEGIES: StrategyCard[] = [
  {
    id: "Contrarian Authority",
    title: "Contrarian Authority",
    description: "Ataque ao senso comum com argumento forte + prova + CTA.",
    icon: "⚡",
  },
  {
    id: "Diagnóstico Implacável",
    title: "Diagnóstico Implacável",
    description: "Nomeia o erro do público e mostra o custo escondido.",
    icon: "🩺",
  },
  {
    id: "Framework Proprietário",
    title: "Framework Proprietário",
    description: "Cria um método em 3–5 etapas para o tema.",
    icon: "🧩",
  },
  {
    id: "Myth-Busting Cirúrgico",
    title: "Myth-Busting Cirúrgico",
    description: "Mito → verdade → implicação prática.",
    icon: "🔪",
  },
  {
    id: "Caso/Story com virada",
    title: "Caso/Story com virada",
    description: "História curta com tensão → insight → ação.",
    icon: "📖",
  },
];

export const TONE_OPTIONS = [
  "Provocativo",
  "Empático",
  "Técnico",
  "Indignado",
  "Inspirador",
];

export const CTA_OPTIONS = [
  "Agendar",
  "DM com palavra-chave",
  "Link na bio",
  "Lista de espera",
];
