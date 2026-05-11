import React from 'react';
import { Printer, MapPin, Ruler, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Plan2DViewer from '@/components/viewers/Plan2DViewer';
import type { Variant } from '@/types/solver';

interface PlansViewerProps {
  project: any;
  variant?: Variant;
}

const PlansViewer: React.FC<PlansViewerProps> = ({ project, variant }) => {
  const handlePrint = () => window.print();

  const totalSurface = (project?.brief?.rooms || []).reduce(
    (s: number, r: any) => s + (r.surface || 0),
    0
  );

  const projectName = project?.name || 'Projet';
  const parcelWidth = variant?.footprint?.width || 25;
  const parcelDepth = variant?.footprint?.depth || 30;
  const buildableWidth = variant?.footprint?.buildableWidth || parcelWidth - 6;
  const buildableDepth = variant?.footprint?.buildableDepth || parcelDepth - 7;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between no-print">
        <h3 className="font-semibold text-lg">Plans architecturaux</h3>
        <Button onClick={handlePrint} variant="outline" size="sm">
          <Printer size={14} className="mr-1" /> Imprimer / PDF
        </Button>
      </div>

      <div className="plans-form bg-white border border-slate-200 p-6 max-w-5xl mx-auto text-sm print:p-0 print:border-0 space-y-8">
        {/* En-tête plans */}
        <div className="text-center border-b-2 border-slate-800 pb-4 mb-6">
          <h2 className="text-xl font-bold uppercase">Plans Architecturaux</h2>
          <p className="text-sm text-slate-600 mt-1">{projectName}</p>
          <p className="text-xs text-slate-500 mt-1">
            Échelle 1:100 — {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>

        {/* 1. Plan de situation */}
        <section className="mb-8 page-break-inside-avoid">
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={16} className="text-slate-600" />
            <h4 className="font-bold text-base">Plan de situation</h4>
          </div>
          <div className="border-2 border-slate-300 rounded bg-slate-50 h-64 flex items-center justify-center relative overflow-hidden">
            {/* Grille stylisée */}
            <div className="absolute inset-0 opacity-10">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={`v${i}`} className="absolute top-0 bottom-0 border-l border-slate-400" style={{ left: `${i * 5}%` }} />
              ))}
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={`h${i}`} className="absolute left-0 right-0 border-t border-slate-400" style={{ top: `${i * 10}%` }} />
              ))}
            </div>
            {/* Parcelle sur plan de situation */}
            <div className="relative">
              <div
                className="border-2 border-dashed border-slate-400 bg-white/80 flex items-center justify-center"
                style={{ width: 120, height: 160 }}
              >
                <div className="border-2 border-blue-600 bg-blue-100 flex items-center justify-center" style={{ width: 60, height: 40 }}>
                  <span className="text-[8px] font-mono text-blue-800">BÂTIMENT</span>
                </div>
              </div>
              <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] text-slate-500 whitespace-nowrap">
                {project?.parcel_address}
              </span>
              {/* Routes */}
              <div className="absolute -top-4 left-0 right-0 h-3 bg-slate-300 flex items-center justify-center">
                <span className="text-[7px] text-slate-600">Rue de Paris</span>
              </div>
              <div className="absolute top-0 -right-5 bottom-0 w-3 bg-slate-200">
                <span className="text-[7px] text-slate-600 rotate-90 inline-block mt-8">Allée</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Situation cadastrale : section AB, parcelle n° {project?.parcel_cadastre_id || '0123'} — {project?.commune_name}
          </p>
        </section>

        {/* 2. Plan de masse */}
        <section className="mb-8 page-break-inside-avoid">
          <div className="flex items-center gap-2 mb-3">
            <Layers size={16} className="text-slate-600" />
            <h4 className="font-bold text-base">Plan de masse</h4>
          </div>
          <div className="border-2 border-slate-300 rounded bg-white p-4 flex items-center justify-center">
            <svg viewBox="0 0 500 400" className="w-full max-w-lg">
              {/* Parcelle */}
              <rect x={50} y={30} width={400} height={340} fill="#f8fafc" stroke="#334155" strokeWidth={2} strokeDasharray="8 4" />
              <text x={60} y={50} fontSize={11} fill="#64748b" fontWeight={600}>PARCELLE</text>
              <text x={60} y={65} fontSize={9} fill="#94a3b8">{parcelWidth}m × {parcelDepth}m</text>

              {/* Limites de propriété */}
              <line x1={50} y1={30} x2={50} y2={370} stroke="#ef4444" strokeWidth={1} strokeDasharray="4 2" />
              <text x={25} y={200} fontSize={8} fill="#ef4444" transform="rotate(-90, 25, 200)">Limite</text>
              <line x1={450} y1={30} x2={450} y2={370} stroke="#ef4444" strokeWidth={1} strokeDasharray="4 2" />
              <text x={470} y={200} fontSize={8} fill="#ef4444" transform="rotate(90, 470, 200)">Limite</text>

              {/* Voie publique */}
              <rect x={50} y={5} width={400} height={25} fill="#e2e8f0" stroke="#94a3b8" strokeWidth={1} />
              <text x={250} y={22} fontSize={9} fill="#64748b" textAnchor="middle">VOIE PUBLIQUE</text>

              {/* Reculs */}
              <text x={200} y={105} fontSize={8} fill="#059669">Recul voie : 4.0m</text>
              <text x={320} y={220} fontSize={8} fill="#059669" transform="rotate(90, 320, 220)">Recul lat. : 2.5m</text>

              {/* Zone constructible */}
              <rect x={90} y={110} width={320} height={240} fill="#ecfdf5" stroke="#22c55e" strokeWidth={1.5} strokeDasharray="4 2" />
              <text x={100} y={125} fontSize={9} fill="#16a34a">Zone constructible</text>
              <text x={100} y={138} fontSize={8} fill="#16a34a">{buildableWidth}m × {buildableDepth}m</text>

              {/* Bâtiment */}
              <rect x={130} y={150} width={200} height={100} fill="#dbeafe" stroke="#2563eb" strokeWidth={2} />
              <text x={230} y={195} fontSize={11} fill="#1e40af" textAnchor="middle" fontWeight={600}>BÂTIMENT</text>
              <text x={230} y={210} fontSize={9} fill="#1e40af" textAnchor="middle">~{totalSurface || project?.surface_approx || 25} m²</text>

              {/* Dimensions bâtiment */}
              <line x1={130} y1={260} x2={330} y2={260} stroke="#64748b" strokeWidth={1} markerStart="url(#arrow)" markerEnd="url(#arrow)" />
              <text x={230} y={275} fontSize={9} fill="#64748b" textAnchor="middle">~{(buildableWidth * 0.625).toFixed(1)}m</text>

              <line x1={340} y1={150} x2={340} y2={250} stroke="#64748b" strokeWidth={1} />
              <text x={355} y={205} fontSize={9} fill="#64748b" transform="rotate(90, 355, 205)">~{(buildableDepth * 0.417).toFixed(1)}m</text>

              {/* Orientation */}
              <circle cx={430} cy={330} r={18} fill="white" stroke="#64748b" strokeWidth={1} />
              <text x={430} y={325} fontSize={10} fill="#64748b" textAnchor="middle" fontWeight={600}>N</text>
              <line x1={430} y1={335} x2={430} y2={345} stroke="#ef4444" strokeWidth={2} markerEnd="url(#arrowN)" />
            </svg>
          </div>
          <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 bg-[#f8fafc] border border-dashed border-slate-600" /> Parcelle</span>
            <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 bg-[#ecfdf5] border border-dashed border-green-500" /> Zone constructible</span>
            <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 bg-[#dbeafe] border border-blue-600" /> Bâtiment projeté</span>
            <span className="flex items-center gap-1"><span className="inline-block w-3 h-0.5 bg-red-500" /> Limite de propriété</span>
          </div>
        </section>

        {/* 3. Plan de niveau RDC */}
        <section className="mb-8 page-break-inside-avoid">
          <div className="flex items-center gap-2 mb-3">
            <Layers size={16} className="text-slate-600" />
            <h4 className="font-bold text-base">Plan de niveau — Rez-de-chaussée</h4>
          </div>
          <Plan2DViewer
            variant={variant}
            width={700}
            height={500}
          />
          <p className="text-xs text-slate-500 mt-2">
            Échelle 1:100 — Surface totale RDC : {totalSurface || project?.surface_approx || 25} m²
          </p>
        </section>

        {/* 4. Coupe transversale */}
        <section className="mb-8 page-break-inside-avoid">
          <div className="flex items-center gap-2 mb-3">
            <Ruler size={16} className="text-slate-600" />
            <h4 className="font-bold text-base">Coupe transversale BB&apos;</h4>
          </div>
          <div className="border-2 border-slate-300 rounded bg-white p-4 flex items-center justify-center">
            <svg viewBox="0 0 600 300" className="w-full max-w-2xl">
              {/* Sol */}
              <rect x={0} y={260} width={600} height={40} fill="#e2e8f0" stroke="#94a3b8" strokeWidth={1} />
              <line x1={0} y1={260} x2={600} y2={260} stroke="#64748b" strokeWidth={2} />
              <text x={300} y={285} fontSize={10} fill="#64748b" textAnchor="middle">Niveau de sol naturel (NGL +0.00)</text>

              {/* Hachures sol */}
              {Array.from({ length: 30 }).map((_, i) => (
                <line key={i} x1={i * 22} y1={265} x2={(i * 22) + 15} y2={295} stroke="#cbd5e1" strokeWidth={1} />
              ))}

              {/* Fondations */}
              <rect x={120} y={250} width={20} height={10} fill="#94a3b8" stroke="#475569" strokeWidth={1} />
              <rect x={460} y={250} width={20} height={10} fill="#94a3b8" stroke="#475569" strokeWidth={1} />
              <line x1={130} y1={250} x2={130} y2={200} stroke="#64748b" strokeWidth={8} strokeLinecap="round" />
              <line x1={470} y1={250} x2={470} y2={200} stroke="#64748b" strokeWidth={8} strokeLinecap="round" />

              {/* Dalle */}
              <rect x={120} y={195} width={360} height={10} fill="#cbd5e1" stroke="#475569" strokeWidth={1} />
              <text x={300} y={203} fontSize={8} fill="#475569" textAnchor="middle">Dalle bois CTBH 22mm + solives</text>

              {/* Murs */}
              <rect x={120} y={80} width={15} height={115} fill="#fde68a" stroke="#d97706" strokeWidth={1} />
              <rect x={455} y={80} width={15} height={115} fill="#fde68a" stroke="#d97706" strokeWidth={1} />
              <rect x={280} y={80} width={12} height={115} fill="#fde68a" stroke="#d97706" strokeWidth={1} />

              {/* Laine de bois */}
              <rect x={135} y={80} width={8} height={115} fill="#fecaca" stroke="#ef4444" strokeWidth={0.5} opacity={0.6} />
              <rect x={440} y={80} width={8} height={115} fill="#fecaca" stroke="#ef4444" strokeWidth={0.5} opacity={0.6} />

              {/* Charpente */}
              <polygon points="110,80 300,10 490,80" fill="#e2e8f0" stroke="#475569" strokeWidth={1.5} />
              <line x1={300} y1={10} x2={300} y2={80} stroke="#475569" strokeWidth={1} />
              <line x1={205} y1={45} x2={205} y2={80} stroke="#475569" strokeWidth={1} />
              <line x1={395} y1={45} x2={395} y2={80} stroke="#475569" strokeWidth={1} />

              {/* Faitage */}
              <text x={300} y={8} fontSize={8} fill="#475569" textAnchor="middle">Faitère</text>

              {/* Porte */}
              <rect x={455} y={125} width={2} height={55} fill="#60a5fa" />
              <rect x={457} y={125} width={30} height={55} fill="none" stroke="#3b82f6" strokeWidth={1} />
              <line x1={457} y1={180} x2={472} y2={125} stroke="#3b82f6" strokeWidth={1} strokeDasharray="2 2" />
              <text x={475} y={155} fontSize={8} fill="#3b82f6">Porte</text>

              {/* Fenêtre */}
              <rect x={165} y={130} width={50} height={35} fill="#bfdbfe" stroke="#3b82f6" strokeWidth={1} />
              <text x={190} y="150" fontSize={8} fill="#1e40af" textAnchor="middle">Fenêtre</text>

              {/* Cotes */}
              <line x1={110} y1={10} x2={110} y2={260} stroke="#64748b" strokeWidth={1} />
              <line x1={105} y1={10} x2={115} y2={10} stroke="#64748b" strokeWidth={1} />
              <line x1={105} y1={260} x2={115} y2={260} stroke="#64748b" strokeWidth={1} />
              <text x={95} y={140} fontSize={9} fill="#64748b" textAnchor="middle" transform="rotate(-90, 95, 140)">Hauteur totale : 5.50m</text>

              <line x1={120} y1={80} x2={120} y2={260} stroke="#059669" strokeWidth={0.5} strokeDasharray="3 2" />
              <line x1={115} y1={80} x2={125} y2={80} stroke="#059669" strokeWidth={1} />
              <text x={100} y={175} fontSize={9} fill="#059669" textAnchor="middle" transform="rotate(-90, 100, 175)">Hauteur façade : 3.50m</text>

              {/* Intérieur */}
              <text x={220} y={160} fontSize={10} fill="#475569">H = 2.70m sous plafond</text>
              <text x={350} y={160} fontSize={10} fill="#475569">RDC</text>

              {/* Légende coupe */}
              <rect x={520} y={20} width={70} height={120} fill="white" stroke="#cbd5e1" strokeWidth={1} rx={4} />
              <text x={525} y={35} fontSize={9} fill="#475569" fontWeight={600}>Légende</text>
              <rect x={525} y={42} width={12} height={8} fill="#fde68a" stroke="#d97706" strokeWidth={0.5} />
              <text x={542} y={50} fontSize={8} fill="#475569">Ossature bois</text>
              <rect x={525} y={56} width={12} height={8} fill="#fecaca" stroke="#ef4444" strokeWidth={0.5} />
              <text x={542} y={64} fontSize={8} fill="#475569">Isolation</text>
              <rect x={525} y={70} width={12} height={8} fill="#e2e8f0" stroke="#475569" strokeWidth={0.5} />
              <text x={542} y={78} fontSize={8} fill="#475569">Couverture</text>
              <rect x={525} y={84} width={12} height={8} fill="#cbd5e1" stroke="#475569" strokeWidth={0.5} />
              <text x={542} y={92} fontSize={8} fill="#475569">Dalle</text>
              <line x1={525} y1={100} x2={537} y2={100} stroke="#64748b" strokeWidth={3} strokeLinecap="round" />
              <text x={542} y={104} fontSize={8} fill="#475569">Poteau</text>
            </svg>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Coupe transversale BB&apos; — Hauteur sous gouttière : 3.50m — Hauteur totale : 5.50m — Pente de toiture : 35°
          </p>
        </section>

        {/* 5. Légende et échelle */}
        <section className="mb-6 page-break-inside-avoid">
          <h4 className="font-bold text-base mb-3">Légende et échelle</h4>
          <div className="grid grid-cols-2 gap-6">
            <div className="border border-slate-200 rounded p-4">
              <p className="text-xs font-semibold text-slate-600 mb-2">Symboles</p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 bg-blue-100 border border-blue-600" />
                  <span>Mur extérieur porteur</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 bg-yellow-100 border border-yellow-600" />
                  <span>Ossature bois</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 bg-blue-200 border border-blue-400" />
                  <span>Ouverture (porte / fenêtre)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 bg-slate-100 border border-slate-400" />
                  <span>Zone non constructible</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-4 h-0.5 bg-red-500" />
                  <span>Limite de propriété</span>
                </div>
              </div>
            </div>
            <div className="border border-slate-200 rounded p-4">
              <p className="text-xs font-semibold text-slate-600 mb-2">Échelle 1:100</p>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    <div className="h-2 border-l border-r border-t border-slate-600" style={{ width: 100 }}>
                      <div className="text-center -mt-4">
                        <span className="text-[10px] text-slate-600">1m</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    <div className="h-2 border-l border-r border-t border-slate-600" style={{ width: 50 }}>
                      <div className="text-center -mt-4">
                        <span className="text-[10px] text-slate-600">50cm</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    <div className="h-2 border-l border-r border-t border-slate-600" style={{ width: 25 }}>
                      <div className="text-center -mt-4">
                        <span className="text-[10px] text-slate-600">25cm</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-4">
                Toutes les cotes sont indiquées en mètres. 1cm sur plan = 1m réel.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="border-t border-slate-300 pt-4 mt-6 text-center text-xs text-slate-500">
          <p>Plans architecturaux générés par EDIFIA — {new Date().toLocaleDateString('fr-FR')}</p>
          <p>À l&apos;échelle 1:100 — Vérifier les cotes sur site avant construction.</p>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          .plans-form { border: none !important; padding: 0 !important; }
          .page-break-inside-avoid { page-break-inside: avoid; }
        }
      `}</style>
    </div>
  );
};

export default PlansViewer;
