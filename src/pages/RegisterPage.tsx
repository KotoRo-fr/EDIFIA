import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { User, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/lib/auth';

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [cgu, setCgu] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    if (password !== confirm) { setError('Les mots de passe ne correspondent pas'); return; }
    if (!cgu) { setError('Vous devez accepter les CGU'); return; }
    const ok = await register({ email, password, first_name: firstName, last_name: lastName });
    if (ok) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8"><h1 className="text-3xl font-bold text-orange-600 mb-2">EDIFIA</h1><p className="text-slate-500 text-sm">Créez votre compte</p></div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="relative"><User size={16} className="absolute left-3 top-3 text-slate-400" /><Input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Prénom" className="pl-9" required /></div>
              <div className="relative"><User size={16} className="absolute left-3 top-3 text-slate-400" /><Input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Nom" className="pl-9" required /></div>
            </div>
            <div className="relative"><Mail size={16} className="absolute left-3 top-3 text-slate-400" /><Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="pl-9" required /></div>
            <div className="relative"><Lock size={16} className="absolute left-3 top-3 text-slate-400" /><Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mot de passe" className="pl-9" required minLength={6} /></div>
            <div className="relative"><Lock size={16} className="absolute left-3 top-3 text-slate-400" /><Input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Confirmer" className="pl-9" required /></div>
            <div className="flex items-center gap-2"><Checkbox id="cgu" checked={cgu} onCheckedChange={v => setCgu(!!v)} /><label htmlFor="cgu" className="text-xs text-slate-600">J\'accepte les <span className="text-orange-600 cursor-pointer">CGU</span> et la <span className="text-orange-600 cursor-pointer">politique de confidentialité</span></label></div>
            <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white">Créer mon compte</Button>
          </form>
          <p className="text-center text-sm text-slate-500 mt-5">Déjà un compte ? <Link to="/login" className="text-orange-600 hover:underline font-medium">Se connecter</Link></p>
        </div>
      </div>
    </div>
  );
}
