import React, { useState } from 'react';
import { Briefing, CarouselResponse, CAROUSEL_STRATEGIES, TONE_OPTIONS, CTA_OPTIONS } from './types';
import { generateCarousel } from './services/geminiService';
import { Card, Input, Label, Select, TextArea } from './components/UI';
import { CarouselOutput } from './components/CarouselOutput';

// Demo Data
const DEMO_BRIEFING: Briefing = {
  specialty: "Endocrinologia",
  topic: "Resistência à insulina",
  objective: "Atrair leads qualificados para programa de emagrecimento",
  targetAudience: "Mulheres 35-50 anos, metabolismo lento, cansaço crônico, dificuldade de perder peso",
  tone: "Provocativo",
  offer: "Programa Metabólico 90 Dias",
  ctaType: "Agendar",
  mandatoryPhrase: "O problema não é o que você come, é como seu corpo reage.",
  reference: "Mito de que comer de 3 em 3 horas acelera metabolismo",
};

const DEMO_STRATEGY = "Contrarian Authority";

function App() {
  const [briefing, setBriefing] = useState<Briefing>({
    specialty: '',
    topic: '',
    objective: '',
    targetAudience: '',
    tone: TONE_OPTIONS[0],
    offer: '',
    ctaType: CTA_OPTIONS[0],
    mandatoryPhrase: '',
    reference: '',
  });

  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CarouselResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBriefing(prev => ({ ...prev, [name]: value }));
  };

  const isBriefingComplete = () => {
    return (
      briefing.specialty.trim() !== '' &&
      briefing.topic.trim() !== '' &&
      briefing.objective.trim() !== '' &&
      briefing.targetAudience.trim() !== '' &&
      briefing.offer.trim() !== '' &&
      briefing.mandatoryPhrase.trim() !== '' &&
      selectedStrategy !== null
    );
  };

  const loadDemo = () => {
    setBriefing(DEMO_BRIEFING);
    setSelectedStrategy(DEMO_STRATEGY);
  };

  const handleGenerate = async () => {
    if (!selectedStrategy) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await generateCarousel(briefing, selectedStrategy);
      if (data.status === 'need_briefing') {
        setError(`Faltam campos: ${data.missing_fields?.join(', ')}`);
      } else {
        setResult(data);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao gerar carrossel. Verifique sua API Key ou tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 font-sans selection:bg-pink-500/30 selection:text-pink-100">
      
      {/* Header */}
      <header className="pt-12 pb-8 text-center px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
          <span className="w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]"></span>
          <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">DoutorGPT • AI Engine</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
          DoutorGPT <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Carrossel Maker</span>
        </h1>
        <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto">
          Crie carrosséis densos para médicos focados em autoridade, retenção e conversão.
        </p>
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-24">
        
        {/* Input Section - Hide if we have a result? No, let user edit and regenerate */}
        <div className={`transition-all duration-500 ${result ? 'mb-12 opacity-80' : 'mb-8'}`}>
          <Card className="p-6 md:p-8 relative overflow-hidden">
            {/* Background Glow Effect */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-pink-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Briefing do Conteúdo</h2>
              <button 
                onClick={loadDemo} 
                className="text-xs text-gray-500 hover:text-pink-400 transition-colors underline decoration-dotted"
              >
                Carregar Demo
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Column 1 */}
              <div className="space-y-4">
                <div>
                  <Label>Especialidade</Label>
                  <Input 
                    name="specialty" 
                    value={briefing.specialty} 
                    onChange={handleInputChange} 
                    placeholder="Ex: Cardiologia" 
                  />
                </div>
                <div>
                  <Label>Tema do Carrossel</Label>
                  <Input 
                    name="topic" 
                    value={briefing.topic} 
                    onChange={handleInputChange} 
                    placeholder="Ex: Hipertensão em jovens" 
                  />
                </div>
                <div>
                  <Label>Público-Alvo Exato</Label>
                  <TextArea 
                    name="targetAudience" 
                    rows={3} 
                    value={briefing.targetAudience} 
                    onChange={handleInputChange} 
                    placeholder="Quem é o paciente ideal? Qual a dor?" 
                  />
                </div>
                <div>
                  <Label>Referência Opcional</Label>
                  <Input 
                    name="reference" 
                    value={briefing.reference} 
                    onChange={handleInputChange} 
                    placeholder="Um mito, um estudo, uma notícia..." 
                  />
                </div>
              </div>

              {/* Column 2 */}
              <div className="space-y-4">
                <div>
                  <Label>Objetivo Estratégico</Label>
                  <Input 
                    name="objective" 
                    value={briefing.objective} 
                    onChange={handleInputChange} 
                    placeholder="Ex: Vender check-up" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Tom de Voz</Label>
                    <Select name="tone" value={briefing.tone} onChange={handleInputChange}>
                      {TONE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </Select>
                  </div>
                  <div>
                    <Label>CTA Desejado</Label>
                    <Select name="ctaType" value={briefing.ctaType} onChange={handleInputChange}>
                      {CTA_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Oferta Final</Label>
                  <Input 
                    name="offer" 
                    value={briefing.offer} 
                    onChange={handleInputChange} 
                    placeholder="Ex: Consulta presencial" 
                  />
                </div>
                <div>
                  <Label>Frase Obrigatória</Label>
                  <Input 
                    name="mandatoryPhrase" 
                    value={briefing.mandatoryPhrase} 
                    onChange={handleInputChange} 
                    placeholder="O insight chave que deve aparecer" 
                  />
                </div>
                
                {/* Fixed Slide Count */}
                <div className="pt-2 opacity-50">
                  <Label>Estrutura</Label>
                  <div className="w-full bg-[#111] border border-white/5 rounded-lg p-3 text-sm text-gray-500 cursor-not-allowed flex justify-between">
                    <span>Padrão DoutorGPT</span>
                    <span>7 Slides (Otimizado)</span>
                  </div>
                </div>
              </div>

            </div>
          </Card>

          {/* Strategy Selection */}
          <div className="mt-8">
             <div className="flex items-center gap-2 mb-4 px-1">
                <span className="text-pink-500 text-xs font-bold bg-pink-500/10 px-2 py-0.5 rounded">CRÍTICO</span>
                <h2 className="text-lg font-semibold text-white">Estratégia Narrativa</h2>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {CAROUSEL_STRATEGIES.map((strat) => (
                  <button
                    key={strat.id}
                    onClick={() => setSelectedStrategy(strat.id)}
                    className={`text-left p-4 rounded-xl border transition-all duration-200 h-full flex flex-col gap-2 relative group
                      ${selectedStrategy === strat.id 
                        ? 'bg-gradient-to-b from-[#222] to-[#151515] border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.15)]' 
                        : 'bg-[#0f0f0f] border-white/5 hover:border-white/20 hover:bg-[#151515]'
                      }`}
                  >
                    <div className="text-2xl mb-1">{strat.icon}</div>
                    <h3 className={`font-bold text-sm ${selectedStrategy === strat.id ? 'text-white' : 'text-gray-300'}`}>
                      {strat.title}
                    </h3>
                    <p className="text-[11px] text-gray-500 leading-tight">
                      {strat.description}
                    </p>
                  </button>
                ))}
             </div>
          </div>

          {/* Generate Action */}
          <div className="mt-10 flex flex-col items-center">
             <button
              onClick={handleGenerate}
              disabled={!isBriefingComplete() || loading}
              className={`
                group relative px-8 py-4 rounded-xl font-bold text-lg tracking-wide transition-all duration-300 w-full md:w-auto md:min-w-[300px]
                ${!isBriefingComplete() || loading 
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50' 
                  : 'bg-gradient-to-r from-pink-600 to-pink-500 text-white shadow-[0_0_30px_rgba(219,39,119,0.4)] hover:shadow-[0_0_50px_rgba(219,39,119,0.6)] hover:scale-[1.02] active:scale-[0.98]'
                }
              `}
             >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Gerando Carrossel com IA...
                  </span>
                ) : (
                  "Gerar Carrossel"
                )}
             </button>
             {!isBriefingComplete() && (
               <p className="text-xs text-red-400 mt-3 animate-pulse">
                 *Preencha todos os campos e selecione uma estratégia para liberar.
               </p>
             )}
             {error && (
               <div className="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-red-200 text-sm max-w-lg text-center">
                 ❌ {error}
               </div>
             )}
          </div>
        </div>

        {/* Results */}
        {result && (
          <div id="results">
             <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-12"></div>
             <CarouselOutput data={result} />
          </div>
        )}

      </main>
    </div>
  );
}

export default App;
