import React, { useState } from 'react';
import { CarouselResponse, Slide } from '../types';
import { Card } from './UI';
import { generateImagePrompt } from '../services/geminiService';

interface CarouselOutputProps {
  data: CarouselResponse;
}

const SlideCard: React.FC<{ slide: Slide }> = ({ slide }) => {
  const [copied, setCopied] = useState(false);
  const [promptLoading, setPromptLoading] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(slide.imagePrompt || null);
  const [promptCopied, setPromptCopied] = useState(false);
  const [error, setError] = useState(false);

  const handleCopyText = () => {
    const text = `
${slide.headline}

${slide.body}
    `.trim();
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGeneratePrompt = async () => {
    setPromptLoading(true);
    setError(false);
    try {
        const visualContext = `${slide.visual_direction}. Suggestion: ${slide.visual_element_suggestion}`;
        const promptText = await generateImagePrompt(visualContext);
        setGeneratedPrompt(promptText);
        slide.imagePrompt = promptText; 
    } catch (e) {
        console.error(e);
        setError(true);
    } finally {
        setPromptLoading(false);
    }
  };

  const handleCopyPrompt = () => {
    if (generatedPrompt) {
        navigator.clipboard.writeText(generatedPrompt);
        setPromptCopied(true);
        setTimeout(() => setPromptCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1A1A1A] border border-white/10 rounded-xl overflow-hidden group hover:border-pink-500/30 transition-all duration-300 relative">
      
      {/* Header Bar */}
      <div className="px-4 py-3 bg-black/40 border-b border-white/5 flex justify-between items-center relative backdrop-blur-sm">
        <span className="text-xs font-bold text-pink-500 uppercase tracking-widest">
          Slide {slide.slide_number < 10 ? `0${slide.slide_number}` : slide.slide_number}
        </span>
        <button 
          onClick={handleCopyText}
          className="text-[10px] font-medium bg-white/5 hover:bg-white/10 px-2 py-1 rounded text-gray-300 transition-colors border border-white/5"
        >
          {copied ? 'Texto Copiado!' : 'Copiar Texto'}
        </button>
      </div>

      {/* Content Area */}
      <div className="p-6 flex-1 flex flex-col gap-3 relative">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white leading-tight mb-3">
            {slide.headline}
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line font-light">
            {slide.body}
          </p>
        </div>

        {slide.retention_bridge && (
           <div className="mt-4 pt-3 border-t border-white/5 border-dashed">
            <p className="text-xs text-gray-500 italic flex items-center gap-2">
              <span className="text-pink-500">⤵</span>
              {slide.retention_bridge}
            </p>
          </div>
        )}
      </div>

      {/* Footer Action Area - Prompt Generation */}
      <div className="p-4 relative mt-auto border-t border-white/5 bg-black/20">
        {!generatedPrompt && !promptLoading && (
            <div className="space-y-2">
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Visual AI</p>
                <button 
                    onClick={handleGeneratePrompt}
                    className="w-full py-2.5 bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 hover:text-pink-300 text-xs font-bold rounded-lg border border-pink-500/20 transition-all flex items-center justify-center gap-2"
                >
                    <span>✨</span>
                    <span>Gerar Prompt Realista (AI)</span>
                </button>
                <p className="text-[10px] text-gray-600 text-center leading-tight">
                    Cria um prompt otimizado para Midjourney/Leonardo.
                </p>
            </div>
        )}

        {promptLoading && (
            <div className="w-full py-3 bg-pink-900/10 border border-pink-500/10 rounded-lg flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-pink-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-xs font-semibold text-pink-300">Escrevendo prompt...</span>
            </div>
        )}

        {generatedPrompt && !promptLoading && (
            <div className="space-y-2 animate-fade-in-up">
                <div className="flex justify-between items-center">
                    <p className="text-[10px] text-green-500 uppercase font-bold tracking-wider">Prompt Gerado</p>
                    <button 
                        onClick={handleGeneratePrompt}
                        className="text-[10px] text-gray-500 hover:text-white underline decoration-dotted"
                    >
                        Refazer
                    </button>
                </div>
                
                <div className="bg-[#0a0a0a] border border-white/10 rounded p-2 relative group/prompt">
                    <p className="text-[10px] text-gray-400 font-mono leading-relaxed line-clamp-4 hover:line-clamp-none transition-all">
                        {generatedPrompt}
                    </p>
                </div>

                <button 
                    onClick={handleCopyPrompt}
                    className={`w-full py-2 text-xs font-bold rounded-lg border transition-all flex items-center justify-center gap-2
                        ${promptCopied 
                            ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                            : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-300'
                        }`}
                >
                   {promptCopied ? 'Copiado!' : '📋 Copiar Prompt'}
                </button>
            </div>
        )}
        
        {error && <p className="text-[10px] text-red-500 text-center mt-2">Erro ao gerar prompt.</p>}
      </div>
    </div>
  );
};

export const CarouselOutput: React.FC<CarouselOutputProps> = ({ data }) => {
  const [copiedAll, setCopiedAll] = useState(false);

  const handleCopyAll = () => {
    const allText = data.slides.map(s => `
SLIDE ${s.slide_number}
HEADLINE: ${s.headline}
BODY: ${s.body}
BRIDGE: ${s.retention_bridge}
---`).join('\n');
    
    navigator.clipboard.writeText(allText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `doutorgpt-carousel-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fade-in-up space-y-8">
      {/* Quality Check Banner */}
      <Card className="p-4 bg-gradient-to-r from-green-900/10 to-transparent border-green-500/20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-green-400 font-bold text-sm uppercase tracking-wide flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>
              Checklist de Qualidade Leo
            </h3>
            <p className="text-gray-400 text-xs mt-1">{data.quality_check.notes}</p>
          </div>
          <div className="flex gap-2 text-[10px] uppercase font-bold tracking-wider text-gray-500">
            <span className={data.quality_check.envolvente ? "text-green-500" : ""}>Envolvente</span> •
            <span className={data.quality_check.denso_nao_obvio ? "text-green-500" : ""}>Denso</span> •
            <span className={data.quality_check.cta_alinhado ? "text-green-500" : ""}>CTA OK</span>
          </div>
        </div>
      </Card>

      {/* Toolbar */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Resultado <span className="text-gray-600 text-lg font-normal">({data.slides.length} slides)</span></h2>
        <div className="flex gap-3">
          <button 
            onClick={handleCopyAll}
            className="px-4 py-2 bg-[#222] hover:bg-[#333] text-white text-sm rounded-lg transition-colors border border-white/10"
          >
            {copiedAll ? 'Copiado!' : 'Copiar Texto Completo'}
          </button>
          <button 
            onClick={handleExportJSON}
            className="px-4 py-2 bg-[#222] hover:bg-[#333] text-white text-sm rounded-lg transition-colors border border-white/10"
          >
            Exportar JSON
          </button>
        </div>
      </div>

      {/* Grid of Slides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.slides.map((slide) => (
          <SlideCard key={slide.slide_number} slide={slide} />
        ))}
      </div>
      
      {/* Bottom Action */}
      <div className="flex justify-center pt-8 pb-12">
          <p className="text-gray-600 text-sm">Review final: Copie os textos para o Canva e use os prompts gerados para criar as imagens.</p>
      </div>
    </div>
  );
};
