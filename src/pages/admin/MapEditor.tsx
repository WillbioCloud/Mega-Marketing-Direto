import React, { useState, useEffect } from "react";
import { MapPin, Save, Trash2, Map as MapIcon, ZoomIn, ZoomOut, Move, Hand, Hexagon, Check, Loader2 } from "lucide-react";
import { CustomMarker, NeighborhoodArea } from "../../types";
import { supabase } from "../../lib/supabase";
import { MapContainer, TileLayer, Marker, Polygon, Polyline, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type InteractionMode = 'pan' | 'marker' | 'polygon';

function MapController({ mode, onModeChange }: { mode: InteractionMode, onModeChange: (m: InteractionMode) => void }) {
  const map = useMap();
  
  useEffect(() => {
    if (mode === 'pan') {
      map.dragging.enable();
    } else {
      map.dragging.disable();
    }
  }, [mode, map]);

  return (
    <div className="absolute top-4 right-4 z-[400] bg-slate-900 border border-slate-700 rounded-xl shadow-lg flex flex-col overflow-hidden">
      <button 
        onClick={(e) => { e.stopPropagation(); onModeChange('pan'); }}
        className={`p-2 transition-colors border-b border-slate-800 flex justify-center ${mode === 'pan' ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-400 hover:bg-slate-800'}`}
        title="Modo Mover Mapa"
      >
        <Hand className="w-4 h-4" />
      </button>
      <button 
        onClick={(e) => { e.stopPropagation(); onModeChange('marker'); }}
        className={`p-2 transition-colors border-b border-slate-800 flex justify-center ${mode === 'marker' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:bg-slate-800'}`}
        title="Adicionar Ponto"
      >
        <MapPin className="w-4 h-4" />
      </button>
      <button 
        onClick={(e) => { e.stopPropagation(); onModeChange('polygon'); }}
        className={`p-2 transition-colors border-b border-slate-800 flex justify-center ${mode === 'polygon' ? 'bg-amber-500/20 text-amber-400' : 'text-slate-400 hover:bg-slate-800'}`}
        title="Desenhar Área"
      >
        <Hexagon className="w-4 h-4" />
      </button>

      <button onClick={(e) => { e.stopPropagation(); map.zoomIn(); }} className="p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors border-b border-slate-800 flex justify-center" title="Aumentar Zoom">
        <ZoomIn className="w-4 h-4" />
      </button>
      <button onClick={(e) => { e.stopPropagation(); map.zoomOut(); }} className="p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors border-b border-slate-800 flex justify-center" title="Diminuir Zoom">
        <ZoomOut className="w-4 h-4" />
      </button>
      <button onClick={(e) => { e.stopPropagation(); map.setView([-17.744, -48.625], 14); }} className="p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors flex justify-center" title="Centralizar Mapa">
        <Move className="w-4 h-4" />
      </button>
    </div>
  );
}

function MapEventsHandler({ 
  mode, 
  onMapClick,
  setMode
}: { 
  mode: InteractionMode; 
  onMapClick: (latlng: L.LatLng) => void;
  setMode: (m: InteractionMode) => void;
}) {
  useMapEvents({
    click(e) {
      if (mode !== 'pan') {
        onMapClick(e.latlng);
      }
    }
  });
  return null;
}

export default function MapEditor() {
  const [bairros, setBairros] = useState<NeighborhoodArea[]>([]);
  const [markers, setMarkers] = useState<CustomMarker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMapData();
  }, []);

  const fetchMapData = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('map_zones').select('*');
    if (!error && data) {
      const dbAreas: NeighborhoodArea[] = data
        .filter(z => z.type === 'area')
        .map(z => ({
          id: z.id,
          name: z.name,
          basePrice: z.price_modifier,
          isActive: z.is_active,
          // coordinates armazenado como [[lat,lng],...] compatível com Leaflet
          points: Array.isArray(z.coordinates) ? z.coordinates : []
        }));

      const dbMarkers: CustomMarker[] = data
        .filter(z => z.type === 'marker')
        .map(z => ({
          id: z.id,
          name: z.name,
          priceModifier: z.price_modifier,
          lat: z.coordinates?.lat ?? 0,
          lng: z.coordinates?.lng ?? 0
        }));

      setBairros(dbAreas);
      setMarkers(dbMarkers);
    }
    setLoading(false);
  };

  const [interactionMode, setInteractionMode] = useState<InteractionMode>('pan');
  const [draftPolygon, setDraftPolygon] = useState<[number, number][]>([]);
  
  const [selectedBairro, setSelectedBairro] = useState<string | null>(null);
  const [editingMarkerId, setEditingMarkerId] = useState<string | null>(null);

  // Form states for new Area
  const [showAreaModal, setShowAreaModal] = useState(false);
  const [newAreaName, setNewAreaName] = useState("");
  const [newAreaPrice, setNewAreaPrice] = useState<number>(0);

  const handleMapClick = (latlng: L.LatLng) => {
    if (interactionMode === 'marker') {
      const newMarker: CustomMarker = {
        id: `m-${Date.now()}`,
        lat: latlng.lat,
        lng: latlng.lng,
        name: `Novo Ponto`,
        priceModifier: 30
      };
      setMarkers([...markers, newMarker]);
      setEditingMarkerId(newMarker.id);
      setInteractionMode('pan');
    } else if (interactionMode === 'polygon') {
      setDraftPolygon(prev => [...prev, [latlng.lat, latlng.lng]]);
    }
  };

  const handleFinishPolygon = () => {
    if (draftPolygon.length >= 3) {
      setShowAreaModal(true);
    }
  };

  const saveNewArea = () => {
    const newArea: NeighborhoodArea = {
      id: `a-${Date.now()}`,
      name: newAreaName || "Nova Área",
      basePrice: newAreaPrice,
      isActive: true,
      points: draftPolygon
    };
    setBairros([...bairros, newArea]);
    setDraftPolygon([]);
    setShowAreaModal(false);
    setInteractionMode('pan');
    setNewAreaName("");
    setNewAreaPrice(0);
  };

  const cancelNewArea = () => {
    setDraftPolygon([]);
    setShowAreaModal(false);
    setInteractionMode('pan');
    setNewAreaName("");
    setNewAreaPrice(0);
  };

  // Markers Edit Map
  const updateMarkerName = (id: string, name: string) => {
    setMarkers(markers.map(m => m.id === id ? { ...m, name } : m));
  };
  const updateMarkerPrice = (id: string, priceModifier: number) => {
    setMarkers(markers.map(m => m.id === id ? { ...m, priceModifier } : m));
  };
  const removeMarker = (id: string) => {
    setMarkers(markers.filter(m => m.id !== id));
    if (editingMarkerId === id) setEditingMarkerId(null);
  };

  // Area Edit Map
  const toggleBairroActive = (id: string) => {
    setBairros(bairros.map(b => b.id === id ? { ...b, isActive: !b.isActive } : b));
  };
  const removeBairro = (id: string) => {
    setBairros(bairros.filter(b => b.id !== id));
    if (selectedBairro === id) setSelectedBairro(null);
  };

  const handleSaveConfig = async () => {
    try {
      // Apaga todas as zonas existentes e re-insere o estado atual
      const { error: deleteError } = await supabase
        .from('map_zones')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (deleteError) throw deleteError;

      const areasToInsert = bairros.map(b => ({
        type: 'area',
        name: b.name,
        price_modifier: b.basePrice,
        is_active: b.isActive,
        // Persiste o array [[lat,lng],...] do Leaflet directamente no JSONB
        coordinates: b.points
      }));

      const markersToInsert = markers.map(m => ({
        type: 'marker',
        name: m.name,
        price_modifier: m.priceModifier,
        is_active: true,
        coordinates: { lat: m.lat, lng: m.lng }
      }));

      const allZones = [...areasToInsert, ...markersToInsert];
      if (allZones.length > 0) {
        const { error: insertError } = await supabase.from('map_zones').insert(allZones);
        if (insertError) throw insertError;
      }

      // Recarrega IDs gerados pelo Supabase para manter estado sincronizado
      await fetchMapData();
      alert("Configurações salvas na nuvem com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar mapa. Verifique o console.");
    }
  };

  const pinIconHTML = `
    <div class="absolute -translate-x-1/2 -translate-y-1/2 group/marker cursor-move">
      <div class="relative">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-400 filter drop-shadow">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      </div>
    </div>
  `;
  const pinIcon = L.divIcon({ className: 'custom-point-marker', html: pinIconHTML, iconSize: [0, 0] });

  return (
    <div className="space-y-8 text-slate-200 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Configurador de Mapa Geográfico</h1>
          <p className="text-sm text-slate-400">Desenhe perímetros ou adicione pontos usando ferramentas georreferenciadas reais.</p>
        </div>
        <button 
          onClick={handleSaveConfig}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {loading ? 'Carregando...' : 'Salvar Alterações'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Painel Lateral */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <h2 className="text-md font-bold text-white flex items-center gap-2">
              <Hexagon className="w-4 h-4 text-amber-400" /> Bairros e Áreas ({bairros.length})
            </h2>
            <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
              {bairros.map((bairro) => (
                <div 
                  key={bairro.id}
                  onMouseEnter={() => setSelectedBairro(bairro.id)}
                  onMouseLeave={() => setSelectedBairro(null)}
                  className={`p-3 border rounded-xl flex items-center justify-between transition-all ${
                    bairro.isActive 
                      ? "bg-slate-800/40 border-amber-500/40" 
                      : "bg-slate-950/20 border-slate-800 opacity-60"
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-slate-200">{bairro.name}</div>
                    <div className="text-[11px] text-slate-400">Adicional: R$ {bairro.basePrice.toFixed(2)}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => removeBairro(bairro.id)} className="text-slate-500 hover:text-red-400 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <input 
                      type="checkbox"
                      checked={bairro.isActive}
                      onChange={() => toggleBairroActive(bairro.id)}
                      className="w-4 h-4 rounded text-amber-500 bg-slate-950 border-slate-800 focus:ring-0 cursor-pointer"
                    />
                  </div>
                </div>
              ))}
              {bairros.length === 0 && <p className="text-xs text-slate-500 py-2">Nenhuma área demarcada.</p>}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
            <h3 className="text-md font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" /> Pontos Específicos ({markers.length})
            </h3>
            <div className="max-h-[250px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {markers.map((m) => (
                <div key={m.id} className="bg-slate-950/40 p-2.5 border border-slate-800 rounded-lg flex items-center justify-between text-xs">
                  <div>
                    <div className="font-medium text-slate-200 truncate max-w-[150px]">{m.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">R$ {m.priceModifier}</div>
                  </div>
                  <button onClick={() => removeMarker(m.id)} className="text-slate-500 hover:text-red-400 transition-colors p-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {markers.length === 0 && <p className="text-xs text-slate-500 py-2">Nenhum ponto marcado.</p>}
            </div>
          </div>
        </div>

        {/* Mapa Viewport */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-4 relative shadow-2xl">
          <div className="text-xs text-slate-400 mb-3 flex items-center justify-between px-2">
            <span>Editor Geográfico - Caldas Novas</span>
            <div className="flex items-center gap-2">
              {interactionMode === 'polygon' && draftPolygon.length > 0 && (
                 <span className="text-amber-400 font-mono text-[10px] animate-pulse">Desenhando... ({draftPolygon.length} vértices)</span>
              )}
              <span className="text-[10px] text-slate-500 font-mono bg-slate-800 px-2 py-0.5 rounded">
                Modo: {interactionMode.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="w-full h-[380px] sm:h-[450px] md:h-[520px] lg:h-[600px] bg-slate-950 rounded-2xl relative overflow-hidden border border-slate-800 z-10">
            <MapContainer 
              center={[-17.744, -48.625]} 
              zoom={14} 
              style={{ width: '100%', height: '100%', zIndex: 0, cursor: interactionMode === 'pan' ? 'grab' : 'crosshair' }}
              zoomControl={false}
              attributionControl={false}
            >
              <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png" />
              <MapController mode={interactionMode} onModeChange={setInteractionMode} />
              <MapEventsHandler mode={interactionMode} onMapClick={handleMapClick} setMode={setInteractionMode} />

              {/* Rascunho do Polígono */}
              {draftPolygon.length > 0 && (
                <>
                  <Polyline positions={draftPolygon} pathOptions={{ color: '#fbbf24', weight: 2, dashArray: '5, 5' }} />
                  {draftPolygon.length >= 3 && (
                    <Polygon positions={draftPolygon} pathOptions={{ color: '#fbbf24', fillColor: '#fbbf24', fillOpacity: 0.2, weight: 0 }} />
                  )}
                  {draftPolygon.map((pt, i) => (
                    <Marker key={i} position={pt} icon={L.divIcon({ className: '', html: '<div class="w-2 h-2 bg-amber-400 rounded-full -translate-x-1 -translate-y-1"></div>', iconSize: [0,0]})} />
                  ))}
                </>
              )}

              {/* Polígonos Salvos */}
              {bairros.map((bairro) => (
                <Polygon
                  key={bairro.id}
                  positions={bairro.points}
                  pathOptions={{
                    color: bairro.isActive ? (selectedBairro === bairro.id ? '#4f46e5' : '#6366f1') : '#ef4444',
                    weight: selectedBairro === bairro.id ? 3 : 2,
                    fillColor: bairro.isActive ? '#4f46e5' : '#ef4444',
                    fillOpacity: bairro.isActive ? (selectedBairro === bairro.id ? 0.4 : 0.15) : 0.05,
                    dashArray: bairro.isActive ? undefined : '5, 5'
                  }}
                  eventHandlers={{
                    mouseover: () => setSelectedBairro(bairro.id),
                    mouseout: () => setSelectedBairro(null)
                  }}
                />
              ))}

              {/* Marcadores Salvos */}
              {markers.map((marker) => (
                <Marker
                  key={marker.id}
                  position={[marker.lat, marker.lng]}
                  icon={pinIcon}
                  draggable={interactionMode === 'pan'}
                  eventHandlers={{
                    dragend: (e) => {
                      const m = e.target;
                      const pos = m.getLatLng();
                      setMarkers(prev => prev.map(mk => mk.id === marker.id ? { ...mk, lat: pos.lat, lng: pos.lng } : mk));
                    },
                    click: (e) => {
                      L.DomEvent.stopPropagation(e as any);
                      if (interactionMode === 'pan') {
                         setEditingMarkerId(marker.id);
                      }
                    }
                  }}
                />
              ))}
            </MapContainer>

            {/* Float Button for finishing Polygon */}
            {interactionMode === 'polygon' && draftPolygon.length >= 3 && !showAreaModal && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[500]">
                <button 
                  onClick={handleFinishPolygon}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-6 py-3 rounded-full font-bold shadow-[0_0_30px_rgba(245,158,11,0.4)] flex items-center gap-2 transition-all"
                >
                  <Check className="w-5 h-5" />
                  Finalizar Área
                </button>
              </div>
            )}

            {/* Modal para Nomear e Precificar Nova Área */}
            {showAreaModal && (
              <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm z-[600] flex items-center justify-center">
                <div className="bg-slate-900 border border-slate-700/60 rounded-2xl p-6 w-[320px] shadow-2xl">
                  <h3 className="text-lg font-bold text-white mb-4">Salvar Nova Área</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs uppercase tracking-wider text-slate-400 font-bold block mb-1.5">Nome do Bairro/Área</label>
                      <input 
                        type="text" 
                        value={newAreaName}
                        onChange={e => setNewAreaName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                        placeholder="Ex: Setor Bandeirantes"
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-wider text-slate-400 font-bold block mb-1.5">Adicional Logístico (R$)</label>
                      <input 
                        type="number" 
                        value={newAreaPrice}
                        onChange={e => setNewAreaPrice(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                        placeholder="Ex: 50"
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button 
                        onClick={cancelNewArea}
                        className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-bold transition-all"
                      >
                        Cancelar
                      </button>
                      <button 
                        onClick={saveNewArea}
                        className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-lg text-sm font-bold transition-all"
                      >
                        Salvar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Popover/Input de Edição de Nome do Marker flutuante */}
            {editingMarkerId && (() => {
              const marker = markers.find(m => m.id === editingMarkerId);
              if (!marker) return null;
              return (
                <div 
                  className="absolute z-[500] bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-2xl w-[280px] space-y-4" 
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Editar Ponto Específico</span>
                    <button onClick={() => setEditingMarkerId(null)} className="text-slate-500 hover:text-slate-300">×</button>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">Nome do Local</label>
                    <input
                      type="text"
                      value={marker.name}
                      onChange={(e) => updateMarkerName(marker.id, e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">Adicional (R$)</label>
                    <input
                      type="number"
                      value={marker.priceModifier}
                      onChange={(e) => updateMarkerPrice(marker.id, Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
