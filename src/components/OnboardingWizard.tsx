import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Home, Warehouse, ArrowRight, ArrowLeft, AlertTriangle, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createProject } from '@/lib/api';

const addressSuggestions = ['12 Rue de Paris, Tremblay-en-France','8 Avenue des Champs, Montreuil','3 Rue des Lilas, Fontainebleau','25 Rue du Commerce, Neuilly-sur-Seine','7 Boulevard Haussmann, Paris'];

interface Props { onClose: () => void; }

export default function OnboardingWizard({ onClose }: Props) {
  const [step, setStep] = useState(1);
  const [projectType, setProjectType] = useState<'extension_under_40' | 'mob_under_150' | null>(null);
  const [surface, setSurface] = useState(25);
  const [address, setAddress] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleSurfaceChange = (val: number) => { setSurface(val); setShowAlert(projectType === 'extension_under_40' && val > 40); };
  const handleAddressInput = (val: string) => { setAddress(val); setFilteredSuggestions(val.length > 2 ? addressSuggestions.filter(a => a.toLowerCase().includes(val.toLowerCase())) : []); };

  const handleCreate = async () => {
    if (!projectType || !address) return;
    const newProject = await createProject({ name: projectType === 'extension_under_40' ? `Extension ${surface}m²` : `Construction ${surface}m²`, project_type: projectType, parcel_address: address, surface_approx: surface, commune_code: '93073', commune_name: 'Tremblay-en-France' });
    onClose(); navigate(`/projects/${newProject.id}`);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
        <div className="flex items-center justify-between mb-6"><h2 className="text-lg font-semibold text-slate-800">Nouveau projet</h2><span className="text-xs text-slate-400">Étape {step}/3</span></div>
        <div className="flex gap-2 mb-6">{[1,2,3].map(s => <div key={s} className={`h-1 flex-1 rounded-full ${s <= step ? 'bg-orange-500' : 'bg-slate-200'}`} />)}</div>
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600 mb-4">Quel type de projet souhaitez-vous réaliser ?</p>
            <div onClick={() => setProjectType('extension_under_40')} className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4 ${projectType === 'extension_under_40' ? 'border-orange-500 bg-orange-50' : 'border-slate-200 hover:border-orange-300'}`}>
              <div className="w-12 h-12 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center"><Home size={24} /></div>
              <div><h3 className="font-semibold text-slate-800">Extension de maison</h3><p className="text-xs text-slate-500">Extension, surélévation, véranda — jusqu'à 40m²</p></div>
            </div>
            <div onClick={() => setProjectType('mob_under_150')} className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4 ${projectType === 'mob_under_150' ? 'border-orange-500 bg-orange-50' : 'border-slate-200 hover:border-orange-300'}`}>
              <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center"><Warehouse size={24} /></div>
              <div><h3 className="font-semibold text-slate-800">Maison ossature bois</h3><p className="text-xs text-slate-500">Construction neuve en bois — jusqu'à 150m²</p></div>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">Quelle surface approximative ?</p>
            <div className="flex items-center gap-4">
              <input type="range" min={10} max={150} value={surface} onChange={e => handleSurfaceChange(Number(e.target.value))} className="flex-1 accent-orange-600" />
              <span className="text-2xl font-bold text-slate-800 w-20 text-right">{surface}m²</span>
            </div>
            {showAlert && <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm"><AlertTriangle size={16} /><span>Surface hors scope V1 (max 40m² pour les extensions)</span></div>}
          </div>
        )}
        {step === 3 && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">Où se situe le terrain ?</p>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-3 text-slate-400" />
              <Input value={address} onChange={e => handleAddressInput(e.target.value)} placeholder="Saisissez l'adresse..." className="pl-9" />
              {filteredSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-lg mt-1 z-10">
                  {filteredSuggestions.map(s => <button key={s} onClick={() => { setAddress(s); setFilteredSuggestions([]); }} className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50">{s}</button>)}
                </div>
              )}
            </div>
          </div>
        )}
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={() => step > 1 ? setStep(step - 1) : onClose()}><ArrowLeft size={16} className="mr-1" /> {step === 1 ? 'Annuler' : 'Précédent'}</Button>
          {step < 3 ? <Button onClick={() => setStep(step + 1)} disabled={step === 1 && !projectType} className="bg-orange-600 hover:bg-orange-700 text-white">Suivant <ArrowRight size={16} className="ml-1" /></Button> : <Button onClick={handleCreate} disabled={!address} className="bg-orange-600 hover:bg-orange-700 text-white">Créer le projet</Button>}
        </div>
      </div>
    </div>
  );
}
