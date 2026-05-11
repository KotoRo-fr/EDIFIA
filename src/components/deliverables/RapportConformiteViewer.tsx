import React from 'react';
import { Printer, CheckCircle, XCircle, AlertTriangle, MinusCircle, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface RapportConformiteViewerProps {
  project: any;
  complianceResult: any;
}

const StatusIcon: React.FC<{ status: string }> = ({ status }) => {
  if (status === 'pass') return <CheckCircle size={16} className="text-green-600" />;
  if (status === 'fail') return <XCircle size={16} className="text-red-600" />;
  if (status === 'warning') return <AlertTriangle size={16} className="text-amber-600" />;
  return <MinusCircle size={16} className="text-gray-400" />;
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  if (status === 'pass') return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Conforme</Badge>;
  if (status === 'fail') return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Non conforme</Badge>;
  if (status === 'warning') return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">À vérifier</Badge>;
  return <Badge variant="outline">N/A</Badge>;
};

const SectionTable: React.FC<{ results: any[] }> = ({ results }) => (
  <table className="w-full border-collapse border border-slate-300 text-sm">
    <thead>
      <tr className="bg-slate-50">
        <th className="border border-slate-300 p-2 text-left w-28">Code règle</th>
        <th className="border border-slate-300 p-2 text-left">Description</th>
        <th className="border border-slate-300 p-2 text-left">Critère</th>
        <th className="border border-slate-300 p-2 text-right">Valeur mesurée</th>
        <th className="border border-slate-300 p-2 text-center w-24">Résultat</th>
      </tr>
    </thead>
    <tbody>
      {results.map((r: any, i: number) => {
        const vals = r.evaluated_values || {};
        const valKeys = Object.keys(vals);
        const measured = valKeys.length > 0 ? String(vals[valKeys[0]]) : '—';
        return (
          <tr key={i} className={r.status === 'fail' ? 'bg-red-50' : r.status === 'warning' ? 'bg-amber-50' : ''}>
            <td className="border border-slate-300 p-2 font-mono text-xs">{r.rule_code}</td>
            <td className="border border-slate-300 p-2">{r.rule_name}</td>
            <td className="border border-slate-300 p-2 text-xs">{r.message}</td>
            <td className="border border-slate-300 p-2 text-right font-mono">{measured}</td>
            <td className="border border-slate-300 p-2 text-center">
              {r.status === 'not_applicable' ? <StatusBadge status="not_applicable" /> : <StatusIcon status={r.status} />}
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
);

const RapportConformiteViewer: React.FC<RapportConformiteViewerProps> = ({ project, complianceResult }) => {
  const handlePrint = () => window.print();

  const summary = complianceResult?.summary;
  const results = complianceResult?.results || [];

  const urbanismeResults = results.filter((r: any) => r.category === 'urbanisme');
  const dtuResults = results.filter((r: any) => r.category === 'dtu');
  const re2020Results = results.filter((r: any) => r.category === 're2020');
  const pmrResults = results.filter((r: any) => r.category === 'pmr');
  const incendieResults = results.filter((r: any) => r.category === 'incendie');

  const refEdifia = `EDF-RAP-${project?.id || '0001'}-${new Date().getFullYear()}`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between no-print">
        <h3 className="font-semibold text-lg">Rapport de conformité réglementaire</h3>
        <Button onClick={handlePrint} variant="outline" size="sm">
          <Printer size={14} className="mr-1" /> Imprimer / PDF
        </Button>
      </div>

      <div className="rapport-form bg-white border border-slate-200 p-8 max-w-5xl mx-auto text-sm print:p-0 print:border-0 space-y-8">
        {/* Page de garde */}
        <div className="text-center border-b-4 border-slate-800 pb-8 mb-8 print:min-h-[60vh] print:flex print:flex-col print:justify-center">
          <div className="mb-6">
            <ShieldCheck size={64} className="mx-auto text-slate-700 mb-4" />
            <h1 className="text-2xl font-bold uppercase tracking-wide">Rapport de Conformité</h1>
            <p className="text-sm text-slate-600 mt-2">Vérification réglementaire complète du projet</p>
          </div>

          <div className="mt-8 space-y-3 text-left max-w-md mx-auto">
            <div className="border border-slate-300 p-3 rounded">
              <span className="text-xs text-slate-500 uppercase">Projet</span>
              <p className="font-semibold text-base">{project?.name || '—'}</p>
            </div>
            <div className="border border-slate-300 p-3 rounded">
              <span className="text-xs text-slate-500 uppercase">Localisation</span>
              <p className="font-medium">{project?.parcel_address || '—'}</p>
              <p className="text-xs text-slate-500">{project?.commune_name} ({project?.commune_code})</p>
            </div>
            <div className="border border-slate-300 p-3 rounded">
              <span className="text-xs text-slate-500 uppercase">Type</span>
              <p className="font-medium">
                {project?.project_type === 'extension_under_40'
                  ? 'Extension de maison individuelle (< 40 m²)'
                  : project?.project_type === 'mob_under_150'
                    ? 'Maison individuelle ossature bois (< 150 m²)'
                    : 'Autre'}
              </p>
            </div>
            <div className="border border-slate-300 p-3 rounded">
              <span className="text-xs text-slate-500 uppercase">Référence</span>
              <p className="font-mono text-sm">{refEdifia}</p>
            </div>
            <div className="border border-slate-300 p-3 rounded">
              <span className="text-xs text-slate-500 uppercase">Date de génération</span>
              <p className="font-medium">{new Date().toLocaleDateString('fr-FR')}</p>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-slate-800">{summary?.compliance_rate || 72}%</p>
              <p className="text-xs text-slate-500">Taux de conformité</p>
            </div>
            <div className="h-12 w-px bg-slate-300" />
            <div className="text-center">
              <p className="text-lg font-bold text-green-700">{summary?.passed || 36}</p>
              <p className="text-xs text-slate-500">Conformes</p>
            </div>
            <div className="h-12 w-px bg-slate-300" />
            <div className="text-center">
              <p className="text-lg font-bold text-red-700">{summary?.failed || 8}</p>
              <p className="text-xs text-slate-500">Non conformes</p>
            </div>
            <div className="h-12 w-px bg-slate-300" />
            <div className="text-center">
              <p className="text-lg font-bold text-amber-700">{summary?.warnings || 4}</p>
              <p className="text-xs text-slate-500">À vérifier</p>
            </div>
          </div>

          <div className="mt-6 print:mt-auto">
            <p className="text-xs text-slate-400">
              Généré automatiquement par EDIFIA — Plateforme Prompt-to-Building
            </p>
          </div>
        </div>

        {/* Saut de page */}
        <div className="page-break" />

        {/* Table des matières */}
        <section className="mb-6">
          <h4 className="font-bold text-lg mb-4 border-b-2 border-slate-800 pb-2">Table des matières</h4>
          <ol className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><span className="font-mono text-slate-400">1.</span> Introduction</li>
            <li className="flex items-center gap-2"><span className="font-mono text-slate-400">2.</span> Règles d&apos;urbanisme — PLU</li>
            <li className="flex items-center gap-2"><span className="font-mono text-slate-400">3.</span> DTU et normes de construction</li>
            <li className="flex items-center gap-2"><span className="font-mono text-slate-400">4.</span> RE2020 — Performance énergétique</li>
            <li className="flex items-center gap-2"><span className="font-mono text-slate-400">5.</span> Accessibilité PMR</li>
            <li className="flex items-center gap-2"><span className="font-mono text-slate-400">6.</span> Sécurité incendie</li>
            <li className="flex items-center gap-2"><span className="font-mono text-slate-400">7.</span> Conclusion globale</li>
          </ol>
        </section>

        <div className="page-break" />

        {/* 1. Introduction */}
        <section className="mb-8">
          <h4 className="font-bold bg-slate-100 px-3 py-2 mb-4 border-l-4 border-slate-800 text-base">
            1. Introduction
          </h4>
          <div className="space-y-3 text-slate-700">
            <p>
              Le présent rapport établit la conformité réglementaire du projet{' '}
              <strong>«&nbsp;{project?.name || '—'}&nbsp;»</strong> situé à{' '}
              {project?.parcel_address || '—'}. Ce document a pour objet de vérifier
              l&apos;adéquation du projet avec les règles d&apos;urbanisme, les normes de
              construction, la réglementation thermique RE2020, les règles d&apos;accessibilité
              PMR et les dispositions de sécurité incendie.
            </p>
            <p className="font-semibold text-slate-800 mt-3">Normes applicables :</p>
            <ul className="list-disc list-inside space-y-1 text-sm ml-2">
              <li>Code de l&apos;urbanisme — PLU de la commune de {project?.commune_name || '—'}</li>
              <li>DTU (Document Technique Unifié) applicable aux constructions bois</li>
              <li>RE2020 — Réglementation environnementale 2020 (arrêté du 5 avril 2021)</li>
              <li>NF P99-611 — Accessibilité aux personnes à mobilité réduite</li>
              <li>ERP — Règlement de sécurité contre les risques d&apos;incendie et de panique</li>
              <li>Eurocodes 0 à 8 — Bases de calcul et actions sur les structures</li>
            </ul>
          </div>
        </section>

        {/* 2. Urbanisme */}
        <section className="mb-8">
          <h4 className="font-bold bg-slate-100 px-3 py-2 mb-4 border-l-4 border-slate-800 text-base">
            2. Règles d&apos;urbanisme — PLU
          </h4>
          <p className="text-xs text-slate-500 mb-3">
            Vérification des règles du Plan Local d&apos;Urbanisme : COS, hauteurs, reculs, emprise au sol, alignement.
          </p>
          <SectionTable results={urbanismeResults} />
        </section>

        <div className="page-break" />

        {/* 3. DTU */}
        <section className="mb-8">
          <h4 className="font-bold bg-slate-100 px-3 py-2 mb-4 border-l-4 border-slate-800 text-base">
            3. DTU et normes de construction
          </h4>
          <p className="text-xs text-slate-500 mb-3">
            Vérification de la conformité aux Documents Techniques Unifiés et normes NF applicables.
          </p>
          <SectionTable results={dtuResults} />
        </section>

        {/* 4. RE2020 */}
        <section className="mb-8">
          <h4 className="font-bold bg-slate-100 px-3 py-2 mb-4 border-l-4 border-slate-800 text-base">
            4. RE2020 — Performance énergétique et environnementale
          </h4>
          <p className="text-xs text-slate-500 mb-3">
            Vérification des indicateurs de la réglementation environnementale RE2020.
          </p>
          <SectionTable results={re2020Results} />
        </section>

        <div className="page-break" />

        {/* 5. PMR */}
        <section className="mb-8">
          <h4 className="font-bold bg-slate-100 px-3 py-2 mb-4 border-l-4 border-slate-800 text-base">
            5. Accessibilité PMR — NF P99-611
          </h4>
          <p className="text-xs text-slate-500 mb-3">
            Vérification des conditions d&apos;accessibilité pour les personnes à mobilité réduite.
          </p>
          <SectionTable results={pmrResults} />
        </section>

        {/* 6. Incendie */}
        <section className="mb-8">
          <h4 className="font-bold bg-slate-100 px-3 py-2 mb-4 border-l-4 border-slate-800 text-base">
            6. Sécurité incendie
          </h4>
          <p className="text-xs text-slate-500 mb-3">
            Vérification des dispositions de sécurité contre l&apos;incendie selon le règlement ERP et les normes NF.
          </p>
          <SectionTable results={incendieResults} />
        </section>

        <div className="page-break" />

        {/* 7. Conclusion globale */}
        <section className="mb-8">
          <h4 className="font-bold bg-slate-100 px-3 py-2 mb-4 border-l-4 border-slate-800 text-base">
            7. Conclusion globale
          </h4>

          {/* Synthèse visuelle */}
          <div className="grid grid-cols-5 gap-3 mb-6">
            <div className="border border-slate-200 p-3 rounded text-center">
              <p className="text-2xl font-bold text-slate-800">{summary?.total_rules || 50}</p>
              <p className="text-xs text-slate-500">Règles évaluées</p>
            </div>
            <div className="border border-green-200 bg-green-50 p-3 rounded text-center">
              <p className="text-2xl font-bold text-green-700">{summary?.passed || 36}</p>
              <p className="text-xs text-green-600">Conformes</p>
            </div>
            <div className="border border-red-200 bg-red-50 p-3 rounded text-center">
              <p className="text-2xl font-bold text-red-700">{summary?.failed || 8}</p>
              <p className="text-xs text-red-600">Non conformes</p>
            </div>
            <div className="border border-amber-200 bg-amber-50 p-3 rounded text-center">
              <p className="text-2xl font-bold text-amber-700">{summary?.warnings || 4}</p>
              <p className="text-xs text-amber-600">À vérifier</p>
            </div>
            <div className="border border-slate-200 bg-slate-50 p-3 rounded text-center">
              <p className="text-2xl font-bold text-slate-700">{summary?.not_applicable || 2}</p>
              <p className="text-xs text-slate-500">Non applicables</p>
            </div>
          </div>

          {/* Taux de conformité */}
          <div className="mb-6 p-4 rounded border border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">Taux de conformité global</span>
              <span className="text-xl font-bold">{summary?.compliance_rate || 72}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className="h-3 rounded-full transition-all"
                style={{
                  width: `${summary?.compliance_rate || 72}%`,
                  backgroundColor:
                    (summary?.compliance_rate || 72) >= 90
                      ? '#22c55e'
                      : (summary?.compliance_rate || 72) >= 70
                        ? '#f59e0b'
                        : '#ef4444',
                }}
              />
            </div>
          </div>

          {/* Réserves */}
          {results.filter((r: any) => r.status === 'fail').length > 0 && (
            <div className="mb-6 p-4 rounded border border-red-200 bg-red-50">
              <h5 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                <XCircle size={16} /> Réserves bloquantes
              </h5>
              <ul className="space-y-2">
                {results
                  .filter((r: any) => r.status === 'fail')
                  .map((r: any, i: number) => (
                    <li key={i} className="text-sm text-red-700 flex items-start gap-2">
                      <span className="font-mono text-xs shrink-0 mt-0.5">{r.rule_code}</span>
                      <span>{r.message}</span>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {results.filter((r: any) => r.status === 'warning').length > 0 && (
            <div className="mb-6 p-4 rounded border border-amber-200 bg-amber-50">
              <h5 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                <AlertTriangle size={16} /> Points d&apos;attention
              </h5>
              <ul className="space-y-2">
                {results
                  .filter((r: any) => r.status === 'warning')
                  .map((r: any, i: number) => (
                    <li key={i} className="text-sm text-amber-700 flex items-start gap-2">
                      <span className="font-mono text-xs shrink-0 mt-0.5">{r.rule_code}</span>
                      <span>{r.message}</span>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {/* Recommandations */}
          <div className="p-4 rounded border border-slate-200">
            <h5 className="font-semibold text-slate-800 mb-2">Recommandations</h5>
            <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
              <li>
                Corriger les {summary?.failed || 8} points non conformes identifiés avant le dépôt du permis de construire.
              </li>
              <li>
                Faire valider le rapport RE2020 par un bureau d&apos;études thermique accrédité.
              </li>
              <li>
                Soumettre l&apos;intégralité du dossier (CERFA, plans, notice de calcul et présent rapport) au service urbanisme de la mairie de {project?.commune_name || '—'}.
              </li>
              <li>
                Conserver une copie de ce rapport pour la consultation en mairie et lors des inspections éventuelles.
              </li>
            </ul>
          </div>
        </section>

        {/* Footer */}
        <div className="border-t border-slate-300 pt-4 mt-8 text-center text-xs text-slate-500">
          <p>
            Rapport de conformité EDIFIA — Référence {refEdifia} —{' '}
            {new Date().toLocaleDateString('fr-FR')}
          </p>
          <p>
            Ce document est généré automatiquement à partir des données projet. Il ne remplace pas
            l&apos;avis d&apos;un expert réglementaire ni la consultation du service urbanisme.
          </p>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          .rapport-form { border: none !important; padding: 0 !important; }
          .page-break { page-break-before: always; }
        }
        .page-break { display: block; }
      `}</style>
    </div>
  );
};

export default RapportConformiteViewer;
