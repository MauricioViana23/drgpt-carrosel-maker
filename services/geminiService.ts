import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Briefing, CarouselResponse } from "../types";

const CAROUSEL_SYSTEM_INSTRUCTION = `
Você é Leo, um especialista lendário em copywriting para carrosséis virais para médicos.
SEU FOCO: Autoridade, Retenção e Conversão.

REGRA DE OURO (TAMANHO DO TEXTO):
- OTIMIZAÇÃO MOBILE EXTREMA: Os textos devem ser CURTOS e ESCANEÁVEIS.
- HEADLINE: 1 linha, impacto imediato.
- BODY: Máximo de 20 a 30 palavras. Use frases curtas.
- O texto será colado no Canva (formato 4:5), não pode ser "textão".

ESTRUTURA OBRIGATÓRIA (7 Slides - Formato Enxuto):
- Slide 1: Hook brutal (título curto).
- Slides 2–3: Dor/Problema (rápido e direto).
- Slides 4: A Virada (Insight chave).
- Slides 5–6: Solução Prática (passos simples).
- Slide 7: CTA Claro e Forte.

REGRAS DE COPY:
- Use conectores lógicos rápidos.
- Gatilhos mentais sutis.
- Se a estrutura quebrar: REESCREVER TUDO automaticamente.
- Retorne SOMENTE JSON no schema definido.
`;

const PROMPT_ENGINEER_SYSTEM_INSTRUCTION = `
The "Medical Realism" Template
Role: You are an expert Medical AI Photographer and Instagram Curator. Your goal is to convert simple user inputs from doctors into highly detailed, photorealistic image generation prompts suitable for high-end medical marketing.

Core Philosophy:
Anti-Stock: Avoid plastic skin, stiff poses, and overly perfect smiles. Imperfection is realistic.
Warmth: Medical environments should feel safe, warm, and inviting, not cold or blue-tinted.
Quality: All prompts must trigger 8k resolution, textural detail, and cinematic lighting.

Mandatory Prompt Structure: Every prompt you generate must follow this specific formula: [Subject & Micro-Expression] + [Action & Context] + [Environment & Vibe] + [Lighting & Atmosphere] + [Camera Gear & Technical Specs] + [Aspect Ratio]

Key Style Tokens (Include these in every prompt):
Skin: "Natural skin texture, visible pores, subsurface scattering, slight skin imperfections, un-retouched."
Lighting: "Soft volumetric lighting, golden hour window light, Rembrandt lighting, no harsh fluorescent lights."
Camera: "Shot on Sony A7R IV, 85mm lens (for portraits), f/1.8 aperture, depth of field, sharp focus on eyes, bokeh background."

Negative Constraints (What to avoid): "3d render, cartoon, illustration, plastic skin, wax figure, oversaturated, creepy, blood, gory, cold blue tones, hospital sterile white, deformed hands, watermark, blurry."

Response Template: When the user gives a topic, output ONLY the prompt text. Do not wrap it in brackets or labels like [Image Prompt]. Just the raw prompt text.
`;

const CAROUSEL_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    status: { type: Type.STRING, enum: ["ok", "need_briefing"] },
    missing_fields: { type: Type.ARRAY, items: { type: Type.STRING } },
    carousel_title: { type: Type.STRING },
    strategy: { type: Type.STRING },
    objective: { type: Type.STRING },
    target_audience: { type: Type.STRING },
    tone: { type: Type.STRING },
    offer: { type: Type.STRING },
    cta_type: { type: Type.STRING },
    slides: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          slide_number: { type: Type.INTEGER },
          headline: { type: Type.STRING },
          body: { type: Type.STRING },
          retention_bridge: { type: Type.STRING },
          visual_direction: { type: Type.STRING },
          visual_element_suggestion: { type: Type.STRING },
        },
        required: [
          "slide_number",
          "headline",
          "body",
          "retention_bridge",
          "visual_direction",
          "visual_element_suggestion",
        ],
      },
    },
    quality_check: {
      type: Type.OBJECT,
      properties: {
        envolvente: { type: Type.BOOLEAN },
        denso_nao_obvio: { type: Type.BOOLEAN },
        estrutura_ok: { type: Type.BOOLEAN },
        cta_alinhado: { type: Type.BOOLEAN },
        notes: { type: Type.STRING },
      },
      required: [
        "envolvente",
        "denso_nao_obvio",
        "estrutura_ok",
        "cta_alinhado",
        "notes",
      ],
    },
  },
  required: [
    "status",
    "missing_fields",
    "carousel_title",
    "strategy",
    "objective",
    "target_audience",
    "tone",
    "offer",
    "cta_type",
    "slides",
    "quality_check",
  ],
};

export async function generateCarousel(
  briefing: Briefing,
  strategy: string
): Promise<CarouselResponse> {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Check process.env.API_KEY");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const userPrompt = `
BRIEFING:
Especialidade: ${briefing.specialty}
Tema: ${briefing.topic}
Objetivo estratégico: ${briefing.objective}
Público-alvo exato: ${briefing.targetAudience}
Tom: ${briefing.tone}
Oferta final: ${briefing.offer}
CTA escolhido: ${briefing.ctaType}
Frase obrigatória: ${briefing.mandatoryPhrase}
Referência opcional: ${briefing.reference}
Estratégia escolhida: ${strategy}

INSTRUÇÕES:
- Gere um carrossel de 7 slides ENXUTOS.
- Textos curtos para caber no Canva sem poluição visual.
- Slide 7: CTA “${briefing.ctaType}”.
Retorne SOMENTE JSON válido no schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userPrompt,
      config: {
        systemInstruction: CAROUSEL_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: CAROUSEL_SCHEMA,
        temperature: 0.3,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as CarouselResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

export async function generateImagePrompt(visualContext: string): Promise<string> {
    if (!process.env.API_KEY) {
      throw new Error("API Key is missing.");
    }
  
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Using a text model to generate the prompt text, NOT an image model.
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Doctor's Input: "${visualContext}"`,
        config: {
            systemInstruction: PROMPT_ENGINEER_SYSTEM_INSTRUCTION,
            temperature: 0.7, // Slightly higher creativity for prompts
        }
      });
      
      const text = response.text;
      if (!text) throw new Error("No response from AI");

      return text.replace(/\[Image Prompt\]/g, '').trim(); // Clean up if it adds label

    } catch (error) {
      console.error("Prompt Gen Error:", error);
      throw error;
    }
  }
