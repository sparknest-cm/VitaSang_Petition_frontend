import './ProgramInfo.css';

export default function ProgramInfo({ registeredUser, onNavigate }) {
  const userFirstName = registeredUser?.prenom || 'Cher Citoyen';

  const pillars = [
    {
      id: 1,
      color: 'var(--primary)',
      gradBg: 'rgba(232, 93, 4, 0.08)',
      icon: (
        <svg width="24" height="24" fill="none" stroke="var(--primary)" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: 'Alertes géolocalisées',
      desc: 'Notification ciblée uniquement lors d\'une urgence sanguine dans votre ville.',
    },
    {
      id: 2,
      color: 'var(--green)',
      gradBg: 'rgba(29, 154, 91, 0.08)',
      icon: (
        <svg width="24" height="24" fill="none" stroke="var(--green)" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: 'Compatibilité sanguine',
      desc: 'Contacté uniquement si vous êtes le bon match pour le patient.',
    },
    {
      id: 3,
      color: 'var(--purple)',
      gradBg: 'rgba(138, 92, 246, 0.08)',
      icon: (
        <svg width="24" height="24" fill="none" stroke="var(--purple)" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: 'Confidentialité totale',
      desc: 'Données protégées. Vous restez libre d\'accepter ou refuser à tout moment.',
    },
  ];

  return (
    <div className="program-screen animate-fade-in">

      {/* ── Bouton retour — haut gauche ── */}
      {onNavigate && (
        <button className="program-back-btn" onClick={() => onNavigate('confirm', registeredUser)}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Retour
        </button>
      )}

      {/* ── Bouton "Passer" — haut droite ── */}
      {onNavigate && (
        <button className="program-skip-btn" onClick={() => onNavigate('confirm', registeredUser)}>
          Pas maintenant
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}

      <div className="program-wrapper">

        {/* ── En-tête avec mascotte entre titre et intro ── */}
        <div className="program-header">
          <h1 className="program-title">
            Rejoignez le Réseau Citoyen de{' '}
            <span className="program-title-accent">Donneurs Volontaires</span>
          </h1>

          {/* Mascotte illustrative — entre le titre et l'intro */}
          <div className="program-mascot-wrap">
            <svg className="animate-float program-mascot-svg" viewBox="0 0 260 245" fill="none">
              {/* Bras levé */}
              <path d="M148 140 Q210 95 198 48" stroke="#C94B00" strokeWidth="22" strokeLinecap="round" />
              <ellipse cx="196" cy="40" rx="20" ry="17" fill="#E85D04" />
              <path d="M187 40 Q182 24 189 18 Q197 12 201 24" stroke="rgba(255,255,255,0.9)" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M185 44 Q183 34 188 31" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              <path d="M190 46 Q188 35 194 33" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              {/* Corps */}
              <path d="M100 12C100 12 32 102 32 155a68 68 0 00136 0c0-53-68-143-68-143z" fill="var(--primary)" />
              {/* Reflet */}
              <path d="M78 55 Q68 90 66 125" stroke="rgba(255,255,255,0.18)" strokeWidth="10" strokeLinecap="round" fill="none" />
              {/* Joues */}
              <ellipse cx="68" cy="170" rx="12" ry="8" fill="rgba(255,200,150,0.35)" />
              <ellipse cx="132" cy="170" rx="12" ry="8" fill="rgba(255,200,150,0.35)" />
              {/* Yeux heureux */}
              <path d="M74 150 Q83 140 92 150" stroke="white" strokeWidth="4.5" strokeLinecap="round" fill="none" />
              <path d="M108 150 Q117 140 126 150" stroke="white" strokeWidth="4.5" strokeLinecap="round" fill="none" />
              {/* Sourire */}
              <path d="M80 174 Q100 196 120 174" stroke="white" strokeWidth="5.5" strokeLinecap="round" fill="none" />
            </svg>
          </div>

          <p className="program-intro">
            Bonjour <strong style={{ color: 'var(--primary)' }}>{userFirstName}</strong> — au Cameroun, des centaines de familles
            luttent chaque année contre le temps pour trouver un donneur compatible.
            Votre inscription peut changer ça.
          </p>
        </div>

        {/* ── 3 piliers en ligne ── */}
        <div className="program-pillars">
          {pillars.map(({ id, color, gradBg, icon, title, desc }) => (
            <div key={id} className="program-pillar">
              <div className="program-pillar-header">
                <div className="program-pillar-icon" style={{ background: gradBg }}>
                  {icon}
                </div>
                <h4 className="program-pillar-title" style={{ color }}>{title}</h4>
              </div>
              <p className="program-pillar-desc">{desc}</p>
            </div>
          ))}
        </div>

        {/* ── CTA principal ── */}
        <div className="program-cta">
          <button
            onClick={() => onNavigate('volunteer_form', registeredUser)}
            className="btn-primary cursor-pointer"
            style={{ borderRadius: '30px', padding: '14px 40px', fontSize: '14px', fontWeight: 700 }}
          >
            Rejoindre la Communauté &rarr;
          </button>
        </div>

      </div>
    </div>
  );
}
