import { useState } from 'react';
import { enregistrerPartage } from '../connection/supabase';
import './Confirmation.css';

export default function Confirmation({ registeredUser, onNavigate }) {
  const [copied, setCopied] = useState(false);

  const userFirstName = registeredUser?.prenom || 'Idriss';
  const referralCode = registeredUser?.code_parrainage || 'VS-A3F9K';

  const handleCopyLink = () => {
    const personalLink = `${window.location.origin}/petition?ref=${referralCode}`;
    navigator.clipboard.writeText(personalLink);
    setCopied(true);
    if (registeredUser?.id) {
      enregistrerPartage(registeredUser.id, 'lien_copie');
    }
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (plateforme) => {
    if (registeredUser?.id) {
      enregistrerPartage(registeredUser.id, plateforme);
    }
    const personalLink = encodeURIComponent(`${window.location.origin}/petition?ref=${referralCode}&utm_source=${plateforme}`);
    const text = encodeURIComponent("Rejoins-moi pour signer la pétition citoyenne VITA SANG et aidons à bâtir un réseau de donneurs de sang solide au Cameroun ! 🇨🇲 ❤️");
    
    let url = '';
    if (plateforme === 'whatsapp') {
      url = `https://api.whatsapp.com/send?text=${text}%20${personalLink}`;
    } else if (plateforme === 'facebook') {
      url = `https://www.facebook.com/sharer/sharer.php?u=${personalLink}`;
    } else if (plateforme === 'x') {
      url = `https://x.com/intent/tweet?text=${text}&url=${personalLink}`;
    } else if (plateforme === 'linkedin') {
      url = `https://www.linkedin.com/sharing/share-offsite/?url=${personalLink}`;
    }

    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="confirm-screen animate-fade-in">
      <div className="confirm-wrapper">
        
        {/* Mascotte Goutte Flottante */}
        <svg className="mx-auto mb-5 animate-float" width="80" height="80" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C12 2 5 10.5 5 15a7 7 0 0014 0c0-4.5-7-13-7-13z" fill="var(--primary)" />
        </svg>

        {/* Message de Remerciement (Texte Maquette) + Espacement Accru */}
        <div className="thankyou-text-wrapper">
          <h1 className="font-display text-3xl font-bold mb-3 text-[var(--text)]">
            Merci, {userFirstName}.
          </h1>
          <p className="text-[var(--text-soft)] text-sm md:text-base max-w-sm mx-auto leading-relaxed">
            Votre engagement participe à la construction d'un réseau citoyen capable de sauver des vies.
          </p>
        </div>

        {/* Bloc de Partage Réduit & Compact */}
        <div className="confirm-clean-card">
          <p className="text-xs font-semibold mb-3 text-[var(--text)] text-left">
            Votre lien personnel : invitez votre entourage à signer
          </p>

          {/* Pill Box du lien */}
          <div className="referral-pill-box">
            <span className="text-xs font-mono flex-1 text-left truncate text-[var(--primary)] select-all font-bold">
              vitasang.org/petition?ref={referralCode}
            </span>
            <button
              onClick={handleCopyLink}
              className="btn-primary"
              style={{ borderRadius: '30px', padding: '6px 14px', fontSize: '11px' }}
            >
              {copied ? '✓ Copié' : 'Copier'}
            </button>
          </div>

          {/* Icones Réseaux Sociaux Compactes */}
          <div className="flex justify-center gap-3 mt-4">
            {/* WhatsApp */}
            <button
              onClick={() => handleShare('whatsapp')}
              className="social-share-btn"
              style={{ background: '#25D366' }}
              title="Partager sur WhatsApp"
            >
              <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.022-.015-.022-.015-.502-.257-.09-.045-.224-.112-.347-.174l-.45-.228c-.13-.06-.24-.075-.33-.075-.12 0-.255.045-.375.14-.13.11-.47.575-.57.69-.1.11-.21.13-.38.045-.17-.085-.725-.268-1.38-.85-.51-.453-.855-.913-.956-1.085-.1-.17-.01-.26.075-.345.08-.08.175-.205.26-.305.085-.1.115-.17.175-.285.06-.11.03-.21-.015-.3-.045-.09-.41-1.005-.56-1.37-.15-.365-.3-.315-.41-.315-.1 0-.21-.01-.32-.01-.11 0-.285.04-.435.2-.15.16-.57.555-.57 1.355 0 .8.58 1.57.66 1.68.08.11 1.14 1.742 2.762 2.443.385.167.685.267.92.342.387.123.74.105 1.02.063.31-.047 1-.41 1.14-.805.145-.395.145-.735.1-.805-.045-.07-.17-.11-.325-.19zM12 2C6.477 2 2 6.477 2 12c0 2.01.59 3.88 1.61 5.46L2 22l4.72-1.24C8.22 21.49 9.99 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.85 0-3.51-.55-4.9-1.5l-.35-.24-2.85.75.76-2.77-.26-.41C3.44 14.43 3 12.76 3 12c0-4.96 4.04-9 9-9s9 4.04 9 9-4.04 9-9 9z" />
              </svg>
            </button>

            {/* Facebook */}
            <button
              onClick={() => handleShare('facebook')}
              className="social-share-btn"
              style={{ background: '#1877F2' }}
              title="Partager sur Facebook"
            >
              <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z" />
              </svg>
            </button>

            {/* X */}
            <button
              onClick={() => handleShare('x')}
              className="social-share-btn"
              style={{ background: '#000000' }}
              title="Partager sur X"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </button>

            {/* LinkedIn */}
            <button
              onClick={() => handleShare('linkedin')}
              className="social-share-btn"
              style={{ background: '#0A66C2' }}
              title="Partager sur LinkedIn"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Bouton de retour */}
        {onNavigate && (
          <div className="mt-6">
            <button
              onClick={() => onNavigate('landing')}
              className="text-xs font-semibold text-[var(--text-soft)] hover:text-[var(--primary)] transition cursor-pointer"
            >
              &larr; Retour à l'accueil
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
