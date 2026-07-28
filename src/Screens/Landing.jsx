import { useState } from 'react';
import DonorAvatars from '../components/DonorAvatars';
import './Landing.css';

export default function Landing({ stats, onNavigate }) {
  const [loading, setLoading] = useState(false);

  const handleStart = () => {
    setLoading(true);
    setTimeout(() => {
      onNavigate('form');
      setLoading(false);
    }, 450);
  };

  return (
    <div className="landing-screen animate-fade-in">
      <div className="landing-split-container">

        {/* Côté Gauche : Présentation & CTA */}
        <div className="landing-left-panel">
          <div className="text-left max-w-xl">
            <span className="inline-block text-[11px] font-semibold tracking-widest uppercase px-3.5 py-1 rounded-full mb-5" style={{ background: 'var(--tint)', color: 'var(--primary)', border: 'none' }}>
              Une initiative SparkNest
            </span>

            <h1 className="font-display text-4xl md:text-5xl font-bold leading-[1.08] mb-5 text-[var(--text)]">
              Chaque signature <span style={{ color: 'var(--primary)' }}>rapproche</span> un donneur d'un receveur.
            </h1>

            <p className="text-base mb-8 text-[var(--text-soft)] leading-relaxed">
              Au Cameroun, trouver du sang à temps reste un parcours du combattant. VitaSang construit le réseau citoyen qui changera ça, et tout commence par votre signature.
            </p>

            <div className="action-row">
              <button
                onClick={handleStart}
                disabled={loading}
                className="btn-primary"
                style={{ borderRadius: '30px' }}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    <span>Chargement...</span>
                  </>
                ) : (
                  <span>Je signe la pétition &rarr;</span>
                )}
              </button>

              {/* Avatars de donateurs */}
              <DonorAvatars totalSignatures={stats.total_signatures} />
            </div>
          </div>
        </div>

        {/* Côté Droit : Mascotte Totalement Dégagée avec Cartes Harmoniquement Placées */}
        <div className="landing-right-panel">
          <div className="mascot-stage">
            {/* Mascotte Goutte de Sang au Centre */}
            <svg className="animate-float" width="200" height="230" viewBox="0 0 200 230" fill="none">
              <path d="M100 10C100 10 30 100 30 155a70 70 0 00140 0c0-55-70-145-70-145z" fill="var(--primary)" />
              <circle cx="82" cy="150" r="6" fill="var(--tint)" opacity="0.9" />
              <circle cx="118" cy="150" r="6" fill="var(--tint)" opacity="0.9" />
              <path d="M85 170 Q100 185 115 170" stroke="var(--tint)" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.9" />
            </svg>

            {/* Carte 1 : Signatures (Haut Gauche) */}
            <div className="stat-float-card animate-float-d1" style={{ top: '-6%', left: '-10%' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--tint)] flex items-center justify-center text-[var(--primary)] shrink-0">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 200 230">
                    <path d="M100 10C100 10 30 100 30 155a70 70 0 00140 0c0-55-70-145-70-145z" />
                  </svg>
                </div>
                <div>
                  <div className="font-display text-xl font-bold" style={{ color: 'var(--primary)' }}>
                    {stats.total_signatures.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-[var(--text-soft)]">Signatures</div>
                </div>
              </div>
            </div>

            {/* Carte 2 : Prêts en Urgence (Droite) */}
            <div className="stat-float-card animate-float-d2" style={{ top: '42%', right: '-12%' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <div className="font-display text-xl font-bold" style={{ color: 'var(--green)' }}>
                    {stats.total_prets_urgence.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-[var(--text-soft)]">Prêts en urgence</div>
                </div>
              </div>
            </div>

            {/* Carte 3 : Ambassadeurs (Bas Gauche) */}
            <div className="stat-float-card animate-float-d3" style={{ bottom: '-6%', left: '-6%' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-display text-xl font-bold" style={{ color: 'var(--purple)' }}>
                    {stats.total_ambassadeurs_potentiels.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-[var(--text-soft)]">Ambassadeurs</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
