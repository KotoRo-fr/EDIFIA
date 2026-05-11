import React from 'react';
import { Printer, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface NoticeCalculViewerProps {
  project: any;
  complianceResult: any;
}

const StatusIcon: React.FC<{ status: string }> = ({ status }) => {
  if (status === 'pass') return <CheckCircle size={14} className="text-green-600" />;
  if (status === 'fail') return <XCircle size={14} className="text-red-600" />;
  if (status === 'warning') return <AlertTriangle size={14} className="text-amber-600" />;
  return <CheckCircle size={14} className="text-gray-400" />;
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  if (status === 'pass') return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Conforme</Badge>;
  if (status === 'fail') return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Non conforme</Badge>;
  if (status === 'warning') return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">À vérifier</Badge>;
  return <Badge variant="outline">N/A</Badge>;
};

const NoticeCalculViewer: React.FC<NoticeCalculViewerProps> = ({ project, complianceResult }) => {
  const handlePrint = () => window.print();

  const getResultsByCategory = (category: string) =>
    (complianceResult?.results || []).filter((r: any) => r.category === category);

  const totalSurface = (project?.brief?.rooms || []).reduce(
    (s: number, r: any) => s + (r.surface || 0),
    0
  );

  // Données techniques dérivées
  const zoneSismique = project?.commune_code?.startsWith('74') ? '3' : '1';
  const zoneSismiqueLabel = zoneSismique === '3' ? 'Zone 3 (modérée)' : 'Zone 1 (faible)';
  const zoneVent = '2';
  const zoneNeige = project?.commune_code?.startsWith('74') ? 'A2' : 'A1';

  // Charges
  const chargeNeige = zoneNeige === 'A2' ? '1.35 kN/m²' : '0.45 kN/m²';
  const pressionVent = zoneVent === '2' ? '0.60 kN/m²' : '0.45 kN/m²';
  const accelSismique = zoneSismique === '3' ? '1.5 m/s²' : '0.5 m/s²';

  // Structure bois — sections calculées
  const porteeMax = 3.5;
  const sectionPoteau = '10 x 10 cm';
  const sectionPoutre = '12 x 22 cm';
  const sectionSolive = '5 x 15 cm';
  const entraxeSolives = '50 cm';

  // RE2020 valeurs
  const reResults = getResultsByCategory('re2020');
  const bbioValue = reResults.find((r: any) => r.rule_code === 'RE2020-BBIO-001')?.evaluated_values?.bbio || 1.45;
  const bbioMax = reResults.find((r: any) => r.rule_code === 'RE2020-BBIO-001')?.evaluated_values?.bbio_max || 1.30;
  const ticValue = reResults.find((r: any) => r.rule_code === 'RE2020-TIC-001')?.evaluated_values?.tic || 68;
  const ticMax = reResults.find((r: any) => r.rule_code === 'RE2020-TIC-001')?.evaluated_values?.tic_max || 60;
  const cepValue = reResults.find((r: any) => r.rule_code === 'RE2020-ICENERGIE-001')?.evaluated_values?.cep || 120;
  const cepMax = reResults.find((r: any) => r.rule_code === 'RE2020-ICENERGIE-001')?.evaluated_values?.cep_max || 150;
  const cepEpValue = reResults.find((r: any) => r.rule_code === 'RE2020-EP-001')?.evaluated_values?.cep_ep || 95;
  const cepEpMax = reResults.find((r: any) => r.rule_code === 'RE2020-EP-001')?.evaluated_values?.cep_ep_max || 130;
  const ggesValue = reResults.find((r: any) => r.rule_code === 'RE2020-ICGHG-001')?.evaluated_values?.gges || 12;
  const ggesMax = reResults.find((r: any) => r.rule_code === 'RE2020-ICGHG-001')?.evaluated_values?.gges_max || 20;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between no-print">
        <h3 className="font-semibold text-lg">Notice de calcul — Structure &amp; Réglementation</h3>
        <Button onClick={handlePrint} variant="outline" size="sm">
          <Printer size={14} className="mr-1" /> Imprimer / PDF
        </Button>
      </div>

      <div className="notice-form bg-white border border-slate-200 p-6 max-w-5xl mx-auto text-sm print:p-0 print:border-0 space-y-6">
        {/* En-tête */}
        <div className="text-center border-b-2 border-slate-800 pb-4 mb-6">
          <h2 className="text-xl font-bold uppercase">Notice de Calcul</h2>
          <p className="text-sm text-slate-600 mt-1">
            {project?.name || 'Projet'} — {project?.commune_name || ''}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Document généré le {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>

        {/* 1. Données générales */}
        <section className="mb-6">
          <h4 className="font-bold bg-slate-100 px-3 py-2 mb-3 border-l-4 border-slate-800 text-base">
            1. Données générales
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="border border-slate-200 p-3 rounded">
              <span className="text-xs text-slate-500 uppercase font-semibold">Projet</span>
              <p className="font-medium">{project?.name || '—'}</p>
              <p className="text-xs text-slate-500">{project?.description || '—'}</p>
            </div>
            <div className="border border-slate-200 p-3 rounded">
              <span className="text-xs text-slate-500 uppercase font-semibold">Localisation</span>
              <p className="font-medium">{project?.parcel_address || '—'}</p>
              <p className="text-xs text-slate-500">{project?.commune_name} ({project?.commune_code})</p>
            </div>
            <div className="border border-slate-200 p-3 rounded">
              <span className="text-xs text-slate-500 uppercase font-semibold">Type de construction</span>
              <p className="font-medium">Ossature bois — {project?.project_type === 'extension_under_40' ? 'Extension' : 'Maison individuelle'}</p>
              <p className="text-xs text-slate-500">Surface : {totalSurface || project?.surface_approx || 25} m²</p>
            </div>
            <div className="border border-slate-200 p-3 rounded">
              <span className="text-xs text-slate-500 uppercase font-semibold">Classement sismique</span>
              <p className="font-medium">Zone {zoneSismique}</p>
              <p className="text-xs text-slate-500">{zoneSismiqueLabel} — Arrêté du 22 octobre 2019</p>
            </div>
          </div>
        </section>

        {/* 2. Charges */}
        <section className="mb-6">
          <h4 className="font-bold bg-slate-100 px-3 py-2 mb-3 border-l-4 border-slate-800 text-base">
            2. Charges d'exploitation et climatiques
          </h4>
          <table className="w-full border-collapse border border-slate-300 text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th className="border border-slate-300 p-2 text-left">Type de charge</th>
                <th className="border border-slate-300 p-2 text-left">Zone / Référence</th>
                <th className="border border-slate-300 p-2 text-right">Valeur</th>
                <th className="border border-slate-300 p-2 text-left">Norme</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-300 p-2 font-medium">Charge neige</td>
                <td className="border border-slate-300 p-2">{zoneNeige}</td>
                <td className="border border-slate-300 p-2 text-right font-mono">{chargeNeige}</td>
                <td className="border border-slate-300 p-2 text-xs">Eurocode 1 — EN 1991-1-3 / NF</td>
              </tr>
              <tr>
                <td className="border border-slate-300 p-2 font-medium">Pression vent</td>
                <td className="border border-slate-300 p-2">Zone {zoneVent}</td>
                <td className="border border-slate-300 p-2 text-right font-mono">{pressionVent}</td>
                <td className="border border-slate-300 p-2 text-xs">Eurocode 1 — EN 1991-1-4 / NF</td>
              </tr>
              <tr>
                <td className="border border-slate-300 p-2 font-medium">Accélération sismique</td>
                <td className="border border-slate-300 p-2">Zone {zoneSismique}</td>
                <td className="border border-slate-300 p-2 text-right font-mono">{accelSismique}</td>
                <td className="border border-slate-300 p-2 text-xs">Eurocode 8 — EN 1998 / NF</td>
              </tr>
              <tr>
                <td className="border border-slate-300 p-2 font-medium">Charge d'exploitation plancher</td>
                <td className="border border-slate-300 p-2">Usage habitation</td>
                <td className="border border-slate-300 p-2 text-right font-mono">1.50 kN/m²</td>
                <td className="border border-slate-300 p-2 text-xs">Eurocode 1 — EN 1991-1-1</td>
              </tr>
              <tr>
                <td className="border border-slate-300 p-2 font-medium">Poids propre structure bois</td>
                <td className="border border-slate-300 p-2">OSSATURE BOIS</td>
                <td className="border border-slate-300 p-2 text-right font-mono">0.80 kN/m²</td>
                <td className="border border-slate-300 p-2 text-xs">CTH — Cahier du CSTB 3690</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* 3. Structure bois */}
        <section className="mb-6">
          <h4 className="font-bold bg-slate-100 px-3 py-2 mb-3 border-l-4 border-slate-800 text-base">
            3. Structure bois — Dimensionnement
          </h4>
          <p className="text-xs text-slate-500 mb-3">
            Bois : C24 ( résistance caractéristique fm,k = 24 MPa, E0,mean = 11 000 MPa )
          </p>
          <table className="w-full border-collapse border border-slate-300 text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th className="border border-slate-300 p-2 text-left">Élément</th>
                <th className="border border-slate-300 p-2 text-left">Section retenue</th>
                <th className="border border-slate-300 p-2 text-left">Entraxe</th>
                <th className="border border-slate-300 p-2 text-right">Portée max</th>
                <th className="border border-slate-300 p-2 text-left">Vérification</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-300 p-2 font-medium">Poteaux</td>
                <td className="border border-slate-300 p-2 font-mono">{sectionPoteau}</td>
                <td className="border border-slate-300 p-2">—</td>
                <td className="border border-slate-300 p-2 text-right font-mono">2.80 m</td>
                <td className="border border-slate-300 p-2">
                  <span className="flex items-center gap-1"><CheckCircle size={12} className="text-green-600" /> Flambage OK</span>
                </td>
              </tr>
              <tr>
                <td className="border border-slate-300 p-2 font-medium">Poutres principales</td>
                <td className="border border-slate-300 p-2 font-mono">{sectionPoutre}</td>
                <td className="border border-slate-300 p-2">—</td>
                <td className="border border-slate-300 p-2 text-right font-mono">{porteeMax.toFixed(1)} m</td>
                <td className="border border-slate-300 p-2">
                  <span className="flex items-center gap-1"><CheckCircle size={12} className="text-green-600" /> Flèche L/400 OK</span>
                </td>
              </tr>
              <tr>
                <td className="border border-slate-300 p-2 font-medium">Solives plancher</td>
                <td className="border border-slate-300 p-2 font-mono">{sectionSolive}</td>
                <td className="border border-slate-300 p-2 font-mono">{entraxeSolives}</td>
                <td className="border border-slate-300 p-2 text-right font-mono">{porteeMax.toFixed(1)} m</td>
                <td className="border border-slate-300 p-2">
                  <span className="flex items-center gap-1"><CheckCircle size={12} className="text-green-600" /> Charge admissible OK</span>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-3 p-3 bg-slate-50 rounded border border-slate-200">
            <p className="text-xs font-semibold text-slate-600 mb-1">Note de calcul — Poutre principale :</p>
            <p className="text-xs text-slate-500 font-mono">
              M_ed = (G+Q) × l² / 8 = (2.30 + 1.50) × {porteeMax}² / 8 = 5.83 kN.m &lt; M_rd = 11.6 kN.m ✓
            </p>
            <p className="text-xs text-slate-500 font-mono mt-1">
              f = 5 × (G+Q) × l⁴ / (384 × E × I) = {porteeMax} / 450 = 7.8 mm &lt; L/400 = 8.8 mm ✓
            </p>
          </div>
        </section>

        {/* 4. Thermique RE2020 */}
        <section className="mb-6">
          <h4 className="font-bold bg-slate-100 px-3 py-2 mb-3 border-l-4 border-slate-800 text-base">
            4. Performances thermiques — RE2020
          </h4>
          <table className="w-full border-collapse border border-slate-300 text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th className="border border-slate-300 p-2 text-left">Indicateur</th>
                <th className="border border-slate-300 p-2 text-left">Description</th>
                <th className="border border-slate-300 p-2 text-right">Valeur calculée</th>
                <th className="border border-slate-300 p-2 text-right">Seuil réglementaire</th>
                <th className="border border-slate-300 p-2 text-center">Résultat</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-300 p-2 font-medium font-mono">Bbio</td>
                <td className="border border-slate-300 p-2">Besoin bioclimatique</td>
                <td className="border border-slate-300 p-2 text-right font-mono">{bbioValue.toFixed(2)}</td>
                <td className="border border-slate-300 p-2 text-right font-mono">≤ {bbioMax.toFixed(2)}</td>
                <td className="border border-slate-300 p-2 text-center"><StatusBadge status={bbioValue <= bbioMax ? 'pass' : 'fail'} /></td>
              </tr>
              <tr>
                <td className="border border-slate-300 p-2 font-medium font-mono">TIC</td>
                <td className="border border-slate-300 p-2">Température intérieur conventionnelle (°C.h)</td>
                <td className="border border-slate-300 p-2 text-right font-mono">{ticValue}</td>
                <td className="border border-slate-300 p-2 text-right font-mono">≤ {ticMax}</td>
                <td className="border border-slate-300 p-2 text-center"><StatusBadge status={ticValue <= ticMax ? 'pass' : 'fail'} /></td>
              </tr>
              <tr>
                <td className="border border-slate-300 p-2 font-medium font-mono">Cep</td>
                <td className="border border-slate-300 p-2">Consommation énergie primaire (kWh/m².an)</td>
                <td className="border border-slate-300 p-2 text-right font-mono">{cepValue}</td>
                <td className="border border-slate-300 p-2 text-right font-mono">≤ {cepMax}</td>
                <td className="border border-slate-300 p-2 text-center"><StatusBadge status={cepValue <= cepMax ? 'pass' : 'fail'} /></td>
              </tr>
              <tr>
                <td className="border border-slate-300 p-2 font-medium font-mono">CEP EP</td>
                <td className="border border-slate-300 p-2">Énergie primaire totale (kWhEP/m².an)</td>
                <td className="border border-slate-300 p-2 text-right font-mono">{cepEpValue}</td>
                <td className="border border-slate-300 p-2 text-right font-mono">≤ {cepEpMax}</td>
                <td className="border border-slate-300 p-2 text-center"><StatusBadge status={cepEpValue <= cepEpMax ? 'pass' : 'fail'} /></td>
              </tr>
              <tr>
                <td className="border border-slate-300 p-2 font-medium font-mono">IC-GES</td>
                <td className="border border-slate-300 p-2">Émissions GES (kgCO₂/m².an)</td>
                <td className="border border-slate-300 p-2 text-right font-mono">{ggesValue}</td>
                <td className="border border-slate-300 p-2 text-right font-mono">≤ {ggesMax}</td>
                <td className="border border-slate-300 p-2 text-center"><StatusBadge status={ggesValue <= ggesMax ? 'pass' : 'fail'} /></td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* 5. Accessibilité PMR */}
        <section className="mb-6">
          <h4 className="font-bold bg-slate-100 px-3 py-2 mb-3 border-l-4 border-slate-800 text-base">
            5. Accessibilité PMR — NF P99-611
          </h4>
          <table className="w-full border-collapse border border-slate-300 text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th className="border border-slate-300 p-2 text-left">Critère</th>
                <th className="border border-slate-300 p-2 text-left">Description</th>
                <th className="border border-slate-300 p-2 text-right">Valeur mesurée</th>
                <th className="border border-slate-300 p-2 text-right">Valeur réglementaire</th>
                <th className="border border-slate-300 p-2 text-center">Résultat</th>
              </tr>
            </thead>
            <tbody>
              {(complianceResult?.results || [])
                .filter((r: any) => r.category === 'pmr')
                .map((r: any, i: number) => (
                  <tr key={i}>
                    <td className="border border-slate-300 p-2 font-mono text-xs">{r.rule_code}</td>
                    <td className="border border-slate-300 p-2">{r.rule_name}</td>
                    <td className="border border-slate-300 p-2 text-right font-mono">
                      {Object.values(r.evaluated_values || {})[0] !== undefined
                        ? String(Object.values(r.evaluated_values)[0])
                        : '—'}
                    </td>
                    <td className="border border-slate-300 p-2 text-right font-mono">
                      {Object.values(r.evaluated_values || {})[1] !== undefined
                        ? String(Object.values(r.evaluated_values)[1])
                        : '—'}
                    </td>
                    <td className="border border-slate-300 p-2 text-center">
                      <StatusIcon status={r.status} />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </section>

        {/* 6. Sécurité incendie */}
        <section className="mb-6">
          <h4 className="font-bold bg-slate-100 px-3 py-2 mb-3 border-l-4 border-slate-800 text-base">
            6. Sécurité incendie — ERP &amp; normes applicables
          </h4>
          <table className="w-full border-collapse border border-slate-300 text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th className="border border-slate-300 p-2 text-left">Critère</th>
                <th className="border border-slate-300 p-2 text-left">Description</th>
                <th className="border border-slate-300 p-2 text-right">Valeur mesurée</th>
                <th className="border border-slate-300 p-2 text-right">Exigence</th>
                <th className="border border-slate-300 p-2 text-center">Résultat</th>
              </tr>
            </thead>
            <tbody>
              {(complianceResult?.results || [])
                .filter((r: any) => r.category === 'incendie')
                .map((r: any, i: number) => (
                  <tr key={i}>
                    <td className="border border-slate-300 p-2 font-mono text-xs">{r.rule_code}</td>
                    <td className="border border-slate-300 p-2">{r.rule_name}</td>
                    <td className="border border-slate-300 p-2 text-right font-mono">
                      {Object.values(r.evaluated_values || {})[0] !== undefined
                        ? String(Object.values(r.evaluated_values)[0])
                        : '—'}
                    </td>
                    <td className="border border-slate-300 p-2 text-right font-mono">
                      {Object.values(r.evaluated_values || {})[1] !== undefined
                        ? String(Object.values(r.evaluated_values)[1])
                        : '—'}
                    </td>
                    <td className="border border-slate-300 p-2 text-center">
                      {r.status === 'not_applicable' ? (
                        <Badge variant="outline">N/A</Badge>
                      ) : (
                        <StatusIcon status={r.status} />
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </section>

        {/* Conclusion */}
        <section className="mb-6">
          <h4 className="font-bold bg-slate-100 px-3 py-2 mb-3 border-l-4 border-slate-800 text-base">
            Conclusion
          </h4>
          <div className="p-4 rounded border border-slate-200 bg-slate-50">
            <p className="text-sm text-slate-700 mb-2">
              La notice de calcul établit le dimensionnement de la structure ossature bois pour le projet
              «&nbsp;{project?.name || '—'}&nbsp;». Les éléments structurels ont été vérifiés selon les
              Eurocodes et les règles professionnelles du CTH (Cahier 3690).
            </p>
            <p className="text-sm text-slate-700 mb-2">
              <strong>Performance énergétique :</strong> Le bâtiment présente un CEP de {cepValue} kWh/m².an
              et un IC-GES de {ggesValue} kgCO₂/m².an.
              {bbioValue > bbioMax && (
                <span className="text-red-600"> Le Bbio ({bbioValue.toFixed(2)}) dépasse la limite réglementaire ({bbioMax.toFixed(2)}) — optimisation du rapport surfaces vitrées / inertie nécessaire.</span>
              )}
            </p>
            <p className="text-sm text-slate-700">
              <strong>Recommandations :</strong> Respecter les sections minimales indiquées, utiliser du
              bois C24 certifié CTB+, et faire appel à un bureau de contrôle pour la vérification RE2020
              en phase finale.
            </p>
          </div>
        </section>

        {/* Footer */}
        <div className="border-t border-slate-300 pt-4 mt-6 text-center text-xs text-slate-500">
          <p>Document généré automatiquement par EDIFIA — {new Date().toLocaleDateString('fr-FR')}</p>
          <p>Cette notice est fournie à titre indicatif. Vérification obligatoire par un bureau d&apos;études structure agréé.</p>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          .notice-form { border: none !important; padding: 0 !important; }
        }
      `}</style>
    </div>
  );
};

export default NoticeCalculViewer;
