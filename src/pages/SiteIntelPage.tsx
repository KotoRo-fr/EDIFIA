import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, MapPin, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// DONNEES STATIQUES
const SITE_DATA = {
  address: '12 rue de la Paix, 93290 Tremblay-en-France',
  coordinates: { lat: 48.9896, lng: 2.5701 },
  parcelle: { cadastre_id: '93073-000-AB-0123', section: 'AB', numero: '0123', surface: 750 },
  commune: { code: '93073', name: 'Tremblay-en-France' },
  plu: { zone: 'U', zone_label: 'Urbaine', cos_max: 0.5, height_max: 12.0, setbacks: { front: 3.0, side: 1.5, rear: 3.0 } },
  risques: { gaspar: 'Aucun risque identifie', sismicite: 'Zone 1 (faible)', inondation: 'Hors zone inondable' },
};

export default function SiteIntelPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const site = SITE_DATA;

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <Button variant="ghost" size="sm" onClick={() => navigate(`/projects/${projectId}`)} className="mb-4">
        <ArrowLeft size={16} className="mr-1" /> Retour
      </Button>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Site Intelligence</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Carte placeholder */}
        <Card className="lg:row-span-2"><CardContent className="pt-5">
          <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2"><MapPin size={18} className="text-blue-500" /> Carte parcelle</h3>
          <div className="bg-gray-100 rounded-lg h-80 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <MapPin size={48} className="mx-auto mb-2" />
              <p>Carte IGN — integration a venir</p>
              <p className="text-xs mt-1">{site.coordinates.lat}, {site.coordinates.lng}</p>
            </div>
          </div>
        </CardContent></Card>

        {/* Parcelle */}
        <Card><CardContent className="pt-5">
          <h3 className="font-semibold text-slate-700 mb-3">Parcelle cadastrale</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-lg p-3"><div className="text-xs text-slate-500">Surface</div><div className="text-lg font-bold">{site.parcelle.surface} m²</div></div>
            <div className="bg-slate-50 rounded-lg p-3"><div className="text-xs text-slate-500">Cadastre</div><div className="text-sm font-medium">{site.parcelle.cadastre_id}</div></div>
            <div className="bg-slate-50 rounded-lg p-3"><div className="text-xs text-slate-500">Section</div><div className="text-sm font-medium">{site.parcelle.section}</div></div>
            <div className="bg-slate-50 rounded-lg p-3"><div className="text-xs text-slate-500">Numero</div><div className="text-sm font-medium">{site.parcelle.numero}</div></div>
          </div>
        </CardContent></Card>

        {/* PLU */}
        <Card><CardContent className="pt-5">
          <h3 className="font-semibold text-slate-700 mb-3">PLU — {site.commune.name}</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 rounded-lg p-3"><div className="text-xs text-blue-600">Zone</div><div className="text-lg font-bold text-blue-800">{site.plu.zone} ({site.plu.zone_label})</div></div>
            <div className="bg-blue-50 rounded-lg p-3"><div className="text-xs text-blue-600">COS max</div><div className="text-lg font-bold text-blue-800">{site.plu.cos_max}</div></div>
            <div className="bg-blue-50 rounded-lg p-3"><div className="text-xs text-blue-600">Hauteur max</div><div className="text-lg font-bold text-blue-800">{site.plu.height_max} m</div></div>
            <div className="bg-blue-50 rounded-lg p-3"><div className="text-xs text-blue-600">Recul voie</div><div className="text-lg font-bold text-blue-800">{site.plu.setbacks.front} m</div></div>
          </div>
        </CardContent></Card>
      </div>

      {/* Risques */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(site.risques).map(([key, value]) => (
          <Card key={key}><CardContent className="pt-5 flex items-center gap-3">
            <Shield size={20} className="text-emerald-500" />
            <div><div className="text-xs text-slate-500 capitalize">{key}</div><div className="text-sm font-medium">{value}</div></div>
          </CardContent></Card>
        ))}
      </div>
    </div>
  );
}
