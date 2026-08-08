import { useState } from 'react';
import DonorAvatars from '../components/DonorAvatars';
import HappyMascotte from '../assets/HappyMascotte.png';
import tiredMascotte from '../assets/tiredMascotte.png';
import confirmeMascotte from '../assets/confirmeMascotte.png';
import './Landing.css';

export default function Landing({ stats, onNavigate, onOpenPrivacy }) {
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
            {/* Mascotte Joyeuse au Centre */}
            <img
              src={HappyMascotte}
              alt="Mascotte Joyeuse VitaSang"
              className="animate-float"
              style={{ width: '220px', height: 'auto', filter: 'drop-shadow(0 12px 24px rgba(200, 55, 55, 0.15))' }}
            />

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

            {/* Mascotte Épuisée / Urgence */}
            <img
              src={tiredMascotte}
              alt="Mascotte Urgence VitaSang"
              className="animate-float"
              style={{ width: '210px', height: 'auto', filter: 'drop-shadow(0 12px 24px rgba(200, 55, 55, 0.15))' }}
            />

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

        {/* ═══════════════════════════════════════════
            SECTION : Déjà inscrit ? Mise à jour du profil citoyen
        ════════════════════════════════════════════ */}
        <div className="w-full flex justify-center text-center mt-16 md:mt-24 mb-1">
          <span className="landing-why-badge">Espace Citoyen</span>
        </div>

        <div className="landing-update-profile-card">
          {/* Côté Gauche : Texte & Lien */}
          <div className="update-profile-content text-left max-w-xl">
            <h3 className="font-display text-2xl md:text-3xl font-bold text-[var(--text)] leading-snug mb-3 mt-0">
              Déjà inscrit ? Mettez à jour votre <span style={{ color: 'var(--primary)' }}>profil citoyen</span>
            </h3>





            {/* Mascotte sur petit écran uniquement (entre le titre et la description) */}
            <div className="update-profile-mascot-mobile md:hidden flex justify-center my-4">
              <img
                src={confirmeMascotte}
                alt="Mascotte VitaSang Profil"
                className="animate-float"
                style={{ width: '130px', height: 'auto', filter: 'drop-shadow(0 12px 24px rgba(200, 55, 55, 0.15))' }}
              />
            </div>

            <p className="text-xs md:text-sm text-[var(--text-soft)] leading-relaxed mb-5">
              Vous avez déjà signé la pétition ou rejoint la communauté ? Vos données personnelles et médicales sont protégées et restent sous votre contrôle. Mettez à jour votre ville, votre groupe sanguin ou votre disponibilité d'urgence à tout moment en toute sécurité.
            </p>

            <div>
              <button
                type="button"
                onClick={() => onNavigate('mon_profil')}
                className="underline hover:text-[var(--primary)] transition-colors cursor-pointer bg-transparent border-none p-0 inline font-medium text-[var(--text-soft)] text-xs"
              >
                Modifier mon profil citoyen
              </button>
            </div>
          </div>

          {/* Côté Droit : Mascotte sur grand écran uniquement */}
          <div className="update-profile-mascot-desktop hidden md:flex">
            <img
              src={confirmeMascotte}
              alt="Mascotte VitaSang Profil"
              className="animate-float"
              style={{ width: '160px', height: 'auto', filter: 'drop-shadow(0 12px 24px rgba(200, 55, 55, 0.15))' }}
            />
          </div>
        </div>



      </section>

    </div>
  );
}


