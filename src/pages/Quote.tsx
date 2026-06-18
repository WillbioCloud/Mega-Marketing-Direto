import { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { MapPin, CheckCircle2, ChevronRight, MessageCircle, Hexagon } from "lucide-react";
import { motion } from "motion/react";
import { NeighborhoodArea, CustomMarker } from "../types";
import { MapContainer, TileLayer, Marker, Polygon, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { supabase } from "../lib/supabase";



function ZoomController({ zones, selectedIds }: { zones: (NeighborhoodArea | CustomMarker)[], selectedIds: string[] }) {
  const map = useMap();
  
  useEffect(() => {
    // If we wanted to zoom to selection we could do it here
    // But centering Caldas Novas statically for now is enough:
  }, [selectedIds, map]);

  return null;
}

export default function Quote() {
  const [volume, setVolume] = useState<number>(5);
  const [bairros, setBairros] = useState<NeighborhoodArea[]>([]);
  const [markers, setMarkers] = useState<CustomMarker[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>(['Porta a Porta']);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadZones = async () => {
      const { data, error } = await supabase
        .from('map_zones')
        .select('*')
        .eq('is_active', true);

      if (!error && data) {
        const areas: NeighborhoodArea[] = data
          .filter(z => z.type === 'area')
          .map(z => ({
            id: z.id,
            name: z.name,
            basePrice: z.price_modifier,
            isActive: z.is_active,
            // coordinates salvo como [[lat,lng],...] pelo MapEditor
            points: Array.isArray(z.coordinates) ? z.coordinates : []
          }));

        const pts: CustomMarker[] = data
          .filter(z => z.type === 'marker')
          .map(z => ({
            id: z.id,
            name: z.name,
            priceModifier: z.price_modifier,
            lat: z.coordinates?.lat ?? 0,
            lng: z.coordinates?.lng ?? 0
          }));

        setBairros(areas);
        setMarkers(pts);
      }
    };
    loadZones();
  }, []);

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!leadForm.name || !leadForm.phone) return;
    setIsSubmitting(true);
    
    // Salva o Lead no Supabase
    await supabase.from('clients').insert([{
      name: leadForm.name, phone: leadForm.phone, niche: 'Site Lead', status: 'Lead',
    }]);

    // Formata a Mensagem do WhatsApp
    const selectedNames = [...bairros, ...markers].filter(z => selectedIds.includes(z.id)).map(z => z.name);
    const zonesText = selectedNames.length > 0 ? selectedNames.join(", ") : "Nenhuma extra";
    
    const text = `Olá! Sou ${leadForm.name}.\nSimulei no site uma campanha de ${volume} milheiros (${volume * 1000} panfletos).\n📍 Serviços: ${selectedServices.join(", ")}.\n📍 Regiões: ${zonesText}.`;
    
    setIsLeadModalOpen(false);
    setIsSubmitting(false);
    window.open(`https://wa.me/5564999391905?text=${encodeURIComponent(text)}`, '_blank');
  };

  const pinIconHTML = (isSelected: boolean, name: string) => `
    <div class="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
      <div class="relative">
        ${isSelected ? '<div class="absolute -inset-2 bg-indigo-500/30 rounded-full animate-ping"></div>' : ''}
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="${isSelected ? '#4f46e5' : '#ffffff'}" stroke="${isSelected ? '#ffffff' : '#94a3b8'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="filter drop-shadow z-10 relative transition-all duration-300">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      </div>
      <div class="mt-1 px-2 py-0.5 bg-white/90 backdrop-blur rounded shadow-sm border ${isSelected ? 'border-indigo-200 text-indigo-700 font-bold' : 'border-slate-100 text-slate-600 font-semibold'} text-[10px] whitespace-nowrap transition-all duration-300">
        ${name}
      </div>
    </div>
  `;

  return (
    <div className="min-h-screen relative selection:bg-indigo-100 selection:text-indigo-900 flex flex-col bg-slate-50">
      <Navbar />
      
      <main className="flex-grow pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-4">
              Simule sua Campanha em Caldas Novas
            </h1>
            <p className="text-lg text-slate-600">
              Personalize o volume da sua panfletagem e escolha os melhores pontos logísticos para atingir o seu público.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden shadow-slate-200/50">
            <div className="flex flex-col-reverse lg:grid lg:grid-cols-2">
              
              {/* Control Panel */}
              <div className="p-8 lg:p-12 border-t lg:border-t-0 lg:border-r border-slate-200 flex flex-col gap-10">
                
                {/* Services Selection */}
                <div>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-slate-900">1. Tipos de Serviço</h3>
                    <p className="text-sm text-slate-500">Selecione uma ou mais modalidades</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-8">
                    {["Porta a Porta", "Semáforo Premium", "Bandeiradas Especiais", "Centro & Comércio"].map(service => {
                      const isSelected = selectedServices.includes(service);
                      return (
                        <button
                          key={service}
                          onClick={() => setSelectedServices(prev => prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service])}
                          className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                            isSelected ? "bg-indigo-50 border-indigo-200 ring-1 ring-indigo-500 text-indigo-700 font-semibold" : "bg-white border-slate-200 hover:border-slate-300 text-slate-600 font-medium"
                          }`}
                        >
                          <div className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? "bg-indigo-500 border-indigo-500" : "border-slate-300"}`}>
                            {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                          </div>
                          <span className="text-sm leading-tight">{service}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Volume Control */}
                <div>
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">2. Volume da Campanha</h3>
                      <p className="text-sm text-slate-500">Quantidade de material impresso (Milheiros)</p>
                    </div>
                    <div className="text-2xl font-bold text-indigo-600">
                      {volume} Milheiro(s) <span className="text-sm font-medium text-slate-500">({volume * 1000} un)</span>
                    </div>
                  </div>
                  
                  <input
                    type="range"
                    min="1"
                    max="50"
                    step="1"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-xs font-medium text-slate-400 mt-2">
                    <span>1</span>
                    <span>50</span>
                  </div>
                </div>

                {/* Zones Selection */}
                <div>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-slate-900">3. Estratégia Logística</h3>
                    <p className="text-sm text-slate-500">Selecione áreas e pontos chave para distribuição</p>
                  </div>
                  
                  <div className="grid gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {bairros.length === 0 && markers.length === 0 && (
                      <div className="text-center p-6 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm">
                        As áreas e regiões estão sendo mapeadas por nossa equipe.
                      </div>
                    )}
                    
                    {bairros.map((zone) => {
                      const isSelected = selectedIds.includes(zone.id);
                      return (
                        <button
                          key={zone.id}
                          onClick={() => toggleSelection(zone.id)}
                          className={`flex items-start justify-between p-4 rounded-xl border text-left transition-all ${
                            isSelected 
                              ? "bg-indigo-50 border-indigo-200 ring-1 ring-indigo-500" 
                              : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex gap-3 items-center">
                            <div className={`rounded-full flex-shrink-0 transition-colors ${
                              isSelected ? "text-indigo-600" : "text-slate-300"
                            }`}>
                              {isSelected ? <CheckCircle2 className="w-5 h-5" /> : <Hexagon className="w-5 h-5" />}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900 flex items-center gap-2">
                                {zone.name}
                                <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-medium">Área</span>
                              </div>
                            </div>
                          </div>

                        </button>
                      );
                    })}

                    {markers.map((marker) => {
                      const isSelected = selectedIds.includes(marker.id);
                      return (
                        <button
                          key={marker.id}
                          onClick={() => toggleSelection(marker.id)}
                          className={`flex items-start justify-between p-4 rounded-xl border text-left transition-all ${
                            isSelected 
                              ? "bg-emerald-50 border-emerald-200 ring-1 ring-emerald-500" 
                              : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex gap-3 items-center">
                            <div className={`rounded-full flex-shrink-0 transition-colors ${
                              isSelected ? "text-emerald-600" : "text-slate-300"
                            }`}>
                              {isSelected ? <CheckCircle2 className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900 flex items-center gap-2">
                                {marker.name}
                                <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-medium">Ponto</span>
                              </div>
                            </div>
                          </div>

                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Map Visual / Output */}
              <div className="relative bg-slate-100 flex flex-col h-[500px] lg:h-auto overflow-hidden">
                <MapContainer 
                  center={[-17.744, -48.625]} 
                  zoom={14} 
                  style={{ width: '100%', height: '100%', zIndex: 0 }}
                  zoomControl={false}
                >
                  <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}{r}.png" />
                  <ZoomController zones={[...bairros, ...markers]} selectedIds={selectedIds} />

                  {/* Render Bairros (Polygon) */}
                  {bairros.map(bairro => {
                     const isSelected = selectedIds.includes(bairro.id);
                     return (
                       <Polygon
                         key={bairro.id}
                         positions={bairro.points}
                         pathOptions={{
                           color: isSelected ? '#4f46e5' : '#94a3b8',
                           fillColor: isSelected ? '#4f46e5' : '#cbd5e1',
                           fillOpacity: isSelected ? 0.3 : 0.1,
                           weight: isSelected ? 3 : 1
                         }}
                         eventHandlers={{
                           click: () => toggleSelection(bairro.id)
                         }}
                       />
                     );
                  })}

                  {/* Render Markers */}
                  {markers.map(marker => {
                    const isSelected = selectedIds.includes(marker.id);
                    const icon = L.divIcon({ className: '', html: pinIconHTML(isSelected, marker.name), iconSize: [0, 0] });
                    return (
                      <Marker
                        key={marker.id}
                        position={[marker.lat, marker.lng]}
                        icon={icon}
                        eventHandlers={{
                          click: () => toggleSelection(marker.id)
                        }}
                      />
                    );
                  })}
                </MapContainer>

                {/* Hotspots Custom Overlay is removed, handled natively by React-Leaflet */}

                {/* Realtime Quote Output that overlaps the bottom of the map */}
                <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md p-6 border-t border-slate-200 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] z-[400] transition-all">
                  <div className="flex flex-col mb-6 text-center lg:text-left">
                    <h3 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-1">Orçamento Sob Medida</h3>
                    <div className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                      Consulte Disponibilidade
                    </div>
                    <p className="text-sm text-slate-500 mt-2">
                      Montaremos uma proposta focada na melhor conversão para o seu negócio.
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => setIsLeadModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-3 rounded-xl font-bold text-base transition-all hover:shadow-lg hover:shadow-emerald-500/20"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Fechar Orçamento
                    <ChevronRight className="w-5 h-5 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {isLeadModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Quase lá!</h2>
            <p className="text-slate-500 mb-6">Para liberar seu orçamento e disponibilidade, como podemos te chamar?</p>
            
            <form onSubmit={handleLeadSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome completo</label>
                <input 
                  type="text" 
                  required
                  value={leadForm.name}
                  onChange={e => setLeadForm({...leadForm, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="Seu nome"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp</label>
                <input 
                  type="tel" 
                  required
                  value={leadForm.phone}
                  onChange={e => setLeadForm({...leadForm, phone: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="(00) 00000-0000"
                />
              </div>
              
              <div className="flex gap-3 mt-4">
                <button 
                  type="button" 
                  onClick={() => setIsLeadModalOpen(false)}
                  className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Enviando...' : 'Ver Orçamento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
