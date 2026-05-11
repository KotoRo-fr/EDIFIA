import { useNavigate } from 'react-router';
import { Clock, Euro, Shield, ArrowRight, Play, FileText, PenTool, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white">
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-24 lg:py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10"><div className="absolute top-20 left-10 w-72 h-72 bg-orange-500 rounded-full blur-3xl" /><div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-600 rounded-full blur-3xl" /></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-orange-500/30"><Play size={14} /> Prompt-to-Building</div>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">Votre projet de construction,<br /><span className="text-orange-500">15 minutes</span> au lieu de 12 semaines</h1>
          <p className="text-lg lg:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">EDIFIA combine IA générative, data foncière et conformité réglementaire pour produire votre permis de construire en un temps record.</p>
          <Button size="lg" onClick={() => navigate('/login')} className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-orange-600/25">Commencer mon projet <ArrowRight size={20} className="ml-2" /></Button>
        </div>
      </section>
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[{icon:Clock,value:'40:1',label:'Ratio temps gagné',desc:'De 12 semaines à 15 minutes'},{icon:Euro,value:'10x',label:'Moins cher',desc:'Divisez votre budget par 10'},{icon:Shield,value:'100%',label:'Couverture réglementaire',desc:'PLU, DTU, RE2020, PMR, incendie'}].map(s => (
            <div key={s.label} className="bg-white rounded-xl p-6 border border-slate-200 text-center hover:shadow-lg transition-all"><s.icon size={28} className="mx-auto text-orange-600 mb-3" /><p className="text-3xl font-bold text-slate-900">{s.value}</p><p className="text-sm font-semibold text-slate-700 mt-1">{s.label}</p><p className="text-xs text-slate-500 mt-1">{s.desc}</p></div>
          ))}
        </div>
      </section>
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl lg:text-3xl font-bold text-center text-slate-800 mb-12">Comment ça marche ?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[{num:'1',title:'Décrivez',desc:'Décrivez votre projet en langage naturel',icon:FileText},{num:'2',title:'Analyse',desc:'Analyse automatique du terrain et du PLU',icon:Play},{num:'3',title:'Programme',desc:'Génération du brief architectural',icon:PenTool},{num:'4',title:'Conformité',desc:'Vérification réglementaire complète',icon:Shield},{num:'5',title:'Dépôt',desc:'Dossier complet prêt à déposer',icon:Send}].map(s => (
              <div key={s.num} className="text-center"><div className="w-12 h-12 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center mx-auto mb-3 text-lg font-bold">{s.num}</div><s.icon size={20} className="mx-auto text-slate-400 mb-2" /><h3 className="text-sm font-semibold text-slate-800">{s.title}</h3><p className="text-xs text-slate-500 mt-1">{s.desc}</p></div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl lg:text-3xl font-bold text-center text-slate-800 mb-12">Ils nous font confiance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[{name:'Jean D.',role:'Architecte DPLG',text:'EDIFIA révolutionne notre façon de travailler. Le gain de temps est impressionnant.',avatar:'JD'},{name:'Sophie M.',role:'Propriétaire',text:'J\'ai obtenu mon permis de construire en 2 jours. Un service incroyable !',avatar:'SM'},{name:'Pierre L.',role:'Promoteur immobilier',text:'La conformité réglementaire est vérifiée en temps réel. Zéro surprise.',avatar:'PL'}].map(t => (
              <div key={t.name} className="bg-white rounded-xl p-5 border border-slate-200"><p className="text-sm text-slate-600 italic mb-4">"{t.text}"</p><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold">{t.avatar}</div><div><p className="text-sm font-semibold text-slate-800">{t.name}</p><p className="text-xs text-slate-500">{t.role}</p></div></div></div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 px-4"><div className="max-w-2xl mx-auto text-center"><h2 className="text-2xl font-bold text-slate-800 mb-4">Prêt à démarrer ?</h2><p className="text-slate-500 mb-6">Rejoignez des milliers de propriétaires qui ont accéléré leur construction avec EDIFIA.</p><Button size="lg" onClick={() => navigate('/register')} className="bg-orange-600 hover:bg-orange-700 text-white px-8">Créer un compte gratuit</Button></div></section>
      <Footer />
    </div>
  );
}
