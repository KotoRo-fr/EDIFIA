import { useState } from 'react';
import { useNavigate } from 'react-router';
import { User, Bell, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [phone, setPhone] = useState('');
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSaveProfile = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };
  const handleDeleteAccount = () => { logout(); navigate('/'); };

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Paramètres</h1>
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
        <div className="flex items-center gap-2 mb-4"><User size={18} className="text-orange-600" /><h2 className="text-sm font-semibold text-slate-800">Profil</h2></div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3"><div><label className="text-xs text-slate-500 mb-1 block">Prénom</label><Input value={firstName} onChange={e => setFirstName(e.target.value)} /></div><div><label className="text-xs text-slate-500 mb-1 block">Nom</label><Input value={lastName} onChange={e => setLastName(e.target.value)} /></div></div>
          <div><label className="text-xs text-slate-500 mb-1 block">Email</label><Input value={user?.email || ''} disabled className="bg-slate-50" /></div>
          <div><label className="text-xs text-slate-500 mb-1 block">Téléphone</label><Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+33 6 12 34 56 78" /></div>
          <Button onClick={handleSaveProfile} className="bg-orange-600 hover:bg-orange-700 text-white mt-2">Enregistrer</Button>
          {saved && <p className="text-xs text-emerald-600">Profil mis à jour</p>}
        </div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
        <div className="flex items-center gap-2 mb-4"><Bell size={18} className="text-orange-600" /><h2 className="text-sm font-semibold text-slate-800">Notifications</h2></div>
        <div className="space-y-3">
          <label className="flex items-center justify-between cursor-pointer"><span className="text-sm text-slate-700">Notifications par email</span><button onClick={() => setNotifEmail(!notifEmail)} className={`w-11 h-6 rounded-full transition-colors relative ${notifEmail ? 'bg-orange-600' : 'bg-slate-300'}`}><span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifEmail ? 'left-6' : 'left-1'}`} /></button></label>
          <label className="flex items-center justify-between cursor-pointer"><span className="text-sm text-slate-700">Notifications push</span><button onClick={() => setNotifPush(!notifPush)} className={`w-11 h-6 rounded-full transition-colors relative ${notifPush ? 'bg-orange-600' : 'bg-slate-300'}`}><span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifPush ? 'left-6' : 'left-1'}`} /></button></label>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-red-200 p-5">
        <div className="flex items-center gap-2 mb-4"><Trash2 size={18} className="text-red-600" /><h2 className="text-sm font-semibold text-slate-800">Zone dangereuse</h2></div>
        <Dialog>
          <DialogTrigger asChild><Button variant="destructive">Supprimer mon compte</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="flex items-center gap-2 text-red-600"><AlertTriangle size={20} /> Supprimer mon compte</DialogTitle><DialogDescription>Cette action est irréversible. Tous vos projets et données seront définitivement supprimés.</DialogDescription></DialogHeader>
            <DialogFooter><Button variant="outline">Annuler</Button><Button variant="destructive" onClick={handleDeleteAccount}>Confirmer</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
