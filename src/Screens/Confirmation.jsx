import { useState } from 'react';
import { enregistrerPartage } from '../connection/supabase';
import './Confirmation.css';

export default function Confirmation({ registeredUser, onNavigate }) {
  const [copied, setCopied] = useState(false);

  const userFirstName = registeredUser?.prenom || 'Cher Citoyen';
  const referralCode  = registeredUser?.code_parrainage || 'VS-A3F9K';
  const isVolunteer   = registeredUser?.isVolunteer || false;

  const BASE_FRONTEND_URL = typeof window !== 'undefined' && window.location.origin.includes('localhost')
    ? 'https://vitasang.org'
    : window.location.origin;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${BASE_FRONTEND_URL}/?ref=${referralCode}`);
    setCopied(true);
    if (registeredUser?.id) enregistrerPartage(registeredUser.id, 'lien_copie');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = (plateforme) => {
    if (registeredUser?.id) enregistrerPartage(registeredUser.id, plateforme);
    const link = encodeURIComponent(`${BASE_FRONTEND_URL}/?ref=${referralCode}&utm_source=${plateforme}`);
    const msg  = encodeURIComponent("Rejoins-moi pour signer la pétition citoyenne VITA SANG et aidons à bâtir un réseau de donneurs de sang solide au Cameroun ! 🇨🇲 ❤️");
    const urls = {
      whatsapp: `https://api.whatsapp.com/send?text=${msg}%20${link}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${link}`,
      x:        `https://x.com/intent/tweet?text=${msg}&url=${link}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${link}`,
    };
    if (urls[plateforme]) window.open(urls[plateforme], '_blank');
  };

  const shareUrl = `${BASE_FRONTEND_URL.replace(/^https?:\/\//, '')}/?ref=${referralCode}`;

  const socialButtons = [
    {
      id: 'whatsapp', color: '#25D366', title: 'WhatsApp',
      icon: <path d="M17.472 14.382c-.022-.015-.502-.257-.347-.174l-.45-.228c-.13-.06-.24-.075-.33-.075-.12 0-.255.045-.375.14-.13.11-.47.575-.57.69-.1.11-.21.13-.38.045-.17-.085-.725-.268-1.38-.85-.51-.453-.855-.913-.956-1.085-.1-.17-.01-.26.075-.345.08-.08.175-.205.26-.305.085-.1.115-.17.175-.285.06-.11.03-.21-.015-.3-.045-.09-.41-1.005-.56-1.37-.15-.365-.3-.315-.41-.315-.1 0-.21-.01-.32-.01-.11 0-.285.04-.435.2-.15.16-.57.555-.57 1.355 0 .8.58 1.57.66 1.68.08.11 1.14 1.742 2.762 2.443.385.167.685.267.92.342.387.123.74.105 1.02.063.31-.047 1-.41 1.14-.805.145-.395.145-.735.1-.805-.045-.07-.17-.11-.325-.19zM12 2C6.477 2 2 6.477 2 12c0 2.01.59 3.88 1.61 5.46L2 22l4.72-1.24C8.22 21.49 9.99 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.85 0-3.51-.55-4.9-1.5l-.35-.24-2.85.75.76-2.77-.26-.41C3.44 14.43 3 12.76 3 12c0-4.96 4.04-9 9-9s9 4.04 9 9-4.04 9-9 9z" />,
    },
    {
      id: 'facebook', color: '#1877F2', title: 'Facebook',
      icon: <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z" />,
    },
    {
      id: 'x', color: '#000000', title: 'X (Twitter)',
      icon: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />,
    },
    {
      id: 'linkedin', color: '#0A66C2', title: 'LinkedIn',
      icon: <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />,
    },
  ];

  return (
    <div className="confirm-screen animate-fade-in">

      {/* ── Bouton retour fixé en haut à gauche ── */}
      {onNavigate && (
        <button className="confirm-back-btn" onClick={() => onNavigate('landing')}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Accueil
        </button>
      )}

      <div className="confirm-layout">

        {/* ════════════════════════════════════════════
            PANNEAU GAUCHE
        ════════════════════════════════════════════ */}
        <div className="confirm-left">

          {/* Mascotte heureuse avec bras levé */}
          <div className="confirm-mascot-wrap">
            <svg className="animate-float confirm-mascot-svg" viewBox="0 0 260 245" fill="none">

              {/* Bras levé (dessiné avant le corps, visible uniquement la partie haute) */}
              <path
                d="M148 140 Q210 95 198 48"
                stroke="#C94B00"
                strokeWidth="22"
                strokeLinecap="round"
              />
              {/* Poing (main) */}
              <ellipse cx="196" cy="40" rx="20" ry="17" fill="#E85D04" />
              {/* Pouce levé */}
              <path
                d="M187 40 Q182 24 189 18 Q197 12 201 24"
                stroke="rgba(255,255,255,0.9)"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
              {/* Doigts */}
              <path d="M185 44 Q183 34 188 31" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              <path d="M190 46 Q188 35 194 33" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>

              {/* Corps goutte de sang */}
              <path
                d="M100 12C100 12 32 102 32 155a68 68 0 00136 0c0-53-68-143-68-143z"
                fill="var(--primary)"
              />
              {/* Reflet */}
              <path
                d="M78 55 Q68 90 66 125"
                stroke="rgba(255,255,255,0.18)"
                strokeWidth="10"
                strokeLinecap="round"
                fill="none"
              />

              {/* Joues rosées */}
              <ellipse cx="68" cy="170" rx="12" ry="8" fill="rgba(255,200,150,0.35)" />
              <ellipse cx="132" cy="170" rx="12" ry="8" fill="rgba(255,200,150,0.35)" />

              {/* Yeux heureux (arcs ^) */}
              <path d="M74 150 Q83 140 92 150" stroke="white" strokeWidth="4.5" strokeLinecap="round" fill="none" />
              <path d="M108 150 Q117 140 126 150" stroke="white" strokeWidth="4.5" strokeLinecap="round" fill="none" />

              {/* Grand sourire */}
              <path d="M80 174 Q100 196 120 174" stroke="white" strokeWidth="5.5" strokeLinecap="round" fill="none" />
            </svg>
          </div>

          {/* Remerciement */}
          {isVolunteer ? (
            <div className="confirm-hero">
              <h1 className="confirm-title">Félicitations, {userFirstName}&nbsp;🎉</h1>
              <p className="confirm-subtitle">
                Votre profil de Donateur Volontaire est actif. Vous serez contacté en priorité lors d'une urgence sanguine dans votre région. Merci d'être là.
              </p>
            </div>
          ) : (
            <div className="confirm-hero">
              <h1 className="confirm-title">Merci, {userFirstName}&nbsp;🎉</h1>
              <p className="confirm-subtitle">
                Votre signature a été enregistrée. Chaque nom compte, et le vôtre vient d'apporter de l'espoir à des familles qui en ont besoin.
              </p>
            </div>
          )}

          {/* Invitation Réseau VitaSang — uniquement pour les signataires simples */}
          {!isVolunteer && (
            <div className="confirm-network-card animate-fade-in">
              <h3 className="font-display font-bold text-sm" style={{ color: 'var(--text)', margin: 0 }}>
                ❤️ Allez encore plus loin pour sauver des vies
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-soft)', lineHeight: '1.65', margin: 0 }}>
                Rejoignez le Réseau VitaSang et soyez alerté en priorité lors d'une urgence sanguine dans votre ville.
              </p>
              <button
                onClick={() => onNavigate('program_info', registeredUser)}
                className="btn-primary w-full cursor-pointer"
                style={{ borderRadius: '30px', padding: '11px 20px', fontSize: '13px', fontWeight: 700 }}
              >
                Rejoindre le Réseau VitaSang &rarr;
              </button>
            </div>
          )}
        </div>

        {/* ════════════════════════════════════════════
            PANNEAU DROIT — Carte de partage
        ════════════════════════════════════════════ */}
        <div className="confirm-right">
          <div className="confirm-share-card">

            {/* Message touchant */}
            <div className="confirm-share-header-text">
              <p className="confirm-share-title">Un lien, des vies sauvées.</p>
              <p className="confirm-share-sub">
                Votre entourage peut faire la différence. Partagez votre lien personnel et mobilisez ceux qui comptent pour vous.
              </p>
            </div>

            {/* Pill box URL */}
            <div className="confirm-pill-box">
              <span className="confirm-pill-url" title={shareUrl}>{shareUrl}</span>
              <button
                onClick={handleCopyLink}
                className="btn-primary"
                style={{ borderRadius: '30px', padding: '6px 14px', fontSize: '11px', whiteSpace: 'nowrap' }}
              >
                {copied ? '✓ Copié !' : 'Copier'}
              </button>
            </div>

            {/* Séparateur */}
            <div className="confirm-divider"><span>Partager</span></div>

            {/* 4 boutons icône seulement, sur une ligne */}
            <div className="confirm-social-row">
              {socialButtons.map(({ id, color, title, icon }) => (
                <button
                  key={id}
                  onClick={() => handleShare(id)}
                  className="confirm-social-btn"
                  style={{ background: color }}
                  title={title}
                >
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">{icon}</svg>
                </button>
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
