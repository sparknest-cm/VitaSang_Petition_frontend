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

        {/* Côté Droit : Mascotte & Cartes Flottantes Adaptatives */}
        <div className="landing-right-panel">
          <div className="mascot-stage">
            {/* Mascotte Goutte de Sang au Centre */}
            <svg className="animate-float" width="200" height="230" viewBox="0 0 200 230" fill="none">
              <path d="M100 10C100 10 30 100 30 155a70 70 0 00140 0c0-55-70-145-70-145z" fill="var(--primary)" />
              <circle cx="82" cy="150" r="6" fill="var(--tint)" opacity="0.9" />
              <circle cx="118" cy="150" r="6" fill="var(--tint)" opacity="0.9" />
              <path d="M85 170 Q100 185 115 170" stroke="var(--tint)" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.9" />
            </svg>

            {/* Carte 1 : Signatures */}
            <div className="stat-float-card animate-float-d1 stat-card-1">
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

            {/* Carte 2 : Prêts en Urgence */}
            <div className="stat-float-card animate-float-d2 stat-card-2">
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

            {/* Carte 3 : Ambassadeurs */}
            <div className="stat-float-card animate-float-d3 stat-card-3">
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

      {/* ═══════════════════════════════════════════
          SECTION : Pourquoi VitaSang ?
      ════════════════════════════════════════════ */}
      <section className="landing-why-section">
        <div className="landing-why-header">
          <span className="landing-why-badge">Notre mission</span>
          <h2 className="landing-why-title">
            Pourquoi <span style={{ color: 'var(--primary)' }}>VitaSang</span> ?
          </h2>
          <p className="landing-why-sub">
            Un projet citoyen né d'une réalité camerounaise : chaque jour, des vies sont perdues faute d'un donneur disponible au bon moment.
          </p>
        </div>

        <div className="landing-why-cards">

          {/* Bloc 1 — Le problème */}
          <div className="landing-why-card">
            <div className="landing-why-num" style={{ color: 'var(--primary)' }}>01</div>
            <div className="landing-why-card-header">
              <div className="landing-why-icon" style={{ background: 'rgba(232, 93, 4, 0.08)' }}>
                <svg width="26" height="26" fill="none" stroke="var(--primary)" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="landing-why-card-title">Une urgence silencieuse</h3>
            </div>
            <p className="landing-why-card-desc">
              Au Cameroun, les banques de sang sont souvent insuffisantes. Des familles parcourent des kilomètres pour trouver un donneur compatible, parfois trop tard.
            </p>
          </div>

          {/* Bloc 2 — La solution */}
          <div className="landing-why-card">
            <div className="landing-why-num" style={{ color: 'var(--green)' }}>02</div>
            <div className="landing-why-card-header">
              <div className="landing-why-icon" style={{ background: 'rgba(29, 154, 91, 0.08)' }}>
                <svg width="26" height="26" fill="none" stroke="var(--green)" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="landing-why-card-title">Un réseau de citoyens engagés</h3>
            </div>
            <p className="landing-why-card-desc">
              VitaSang construit une plateforme de mise en relation géolocalisée entre donneurs volontaires et patients dans le besoin — rapide, fiable, gratuite.
            </p>
          </div>

          {/* Bloc 3 — L'objectif */}
          <div className="landing-why-card">
            <div className="landing-why-num" style={{ color: 'var(--purple)' }}>03</div>
            <div className="landing-why-card-header">
              <div className="landing-why-icon" style={{ background: 'rgba(138, 92, 246, 0.08)' }}>
                <svg width="26" height="26" fill="none" stroke="var(--purple)" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="landing-why-card-title">Votre signature, notre levier</h3>
            </div>
            <p className="landing-why-card-desc">
              Chaque signataire renforce notre crédibilité auprès des autorités et partenaires. Ensemble, nous démontrons qu'une solution citoyenne est possible et nécessaire.
            </p>
          </div>

        </div>

        {/* ═══════════════════════════════════════════
            BANNIÈRE EN SAVOIR PLUS SUR VITASANG (FOND TRANSPARENT SANS BORDURE)
        ════════════════════════════════════════════ */}
        <div className="landing-learn-more-banner">
          {/* Côté Gauche : Mascotte Joyeuse & Éléments décoratifs */}
          <div className="learn-more-mascot-wrap">
            <div className="learn-more-glow-aura"></div>

            {/* Badge flottant 1 */}
            <div className="learn-more-badge badge-top-left animate-float-d1">
              <span>🛡️</span>
              <span>Réseau Sécurisé</span>
            </div>

            {/* Mascotte Goutte de Sang Expressive avec Mains Levées */}
            <svg className="animate-float" width="165" height="195" viewBox="0 0 200 230" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="mascotGrad" x1="100" y1="10" x2="100" y2="210" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#E55353" />
                  <stop offset="65%" stopColor="var(--vs-red-primary, #C83737)" />
                  <stop offset="100%" stopColor="var(--vs-red-dark, #8C2626)" />
                </linearGradient>
              </defs>

              {/* Main levée gauche */}
              <ellipse cx="36" cy="105" rx="13" ry="9" fill="#C83737" transform="rotate(-35 36 105)" />
              <line x1="58" y1="126" x2="36" y2="105" stroke="#C83737" strokeWidth="7" strokeLinecap="round" />

              {/* Main levée droite */}
              <ellipse cx="164" cy="105" rx="13" ry="9" fill="#C83737" transform="rotate(35 164 105)" />
              <line x1="142" y1="126" x2="164" y2="105" stroke="#C83737" strokeWidth="7" strokeLinecap="round" />

              {/* Corps goutte */}
              <path d="M100 12C100 12 30 102 30 158a70 70 0 00140 0c0-56-70-146-70-146z" fill="url(#mascotGrad)" />

              {/* Reflet brillant */}
              <ellipse cx="70" cy="135" rx="15" ry="22" fill="#FFFFFF" opacity="0.25" transform="rotate(-18 70 135)" />

              {/* Yeux joyeux en arc (souriants) */}
              <path d="M74 148 Q82 138 90 148" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M110 148 Q118 138 126 148" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" fill="none" />

              {/* Joues rosées */}
              <circle cx="68" cy="158" r="8" fill="#F3C1C1" opacity="0.6" />
              <circle cx="132" cy="158" r="8" fill="#F3C1C1" opacity="0.6" />

              {/* Sourire joyeux */}
              <path d="M80 166 Q100 190 120 166 C115 186 85 186 80 166Z" fill="#591818" />
              <path d="M88 176 Q100 188 112 176 Q100 168 88 176Z" fill="#E55353" />

              {/* Étincelles */}
              <text x="38" y="85" fontSize="16" fill="#F3C1C1">✦</text>
              <text x="152" y="85" fontSize="16" fill="#F3C1C1">✦</text>
              <text x="96" y="8" fontSize="14" fill="#E55353">✨</text>
            </svg>

            {/* Badge flottant 2 */}
            <div className="learn-more-badge badge-bottom-right animate-float-d2">
              <span>⚡</span>
              <span>Urgence 24h/7</span>
            </div>
          </div>

          {/* Côté Droit : Texte Pro court & Spacieux */}
          <div className="learn-more-content">
            <span className="inline-block text-[10px] font-semibold tracking-widest uppercase px-3.5 py-1 rounded-full bg-[var(--tint)] text-[var(--primary)]">
              Découvrir l'écosystème
            </span>

            <h3 className="font-display text-2xl md:text-3xl font-bold text-[var(--text)] leading-tight">
              En savoir plus sur <span style={{ color: 'var(--primary)' }}>VitaSang</span>
            </h3>

            <p className="text-xs md:text-sm text-[var(--text-soft)] leading-relaxed max-w-lg">
              Découvrez la vision globale de VitaSang et notre plateforme numérique dédiée à la solidarité sanguine rapide, gratuite et accessible à tous au Cameroun.
            </p>

            <div className="pt-2">
              <a
                href="https://vitasangs.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-learn-more-styled"
              >
                <span>En savoir plus sur VitaSang</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>

      </section>

    </div>
  );
}

