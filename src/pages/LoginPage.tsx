import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Mail, Lock, Chrome } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('demo@edifia.fr');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    const ok = await login(email, password);
    if (ok) navigate('/dashboard'); else setError('Email ou mot de passe incorrect');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8"><h1 className="text-3xl font-bold text-orange-600 mb-2">EDIFIA</h1><p className="text-slate-500 text-sm">Connectez-vous à votre espace</p></div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative"><Mail size={16} className="absolute left-3 top-3 text-slate-400" /><Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="pl-9" required /></div>
            <div className="relative"><Lock size={16} className="absolute left-3 top-3 text-slate-400" /><Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mot de passe" className="pl-9" required /></div>
            <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white">Se connecter</Button>
          </form>
          <div className="relative my-5"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div><div className="relative flex justify-center text-xs"><span className="bg-white px-2 text-slate-400">ou</span></div></div>
          <Button variant="outline" className="w-full flex items-center gap-2" onClick={() => login(email, password).then(() => navigate('/dashboard'))}><Chrome size={16} /> Continuer avec Google</Button>
          <p className="text-center text-sm text-slate-500 mt-5">Pas encore de compte ? <Link to="/register" className="text-orange-600 hover:underline font-medium">S\'inscrire</Link></p>
        </div>
      </div>
    </div>
  );
}
