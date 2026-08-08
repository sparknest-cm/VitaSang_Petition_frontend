import { useState } from 'react';
import { createPortal } from 'react-dom';
import { signerPetition } from '../connection/supabase';
import HappyMascotte from '../assets/HappyMascotte.png';
import './PetitionForm.css';

export default function PetitionForm({ onNavigate, onOpenPrivacy }) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [duplicatePhone, setDuplicatePhone] = useState(null);

  // Express Form State (Uniquement Nom, Prénom, Téléphone)
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: ''
  });

  const validatePhone = (tel) => /^6[0-9]{8}$/.test(tel.replace(/\s/g, ''));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nom.trim() || !formData.prenom.trim() || !formData.telephone.trim()) {
      setErrorMsg('Veuillez remplir votre Nom, Prénom et Téléphone.');
      return;
    }
    if (!validatePhone(formData.telephone)) {
      setErrorMsg('Le numéro de téléphone doit commencer par 6 et comporter 9 chiffres (ex: 6XX XXX XXX).');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get('ref');
      const utmSource = params.get('utm_source');

      const payload = {
        nom: formData.nom.trim(),
        prenom: formData.prenom.trim(),
        telephone: formData.telephone.replace(/\s/g, '').trim(),
        region: 'Centre', // Valeur par défaut avant profilage
        ville: 'Yaoundé',
        ref,
        canal_acquisition: utmSource || (ref ? 'whatsapp' : 'lien_direct')
      };

      const result = await signerPetition(payload);
      // Conserver les données saisies
      const fullUserData = { ...result, ...formData };
      onNavigate('confirm', fullUserData);
    } catch (err) {
      if (err.code === 'DUPLICATE_PHONE' || (err.message && err.message.toLowerCase().includes('déjà'))) {
        setDuplicatePhone(formData.telephone.replace(/\s/g, '').trim());
      } else {
        setErrorMsg(err.message || 'Une erreur est survenue lors de la signature.');
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="form-screen animate-fade-in">

      {/* Bouton retour fixé en haut à gauche */}
      {onNavigate && (
        <button className="confirm-back-btn" onClick={() => onNavigate('landing')}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Accueil
        </button>
      )}

      <div className="form-split-container">

        {/* Côté Gauche : Mascotte & Message Express */}
        <div className="form-left-panel">
          <div className="max-w-sm space-y-4 text-center md:text-left">
            <div>
              <span className="inline-block text-[10px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full bg-[var(--tint)] text-[var(--primary)] mb-3">
                Pétition Citoyenne VitaSang
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-2 text-[var(--text)] leading-tight">
                Signez la pétition en <span style={{ color: 'var(--primary)' }}>30 secondes</span>
              </h2>
              <p className="text-xs md:text-sm text-[var(--text-soft)] leading-relaxed">
                Votre signature apporte un soutien direct à la création du premier réseau citoyen d'urgence sanguine au Cameroun.
              </p>
            </div>

            <div className="flex justify-center pt-3">
              <img
                src={HappyMascotte}
                alt="Mascotte VitaSang"
                className="animate-float"
                style={{ width: '220px', height: 'auto', filter: 'drop-shadow(0 14px 28px rgba(200, 55, 55, 0.18))' }}
              />
            </div>
          </div>
        </div>

        {/* Côté Droit : Formulaire Express (Nom, Prénom, Téléphone) */}
        <div className="form-right-panel">
          <div className="maquette-form-card">
            <div className="mb-5 text-left">
              <h3 className="font-display font-bold text-lg text-[var(--text)]">Je signe la pétition</h3>
              <p className="text-xs text-[var(--text-soft)]">Indiquez simplement vos coordonnées de base.</p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200 text-left">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label-left">Nom *</label>
                  <input
                    required
                    type="text"
                    value={formData.nom}
                    onChange={e => setFormData({ ...formData, nom: e.target.value })}
                    className="form-input-custom"
                    placeholder="ex: Mbarga"
                  />
                </div>

                <div>
                  <label className="form-label-left">Prénom *</label>
                  <input
                    required
                    type="text"
                    value={formData.prenom}
                    onChange={e => setFormData({ ...formData, prenom: e.target.value })}
                    className="form-input-custom"
                    placeholder="ex: Charles"
                  />
                </div>
              </div>

              <div>
                <label className="form-label-left">Numéro de Téléphone *</label>
                <div className="flex gap-2 items-center">
                  <span className="px-3 py-2.5 rounded-xl bg-[var(--tint)] border border-[var(--border)] text-xs font-bold text-[var(--text)] shrink-0 flex items-center gap-1.5">
                    <span style={{ fontSize: '15px' }}>🇨🇲</span>
                    <span>+237</span>
                  </span>
                  <input
                    required
                    type="tel"
                    value={formData.telephone}
                    onChange={e => setFormData({ ...formData, telephone: e.target.value })}
                    className="form-input-custom flex-1"
                    placeholder="6XX XXX XXX"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full mt-4 cursor-pointer"
                style={{ borderRadius: '30px', padding: '12px 24px', fontSize: '13px' }}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    <span>Enregistrement...</span>
                  </>
                ) : (
                  <span>Signer la pétition &rarr;</span>
                )}
              </button>

              <p className="text-[10px] text-[var(--text-soft)] text-center mt-2 leading-relaxed">
                En signant, vous soutenez l'initiative VitaSang.{' '}
                {onOpenPrivacy && (
                  <button
                    type="button"
                    onClick={onOpenPrivacy}
                    className="underline hover:text-[var(--primary)] transition-colors cursor-pointer bg-transparent border-none p-0 inline font-medium text-[var(--text)]"
                  >
                    Protection des données & Confidentialité
                  </button>
                )}
              </p>
            </form>
          </div>
        </div>

      </div>

      {/* MODAL DE BLOCAGE NUMÉRO DÉJÀ EXISTANT (Bottom Sheet Drawer en bas de l'écran) */}
      {duplicatePhone && createPortal(
        <div className="fixed inset-0 z-[999999] bg-black/70 backdrop-blur-md flex items-end justify-center animate-fade-in p-0 sm:p-4" onClick={() => setDuplicatePhone(null)}>
          <div className="w-full max-w-md bg-[var(--surface)] border-t sm:border border-[var(--border)] rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl space-y-4 text-center animate-slide-up" onClick={e => e.stopPropagation()}>
            
            {/* Barre de drag tactile */}
            <div className="w-12 h-1.5 bg-[var(--border)] rounded-full mx-auto opacity-60 mb-1"></div>

            {/* Badge Icône d'avertissement centré */}
            <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-950/60 text-[#C83737] mx-auto flex items-center justify-center font-bold text-2xl shadow-sm">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            {/* Titre & Message explicatif centré */}
            <div className="space-y-2 text-center">
              <h3 className="font-display font-bold text-xl text-[var(--text)] leading-snug">
                Numéro Déjà Enregistré
              </h3>
              <p className="text-xs text-[var(--text-soft)] leading-relaxed max-w-xs mx-auto text-center">
                Le numéro de téléphone <strong className="text-[var(--text)] font-mono font-bold">+237 {duplicatePhone}</strong> a déjà été utilisé pour signer la pétition citoyenne VitaSang.
              </p>
            </div>

            {/* Bouton de Fermeture */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setDuplicatePhone(null)}
                className="btn-primary w-full shadow-md cursor-pointer"
                style={{ borderRadius: '30px', padding: '12px 24px', fontSize: '13px', background: '#C83737' }}
              >
                Compris, fermer
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
