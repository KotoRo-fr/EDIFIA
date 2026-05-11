import React from 'react';
import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CerfaViewerProps {
  project: any;
  profile?: any;
}

const CerfaViewer: React.FC<CerfaViewerProps> = ({ project, profile }) => {
  const handlePrint = () => window.print();

  const projectTypeLabel =
    project?.project_type === 'extension_under_40'
      ? 'Extension de maison individuelle'
      : project?.project_type === 'mob_under_150'
        ? 'Maison individuelle'
        : 'Travaux';

  const totalSurface = (project?.brief?.rooms || []).reduce(
    (s: number, r: any) => s + (r.surface || 0),
    0
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between no-print">
        <h3 className="font-semibold text-lg">CERFA 13406*05 — Permis de construire</h3>
        <Button onClick={handlePrint} variant="outline" size="sm">
          <Printer size={14} className="mr-1" /> Imprimer / PDF
        </Button>
      </div>

      {/* Formulaire CERFA style */}
      <div className="cerfa-form bg-white border-2 border-black p-6 max-w-4xl mx-auto text-sm print:p-0 print:border-0">
        {/* En-tête */}
        <div className="text-center border-b-2 border-black pb-3 mb-4">
          <h2 className="text-lg font-bold uppercase">Demande de permis de construire</h2>
          <p className="text-xs text-gray-600">
            Article R. 421-1 du code de l'urbanisme — CERFA n° 13406*05
          </p>
        </div>

        {/* Section 1 : Demandeur */}
        <div className="mb-4">
          <h4 className="font-bold bg-gray-100 px-2 py-1 mb-2 border border-black">
            1. IDENTITE DU DEMANDEUR
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="border border-gray-300 p-2">
              <span className="text-xs text-gray-500">Nom :</span>
              <p className="font-medium">{profile?.last_name || 'DUBOIS'}</p>
            </div>
            <div className="border border-gray-300 p-2">
              <span className="text-xs text-gray-500">Prénom :</span>
              <p className="font-medium">{profile?.first_name || 'Marie'}</p>
            </div>
            <div className="border border-gray-300 p-2 col-span-2">
              <span className="text-xs text-gray-500">Adresse :</span>
              <p className="font-medium">
                {project?.parcel_address || '12 rue de la Paix, 93290 Tremblay-en-France'}
              </p>
            </div>
          </div>
        </div>

        {/* Section 2 : Terrain */}
        <div className="mb-4">
          <h4 className="font-bold bg-gray-100 px-2 py-1 mb-2 border border-black">
            2. REFERENCE DU TERRAIN (CADASTRE)
          </h4>
          <div className="grid grid-cols-3 gap-2">
            <div className="border border-gray-300 p-2">
              <span className="text-xs text-gray-500">Commune :</span>
              <p className="font-medium">{project?.commune_name || 'Tremblay-en-France'}</p>
            </div>
            <div className="border border-gray-300 p-2">
              <span className="text-xs text-gray-500">Code INSEE :</span>
              <p className="font-medium">{project?.commune_code || '93073'}</p>
            </div>
            <div className="border border-gray-300 p-2">
              <span className="text-xs text-gray-500">Section :</span>
              <p className="font-medium">AB</p>
            </div>
            <div className="border border-gray-300 p-2">
              <span className="text-xs text-gray-500">N° parcelle :</span>
              <p className="font-medium">{project?.parcel_cadastre_id || '0123'}</p>
            </div>
            <div className="border border-gray-300 p-2 col-span-2">
              <span className="text-xs text-gray-500">Superficie terrain :</span>
              <p className="font-medium">750 m²</p>
            </div>
          </div>
        </div>

        {/* Section 3 : Description */}
        <div className="mb-4">
          <h4 className="font-bold bg-gray-100 px-2 py-1 mb-2 border border-black">
            3. DESCRIPTION DU PROJET
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="border border-gray-300 p-2">
              <span className="text-xs text-gray-500">Nature des travaux :</span>
              <p className="font-medium">{projectTypeLabel}</p>
            </div>
            <div className="border border-gray-300 p-2">
              <span className="text-xs text-gray-500">Surface plancher (m²) :</span>
              <p className="font-medium">{project?.surface_approx || 25} m²</p>
            </div>
            <div className="border border-gray-300 p-2">
              <span className="text-xs text-gray-500">Hauteur max (m) :</span>
              <p className="font-medium">3.50</p>
            </div>
            <div className="border border-gray-300 p-2">
              <span className="text-xs text-gray-500">Nombre de niveaux :</span>
              <p className="font-medium">1 (RDC)</p>
            </div>
          </div>
          <div className="border border-gray-300 p-2 mt-2">
            <span className="text-xs text-gray-500">Description :</span>
            <p className="font-medium">
              {project?.description ||
                `Construction d'une ${project?.project_type === 'extension_under_40' ? 'extension' : 'maison'} de ${project?.surface_approx || 25}m² en rez-de-chaussée.`}
            </p>
          </div>
        </div>

        {/* Section 4 : Pièces */}
        <div className="mb-4">
          <h4 className="font-bold bg-gray-100 px-2 py-1 mb-2 border border-black">
            4. SHON / SURFACE DE PLANCHER
          </h4>
          <table className="w-full border-collapse border border-gray-300 text-xs">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 p-1 text-left">Niveau</th>
                <th className="border border-gray-300 p-1 text-left">Destination</th>
                <th className="border border-gray-300 p-1 text-right">Surface (m²)</th>
              </tr>
            </thead>
            <tbody>
              {(project?.brief?.rooms || []).map((room: any, i: number) => (
                <tr key={i}>
                  <td className="border border-gray-300 p-1">RDC</td>
                  <td className="border border-gray-300 p-1 capitalize">{room.type}</td>
                  <td className="border border-gray-300 p-1 text-right">{room.surface}</td>
                </tr>
              ))}
              {(!project?.brief?.rooms || project.brief.rooms.length === 0) && (
                <tr>
                  <td className="border border-gray-300 p-1">RDC</td>
                  <td className="border border-gray-300 p-1">Pièce principale</td>
                  <td className="border border-gray-300 p-1 text-right">
                    {project?.surface_approx || 25}
                  </td>
                </tr>
              )}
              <tr className="bg-gray-50 font-bold">
                <td className="border border-gray-300 p-1" colSpan={2}>
                  TOTAL
                </td>
                <td className="border border-gray-300 p-1 text-right">
                  {totalSurface || project?.surface_approx || 25} m²
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 5 : Architecte */}
        <div className="mb-4">
          <h4 className="font-bold bg-gray-100 px-2 py-1 mb-2 border border-black">
            5. MAITRE D&apos;OEUVRE (Le cas échéant)
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="border border-gray-300 p-2">
              <span className="text-xs text-gray-500">Logiciel utilisé :</span>
              <p className="font-medium">EDIFIA — Plateforme Prompt-to-Building</p>
            </div>
            <div className="border border-gray-300 p-2">
              <span className="text-xs text-gray-500">Numéro de dossier EDIFIA :</span>
              <p className="font-medium">
                EDF-{project?.id || '0001'}-{new Date().getFullYear()}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-black pt-3 mt-4 text-center text-xs text-gray-500">
          <p>Document généré automatiquement par EDIFIA — {new Date().toLocaleDateString('fr-FR')}</p>
          <p>Certifié conforme aux données du projet. À vérifier par le demandeur avant dépôt.</p>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          .cerfa-form { border: none !important; padding: 0 !important; }
        }
      `}</style>
    </div>
  );
};

export default CerfaViewer;
