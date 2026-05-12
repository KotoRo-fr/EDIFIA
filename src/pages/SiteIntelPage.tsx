import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Shield, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { api } from '@/lib/api-client';
import PageTransition from '@/components/animations/PageTransition';

// Types
interface SiteData {
  address: string;
  coordinates: { lat: number; lng: number };
  parcelle: { cadastre_id: string; section: string; numero: string; surface: number };
  commune: { code: string; name: string };
  plu: { zone: string; zone_label: string; cos_max: number; height_max: number; setbacks: { front: number; side: number; rear: number } };
  risques: Record<string, string>;
}

// DONNEES STATIQUES — fallback si backend injoignable
const SITE_DATA_STATIC: SiteData = {
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
  const [site, setSite] = useState<SiteData>(SITE_DATA_STATIC);
  const [isLoading, setIsLoading] = useState(false);

  // Charger les données terrain depuis l'API avec fallback
  const loadSiteIntel = useCallback(async () => {
    if (!projectId) return;
    setIsLoading(true);
    try {
      const data = await api.getSiteIntel(projectId);
      if (data && data.parcelle) {
        const formatted: SiteData = {
          address: data.parcelle.adresse || SITE_DATA_STATIC.address,
          coordinates: data.parcelle.coordonnees || SITE_DATA_STATIC.coordinates,
          parcelle: {
            cadastre_id: data.parcelle.cadastre_id || SITE_DATA_STATIC.parcelle.cadastre_id,
            section: data.parcelle.section || SITE_DATA_STATIC.parcelle.section,
            numero: data.parcelle.numero || SITE_DATA_STATIC.parcelle.numero,
            surface: data.parcelle.surface || SITE_DATA_STATIC.parcelle.surface,
          },
          commune: {
            code: data.plu?.zone || SITE_DATA_STATIC.commune.code,
            name: data.plu?.zone_libelle || SITE_DATA_STATIC.commune.name,
          },
          plu: {
            zone: data.plu?.zone || SITE_DATA_STATIC.plu.zone,
            zone_label: data.plu?.zone_libelle || SITE_DATA_STATIC.plu.zone_label,
            cos_max: data.plu?.cos || SITE_DATA_STATIC.plu.cos_max,
            height_max: data.plu?.hauteur_max || SITE_DATA_STATIC.plu.height_max,
            setbacks: {
              front: data.plu?.recul_voie || SITE_DATA_STATIC.plu.setbacks.front,
              side: data.plu?.recul_lateral || SITE_DATA_STATIC.plu.setbacks.side,
              rear: data.plu?.recul_fond || SITE_DATA_STATIC.plu.setbacks.rear,
            },
          },
          risques: data.risques ? {
            gaspar: data.risques.gaspar?.libelle || SITE_DATA_STATIC.risques.gaspar,
            sismicite: data.risques.sismicite?.libelle || SITE_DATA_STATIC.risques.sismicite,
            inondation: data.risques.inondation?.libelle || SITE_DATA_STATIC.risques.inondation,
          } : SITE_DATA_STATIC.risques,
        };
        setSite(formatted);
      }
    } catch {
      // Fallback vers données statiques
      setSite(SITE_DATA_STATIC);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  // Charger au montage du composant
  useEffect(() => {
    loadSiteIntel();
  }, [loadSiteIntel]);

  return (
    <PageTransition>
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <Button variant="ghost" size="sm" onClick={() => navigate(`/projects/${projectId}`)}>
          <ArrowLeft size={16} className="mr-1" /> Retour
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={loadSiteIntel}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 size={14} className="mr-1 animate-spin" /> : <RefreshCw size={14} className="mr-1" />}
          Rafraichir
        </Button>
      </div>
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
    </PageTransition>
  );
}
