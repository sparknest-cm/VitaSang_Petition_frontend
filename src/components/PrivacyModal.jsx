import { useEffect } from 'react';
import MascotteConfidentialiter from '../assets/MascotteConfidentialiter.png';
import './PrivacyModal.css';

export default function PrivacyModal({ isOpen, onClose }) {
  // Empêcher le défilement du corps quand le panneau est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Fermeture sur touche Echap
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="privacy-modal-overlay" onClick={onClose}>
      <div className="privacy-drawer-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Header du Drawer / Panel (Bouton de fermeture uniquement) */}
        <div className="privacy-drawer-header">
          <button className="privacy-close-btn" onClick={onClose} aria-label="Fermer">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Corps du Panel (Scrollable) */}
        <div className="privacy-drawer-body">

          {/* BLOC HERO MASCOTTE (Premier bloc blanc dans le body) */}
          <div className="privacy-card-block privacy-hero-block">
            <h4 className="font-display font-bold text-base md:text-lg text-[var(--text)] text-center m-0">
              Vos données sont entre de bonnes mains
            </h4>

            <div className="privacy-mascot-img-wrapper">
              <img
                src={MascotteConfidentialiter}
                alt="Mascotte Protection des Données VitaSang"
                className="privacy-mascot-img-large animate-float"
              />
            </div>

            <p className="text-xs text-[var(--text-soft)] leading-relaxed text-center max-w-xs mx-auto m-0">
              Chez VitaSang, nous protégeons vos informations personnelles et de santé avec une rigueur absolue.
            </p>
          </div>

          {/* BLOC 1 — Non-Commercialisation (Fond Blanc) */}
          <div className="privacy-card-block">
            <div className="privacy-card-header">
              <span className="privacy-card-num">01</span>
              <h4 className="privacy-card-title">Non-Commercialisation</h4>
            </div>
            <p className="privacy-card-desc">
              VitaSang est une initiative citoyenne et humanitaire non-lucrative. Nous prenons l'engagement ferme que :
            </p>
            <ul className="privacy-card-list">
              <li><strong>Aucune revente :</strong> Vos données ne seront jamais vendues, louées ou cédées à des entreprises privées, courtiers en données ou annonceurs.</li>
              <li><strong>Zero Spam :</strong> Aucun démarchage commercial, publicitaire ou SMS indésirable ne vous sera envoyé.</li>
            </ul>
          </div>

          {/* BLOC 2 — Données Collectées & Utilité (Fond Blanc) */}
          <div className="privacy-card-block">
            <div className="privacy-card-header">
              <span className="privacy-card-num">02</span>
              <h4 className="privacy-card-title">Données Collectées & Utilisation</h4>
            </div>
            <p className="privacy-card-desc">
              Chaque donnée demandée répond à un besoin technique ou médical précis :
            </p>
            <ul className="privacy-card-list">
              <li><strong>Nom & Prénom :</strong> Authentifier votre signature citoyenne.</li>
              <li><strong>Téléphone (+237) :</strong> Vous contacter uniquement lors d'une alerte d'urgence sanguine dans votre ville.</li>
              <li><strong>Ville & Région :</strong> Cibler géographiquement les alertes d'urgence.</li>
              <li><strong>Groupe Sanguin :</strong> Déterminer la compatibilité lors des besoins de dons urgents.</li>
            </ul>
          </div>

          {/* BLOC 3 — Sécurité & Confidentialité (Fond Blanc) */}
          <div className="privacy-card-block">
            <div className="privacy-card-header">
              <span className="privacy-card-num">03</span>
              <h4 className="privacy-card-title">Sécurité & Confidentialité</h4>
            </div>
            <p className="privacy-card-desc">
              Vos informations sont stockées dans des bases de données hautement sécurisées (chiffrement SSL/HTTPS et contrôles d'accès Supabase RLS).
            </p>
            <p className="privacy-card-desc mt-2">
              Votre numéro de téléphone et votre groupe sanguin ne sont <strong>jamais affichés publiquement</strong> sur l'application.
            </p>
          </div>

          {/* BLOC 4 — Vos Droits & Droit à l'Oubli (Fond Blanc) */}
          <div className="privacy-card-block">
            <div className="privacy-card-header">
              <span className="privacy-card-num">04</span>
              <h4 className="privacy-card-title">Vos Droits & Droit à l'Oubli</h4>
            </div>
            <p className="privacy-card-desc">
              Vous gardez le contrôle total de vos données à tout moment :
            </p>
            <ul className="privacy-card-list">
              <li><strong>Désinscription :</strong> Retrait de la liste des donneurs d'urgence sur simple demande.</li>
              <li><strong>Suppression définitive :</strong> Effacement complet de votre compte et de vos données sur simple e-mail à <strong>contact@vitasang.org</strong>.</li>
            </ul>
          </div>

        </div>

        {/* Footer du Drawer / Panel */}
        <div className="privacy-drawer-footer">
          <button className="btn-primary w-full" onClick={onClose} style={{ borderRadius: '30px', padding: '12px 24px', fontSize: '13px' }}>
            J'ai compris & Je valide
          </button>
        </div>

      </div>
    </div>
  );
}
