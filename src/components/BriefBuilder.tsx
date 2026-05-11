import { useState, useCallback } from 'react';
import { Plus, Trash2, CheckCircle } from 'lucide-react';
import type { Room, Brief } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { saveBrief, validateBrief } from '@/lib/api';

const ROOM_TYPES = ['Séjour','Cuisine','Chambre','Salle de bain','Salle d\'eau','Bureau','Dressing','Véranda','Studio','Rangement'];
const ORIENTATIONS = ['Nord','Sud','Est','Ouest','Nord-Est','Nord-Ouest','Sud-Est','Sud-Ouest'];
const BUDGETS = ['<50k','50-100k','100-200k','>200k'];
const STYLES = ['moderne','traditionnel','contemporain','indifférent'];
const ETAGES = ['RDC','R+1','R+2'];

interface Props { projectId: string; existingBrief?: Brief; onSave?: (brief: Brief) => void; }

export default function BriefBuilder({ projectId, existingBrief, onSave }: Props) {
  const [rooms, setRooms] = useState<Room[]>(existingBrief?.rooms || []);
  const [budget, setBudget] = useState(existingBrief?.budget_range || '');
  const [style, setStyle] = useState(existingBrief?.style_preference || '');
  const [etage, setEtage] = useState((existingBrief?.constraints as Record<string, string>)?.etage || '');
  const [exigences, setExigences] = useState((existingBrief?.preferences as Record<string, string>)?.exigences || '');
  const [saved, setSaved] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const surfaceTotale = rooms.reduce((sum, r) => sum + r.surface, 0);

  const addRoom = useCallback(() => { setRooms(p => [...p, { id: `room-${Date.now()}`, type: ROOM_TYPES[0], surface: 15, orientation: 'Sud', priority: p.length + 1 }]); setSaved(false); }, []);
  const updateRoom = useCallback((id: string, field: keyof Room, value: string | number) => { setRooms(p => p.map(r => r.id === id ? { ...r, [field]: value } : r)); setSaved(false); }, []);
  const removeRoom = useCallback((id: string) => { setRooms(p => p.filter(r => r.id !== id)); setSaved(false); }, []);

  const handleSave = async () => {
    const brief = await saveBrief(projectId, { rooms, constraints: { budget_range: budget, etage }, preferences: { style, exigences }, budget_range: budget, style_preference: style, status: 'completed' });
    setSaved(true); setValidationErrors([]); onSave?.(brief);
  };

  const handleValidate = async () => { const r = await validateBrief(projectId); setValidationErrors(r.errors); };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-semibold text-slate-800 mb-3">Pièces du projet</h3>
        {rooms.map(room => (
          <div key={room.id} className="flex items-center gap-2 mb-2 p-3 bg-slate-50 rounded-lg">
            <select value={room.type} onChange={e => updateRoom(room.id, 'type', e.target.value)} className="flex-1 text-sm border border-slate-200 rounded-md px-2 py-1.5 bg-white">{ROOM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select>
            <div className="flex items-center gap-1"><Input type="number" value={room.surface} onChange={e => updateRoom(room.id, 'surface', Number(e.target.value))} className="w-20 text-sm" /><span className="text-xs text-slate-500">m²</span></div>
            <select value={room.orientation || ''} onChange={e => updateRoom(room.id, 'orientation', e.target.value)} className="text-sm border border-slate-200 rounded-md px-2 py-1.5 bg-white hidden sm:block"><option value="">Orientation</option>{ORIENTATIONS.map(o => <option key={o} value={o}>{o}</option>)}</select>
            <button onClick={() => removeRoom(room.id)} className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={addRoom} className="mt-2"><Plus size={16} className="mr-1" /> Ajouter une pièce</Button>
        {rooms.length > 0 && <p className="text-sm font-semibold text-slate-700 mt-3">Surface totale : <span className="text-orange-600">{surfaceTotale}m²</span></p>}
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-800 mb-3">Contraintes et préférences</h3>
        <div className="mb-4"><label className="text-xs text-slate-500 mb-1.5 block">Budget approximatif</label><div className="flex flex-wrap gap-2">{BUDGETS.map(b => <button key={b} onClick={() => { setBudget(b); setSaved(false); }} className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${budget === b ? 'bg-orange-50 border-orange-500 text-orange-700' : 'border-slate-200 text-slate-600 hover:border-orange-300'}`}>{b === '<50k' ? '< 50k€' : b === '>200k' ? '> 200k€' : `${b}€`}</button>)}</div></div>
        <div className="mb-4"><label className="text-xs text-slate-500 mb-1.5 block">Style architectural</label><div className="flex flex-wrap gap-2">{STYLES.map(s => <button key={s} onClick={() => { setStyle(s); setSaved(false); }} className={`px-3 py-1.5 text-xs rounded-full border transition-colors capitalize ${style === s ? 'bg-orange-50 border-orange-500 text-orange-700' : 'border-slate-200 text-slate-600 hover:border-orange-300'}`}>{s}</button>)}</div></div>
        <div className="mb-4"><label className="text-xs text-slate-500 mb-1.5 block">Étage concerné</label><div className="flex flex-wrap gap-2">{ETAGES.map(e => <button key={e} onClick={() => { setEtage(e); setSaved(false); }} className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${etage === e ? 'bg-orange-50 border-orange-500 text-orange-700' : 'border-slate-200 text-slate-600 hover:border-orange-300'}`}>{e}</button>)}</div></div>
        <div className="mb-4"><label className="text-xs text-slate-500 mb-1.5 block">Exigences particulières</label><Textarea value={exigences} onChange={e => { setExigences(e.target.value.slice(0, 500)); setSaved(false); }} placeholder="Décrivez vos exigences..." maxLength={500} rows={3} /><p className="text-xs text-slate-400 mt-1">{exigences.length}/500 caractères</p></div>
      </div>
      {validationErrors.length > 0 && <div className="bg-red-50 border border-red-200 rounded-lg p-3"><p className="text-sm text-red-700 font-medium">Veuillez corriger :</p><ul className="text-xs text-red-600 mt-1 space-y-0.5">{validationErrors.map((e, i) => <li key={i}>• {e}</li>)}</ul></div>}
      {saved && <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 p-3 rounded-lg text-sm"><CheckCircle size={16} /> Brief enregistré</div>}
      <div className="flex gap-3"><Button onClick={handleSave} className="bg-orange-600 hover:bg-orange-700 text-white">Enregistrer le brief</Button><Button variant="outline" onClick={handleValidate}>Valider le brief</Button></div>
    </div>
  );
}
