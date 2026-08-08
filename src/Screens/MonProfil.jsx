import { useState, useEffect } from 'react';
import countryData from '../Json/Country.json';
import { genererOtpApi, verifierOtpApi, sauvegarderProfilApi } from '../connection/supabase';
import confirmeMascotte from '../assets/confirmeMascotte.png';
import './MonProfil.css';

const REGIONS = Array.from(new Set(countryData.map(c => c.region))).sort();
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// Détecte si l'identifiant est un email ou un téléphone
const detecterCanal = (val) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()) ? 'email' : 'telephone';

export default function MonProfil({ onNavigate }) {
  // ── États des étapes ──
  // 1 = identification | 2 = OTP | 3 = modification (subEtape 1 ou 2) | 4 = confirmation succès
  const [etape, setEtape] = useState(1);
  const [subEtape, setSubEtape] = useState(1); // 1 = Infos | 2 = Don de sang

  // Étape 1
  const [identifiant, setIdentifiant] = useState('');
  const [canal, setCanal] = useState(null); // 'email' | 'telephone'
  const [canalLabel, setCanalLabel] = useState('');

  // Modal 404 "Identifiant introuvable"
  const [showNotFoundModal, setShowNotFoundModal] = useState(false);
  const [attemptedCanal, setAttemptedCanal] = useState(null);

  // Modal Échec Envoi Téléphone ("Impossible d'envoyer le code sur votre numéro pour l'instant")
  const [showPhoneFailedModal, setShowPhoneFailedModal] = useState(false);

  // Étape 2
  const [codeOtp, setCodeOtp] = useState('');
  const [compteur, setCompteur] = useState(0);
  const [profil, setProfil] = useState(null);

  // Étape 3
  const [formData, setFormData] = useState({
    nom: '', prenom: '', ville: '', region: '', courriel: '',
    connait_groupe_sanguin: null, groupe_sanguin: '',
    pret_urgence: false, souhaite_devenir_ambassadeur: null,
  });

  // Global
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // ── Compte à rebours OTP (10 min = 600 s) ──
  useEffect(() => {
    if (etape !== 2 || compteur <= 0) return;
    const timer = setInterval(() => setCompteur(c => c - 1), 1000);
    return () => clearInterval(timer);
  }, [etape, compteur]);

  const formatCompteur = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  // ── Étape 1 : Envoyer le code OTP ──
  const handleEnvoyerCode = async (e) => {
    e.preventDefault();
    if (!identifiant.trim()) {
      setErrorMsg('Veuillez saisir votre email ou numéro de téléphone.');
      return;
    }

    const detectedCanal = detecterCanal(identifiant);
    setCanal(detectedCanal);
    setCanalLabel(detectedCanal === 'email' ? 'email' : 'WhatsApp / SMS');
    setAttemptedCanal(detectedCanal);

    setLoading(true);
    setErrorMsg('');

    try {
      await genererOtpApi(identifiant.trim());
      setCompteur(600);
      setEtape(2);
    } catch (err) {
      if (err.message && (err.message.includes('introuvable') || err.message.includes('pas enregistr'))) {
        setShowNotFoundModal(true);
      } else if (detectedCanal === 'telephone') {
        // Envoi SMS/WhatsApp impossible -> Afficher modal avec fond flouté et stopper net
        setShowPhoneFailedModal(true);
      } else {
        setErrorMsg(err.message || 'Impossible d\'envoyer le code. Vérifiez votre identifiant.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Renvoyer le code ──
  const handleRenvoyerCode = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      await genererOtpApi(identifiant.trim());
      setCodeOtp('');
      setCompteur(600);
    } catch (err) {
      if (canal === 'telephone') {
        setShowPhoneFailedModal(true);
      } else {
        setErrorMsg(err.message || 'Échec du renvoi du code.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Étape 2 : Vérifier le code OTP ──
  const handleVerifierCode = async (e) => {
    e.preventDefault();
    if (!codeOtp.trim() || codeOtp.trim().length < 4) {
      setErrorMsg('Saisissez le code reçu (6 caractères).');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const result = await verifierOtpApi(identifiant.trim(), codeOtp.trim());
      const p = result.profil;
      setProfil(p);
      setFormData({
        nom: p.nom || '',
        prenom: p.prenom || '',
        ville: p.ville || '',
        region: p.region || '',
        courriel: p.courriel || '',
        connait_groupe_sanguin: p.connait_groupe_sanguin ?? null,
        groupe_sanguin: p.groupe_sanguin || '',
        pret_urgence: p.pret_urgence ?? false,
        souhaite_devenir_ambassadeur: p.souhaite_devenir_ambassadeur ?? null,
      });
      setEtape(3);
      setSubEtape(1);
    } catch (err) {
      setErrorMsg(err.message || 'Code invalide ou expiré.');
    } finally {
      setLoading(false);
    }
  };

  // ── Étape 3A : Passer à la sous-étape 2 (Don de sang) ──
  const handleSuivantSubEtape = (e) => {
    e.preventDefault();
    if (!formData.prenom.trim() || !formData.nom.trim()) {
      setErrorMsg('Prénom et nom sont obligatoires.');
      return;
    }
    if (!formData.region || !formData.ville.trim()) {
      setErrorMsg('Veuillez sélectionner votre région et saisir votre ville.');
      return;
    }
    setErrorMsg('');
    setSubEtape(2);
  };

  // ── Étape 3B : Sauvegarder les modifications ──
  const handleSauvegarder = async (e) => {
    e.preventDefault();

    if (formData.connait_groupe_sanguin === null) {
      setErrorMsg('Indiquez si vous connaissez votre groupe sanguin.');
      return;
    }
    if (formData.connait_groupe_sanguin && !formData.groupe_sanguin) {
      setErrorMsg('Sélectionnez votre groupe sanguin.');
      return;
    }
    if (formData.souhaite_devenir_ambassadeur === null) {
      setErrorMsg('Indiquez si vous souhaitez devenir ambassadeur.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      await sauvegarderProfilApi(identifiant.trim(), codeOtp.trim(), {
        nom: formData.nom.trim(),
        prenom: formData.prenom.trim(),
        ville: formData.ville.trim(),
        region: formData.region.trim(),
        courriel: formData.courriel ? formData.courriel.trim() : null,
        connait_groupe_sanguin: !!formData.connait_groupe_sanguin,
        groupe_sanguin: formData.connait_groupe_sanguin ? formData.groupe_sanguin : null,
        pret_urgence: !!formData.pret_urgence,
        souhaite_devenir_ambassadeur: !!formData.souhaite_devenir_ambassadeur,
      });

      setEtape(4);
    } catch (err) {
      setErrorMsg(err.message || 'Erreur lors de la sauvegarde. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  // Calcul du numéro d'étape active pour l'indicateur visuel
  const stepNumber = etape === 1 ? 1 : etape === 2 ? 2 : etape === 3 ? (subEtape === 1 ? 3 : 4) : 5;

  return (
    <div className="form-screen animate-fade-in">

      {/* Bouton retour fixé */}
      {onNavigate && (
        <button className="confirm-back-btn" onClick={() => onNavigate('landing')}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Accueil</span>
        </button>
      )}

      <div className="form-split-container">

        {/* CÔTÉ GAUCHE : Titre, Mascotte, Indicateurs */}
        <div className="form-left-panel">
          <div className="max-w-xs space-y-4 text-center md:text-left">
            <div>
              <span className="inline-block text-[10px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full bg-[var(--tint)] text-[var(--primary)] mb-3">
                Espace Citoyen
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-2 text-[var(--text)] leading-tight">
                {etape === 4 ? (
                  <span>Profil <span style={{ color: 'var(--green,#10B981)' }}>mis à jour !</span></span>
                ) : (
                  <span>Mise à jour de vos <span style={{ color: 'var(--primary)' }}>Données</span></span>
                )}
              </h2>
              <p className="text-xs md:text-sm text-[var(--text-soft)] leading-relaxed">
                {etape === 1 && 'Authentifiez-vous à l’aide de votre adresse email ou de votre numéro de téléphone.'}
                {etape === 2 && `Saisissez le code de vérification unique reçu via ${canalLabel}.`}
                {etape === 3 && subEtape === 1 && `Bonjour ${profil?.prenom} ! Étape 1/2 : Vérifiez votre identité et votre ville.`}
                {etape === 3 && subEtape === 2 && `Étape 2/2 : Ajustez votre groupe sanguin et vos engagements citoyennes.`}
                {etape === 4 && `Merci ${formData.prenom} ! Vos modifications ont bien été enregistrées.`}
              </p>
            </div>

            {/* Mascotte VitaSang */}
            <div className="flex justify-center pt-2">
              <img
                src={confirmeMascotte}
                alt="Mascotte VitaSang"
                className="animate-float"
                style={{ width: '140px', height: 'auto', filter: 'drop-shadow(0 12px 24px rgba(200, 55, 55, 0.15))' }}
              />
            </div>
          </div>
        </div>

        {/* CÔTÉ DROIT : Formulaire & Cartes */}
        <div className="form-right-panel">
          <div className="maquette-form-card">

            {/* Indicateurs de progression (SVG) — Affichés au fur et à mesure de la progression */}
            {etape <= 3 && (
              <div className="flex items-center gap-2 mb-6">
                {[
                  { num: 1, activeIf: stepNumber >= 1, doneIf: stepNumber > 1, label: 'Identifiant' },
                  { num: 2, activeIf: stepNumber >= 2, doneIf: stepNumber > 2, label: 'Vérification' },
                  { num: 3, activeIf: stepNumber >= 3, doneIf: stepNumber > 3, label: 'Identité' },
                  { num: 4, activeIf: stepNumber >= 4, doneIf: stepNumber > 4, label: 'Engagement' }
                ]
                  .filter(st => st.num <= stepNumber)
                  .map((st, idx, arr) => (
                    <div key={st.num} className="flex items-center gap-2 flex-1 animate-fade-in">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${st.doneIf
                        ? 'bg-[var(--green,#10B981)] text-white'
                        : st.activeIf
                          ? 'bg-[var(--primary)] text-white'
                          : 'border border-[var(--border)] text-[var(--text-soft)] bg-[var(--tint)]'
                        }`}>
                        {st.doneIf ? (
                          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : st.num}
                      </div>
                      <span className={`text-[11px] font-semibold ${st.activeIf ? 'text-[var(--text)]' : 'text-[var(--text-soft)]'}`}>
                        {st.label}
                      </span>
                      {idx < arr.length - 1 && <div className="h-px flex-1 bg-[var(--border)] hidden sm:block" />}
                    </div>
                  ))}
              </div>
            )}


            {/* Alertes d'erreurs générales */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200 text-left flex items-center gap-2">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="shrink-0 text-red-600">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* ÉTAPE 1 : IDENTIFICATION */}
            {etape === 1 && (
              <form onSubmit={handleEnvoyerCode} className="space-y-4 text-left">
                <div>
                  <label className="form-label-left">Email ou numéro de téléphone *</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={identifiant}
                      onChange={e => { setIdentifiant(e.target.value); setErrorMsg(''); }}
                      placeholder="ex: vous@email.com  ou  657809519"
                      className="form-input-custom"
                      autoFocus
                    />
                  </div>
                  <p
                    className="text-[11px] text-[var(--text-soft)] leading-relaxed"
                    style={{ marginTop: '18px', marginBottom: '12px' }}
                  >
                    Saisissez l'identifiant que vous avez utilisé lors de votre signature.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || !identifiant.trim()}
                  className="btn-primary w-full mt-3 cursor-pointer"
                  style={{ borderRadius: '30px', padding: '12px 24px' }}
                >
                  {loading ? (
                    <>
                      <span className="spinner" />
                      <span>Traitement...</span>
                    </>
                  ) : (
                    <span>Recevoir mon code de vérification &rarr;</span>
                  )}
                </button>
              </form>
            )}

            {/* ÉTAPE 2 : CODE OTP */}
            {etape === 2 && (
              <form onSubmit={handleVerifierCode} className="space-y-4 text-left">
                <div className="p-3.5 rounded-2xl bg-[var(--tint)] border border-[var(--border)] flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center shrink-0 text-[var(--primary)]">
                    {canal === 'email' ? (
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-[var(--text-soft)]">Code transmis via {canalLabel}</p>
                    <p className="text-xs font-bold text-[var(--text)]">{identifiant}</p>
                  </div>
                </div>

                <div>
                  <label className="form-label-left">Code de vérification</label>
                  <input
                    type="text"
                    value={codeOtp}
                    onChange={e => { setCodeOtp(e.target.value.toUpperCase()); setErrorMsg(''); }}
                    className="form-input-custom text-center tracking-[6px] font-mono text-lg font-bold uppercase text-[var(--primary)]"
                    maxLength={10}
                    autoFocus
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  {compteur > 0 ? (
                    <span className="text-[var(--text-soft)] flex items-center gap-1">
                      <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      Valide encore {formatCompteur(compteur)}
                    </span>
                  ) : (
                    <span className="text-red-600 font-semibold">Code expiré.</span>
                  )}

                  <button
                    type="button"
                    onClick={handleRenvoyerCode}
                    disabled={loading}
                    className="text-[var(--primary)] font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer"
                  >
                    Renvoyer le code
                  </button>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { setEtape(1); setCodeOtp(''); setErrorMsg(''); }}
                    className="px-4 py-2.5 rounded-[30px] text-xs font-semibold border border-[var(--border)] bg-transparent cursor-pointer hover:bg-[var(--tint)]"
                  >
                    &larr; Modifier l'identifiant
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !codeOtp.trim()}
                    className="btn-primary flex-1 cursor-pointer"
                    style={{ borderRadius: '30px', padding: '11px 20px' }}
                  >
                    {loading ? (
                      <><span className="spinner" /><span>Vérification...</span></>
                    ) : (
                      <span>Valider &rarr;</span>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* ÉTAPE 3 — SOUS-ÉTAPE 1 : IDENTITÉ ET LOCALISATION */}
            {etape === 3 && subEtape === 1 && (
              <form onSubmit={handleSuivantSubEtape} className="space-y-4 text-left">
                <div className="mb-2 flex items-center gap-2">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-[var(--primary)]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-soft)]">Identité et localisation</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="form-label-left">Prénom *</label>
                    <input
                      type="text"
                      value={formData.prenom}
                      onChange={e => setFormData({ ...formData, prenom: e.target.value })}
                      className="form-input-custom"
                    />
                  </div>
                  <div>
                    <label className="form-label-left">Nom *</label>
                    <input
                      type="text"
                      value={formData.nom}
                      onChange={e => setFormData({ ...formData, nom: e.target.value })}
                      className="form-input-custom"
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label-left">Email</label>
                  <input
                    type="email"
                    value={formData.courriel}
                    onChange={e => setFormData({ ...formData, courriel: e.target.value })}
                    className="form-input-custom"
                    placeholder="vous@email.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="form-label-left">Région *</label>
                    <select
                      value={formData.region}
                      onChange={e => setFormData({ ...formData, region: e.target.value })}
                      className="form-input-custom"
                    >
                      <option value="">Sélectionner</option>
                      {REGIONS.map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label-left">Ville *</label>
                    <input
                      type="text"
                      value={formData.ville}
                      onChange={e => setFormData({ ...formData, ville: e.target.value })}
                      className="form-input-custom"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setEtape(2)}
                    className="px-5 py-2.5 rounded-[30px] text-xs font-semibold border border-[var(--border)] bg-transparent cursor-pointer hover:bg-[var(--tint)]"
                  >
                    &larr; Code OTP
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex-1 cursor-pointer"
                    style={{ borderRadius: '30px', padding: '11px 24px' }}
                  >
                    <span>Suivant &rarr;</span>
                  </button>
                </div>
              </form>
            )}

            {/* ÉTAPE 3 — SOUS-ÉTAPE 2 : DON DE SANG ET ENGAGEMENT */}
            {etape === 3 && subEtape === 2 && (
              <form onSubmit={handleSauvegarder} className="space-y-4 text-left">
                <div className="mb-2 flex items-center gap-2">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-[var(--primary)]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-soft)]">Don de sang et engagement</span>
                </div>


                <div>
                  <label className="form-label-left block mb-1.5">Connaissez-vous votre groupe sanguin ?</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, connait_groupe_sanguin: true })}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold border cursor-pointer ${formData.connait_groupe_sanguin === true ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'bg-[var(--surface)] text-[var(--text)] border-[var(--border)]'}`}
                    >
                      Oui
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, connait_groupe_sanguin: false, groupe_sanguin: '' })}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold border cursor-pointer ${formData.connait_groupe_sanguin === false ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'bg-[var(--surface)] text-[var(--text)] border-[var(--border)]'}`}
                    >
                      Non
                    </button>
                  </div>

                  {formData.connait_groupe_sanguin === true && (
                    <div className="mt-2">
                      <select
                        value={formData.groupe_sanguin}
                        onChange={e => setFormData({ ...formData, groupe_sanguin: e.target.value })}
                        className="form-input-custom"
                      >
                        <option value="">Sélectionnez votre groupe</option>
                        {BLOOD_GROUPS.map(g => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="space-y-3 pt-1">
                  <label className="flex items-center gap-2.5 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.pret_urgence}
                      onChange={e => setFormData({ ...formData, pret_urgence: e.target.checked })}
                      className="w-4 h-4 rounded border-[var(--border)] text-[var(--primary)]"
                    />
                    <span>Je suis prêt(e) à donner mon sang en cas d'urgence</span>
                  </label>

                  <div>
                    <label className="form-label-left block mb-1.5">Souhaitez-vous devenir ambassadeur ?</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, souhaite_devenir_ambassadeur: true })}
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold border cursor-pointer ${formData.souhaite_devenir_ambassadeur === true ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'bg-[var(--surface)] text-[var(--text)] border-[var(--border)]'}`}
                      >
                        Oui
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, souhaite_devenir_ambassadeur: false })}
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold border cursor-pointer ${formData.souhaite_devenir_ambassadeur === false ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'bg-[var(--surface)] text-[var(--text)] border-[var(--border)]'}`}
                      >
                        Non
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setSubEtape(1)}
                    className="px-5 py-2.5 rounded-[30px] text-xs font-semibold border border-[var(--border)] bg-transparent cursor-pointer hover:bg-[var(--tint)]"
                  >
                    &larr; Précédent
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex-1 cursor-pointer"
                    style={{ borderRadius: '30px', padding: '11px 24px' }}
                  >
                    {loading ? (
                      <><span className="spinner" /><span>Sauvegarde en cours...</span></>
                    ) : (
                      <span>Enregistrer &rarr;</span>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* ÉTAPE 4 : CONFIRMATION SUCCÈS */}
            {etape === 4 && (
              <div className="text-center py-4 space-y-4 animate-fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <h3 className="font-display text-xl font-bold text-[var(--text)]">
                  Félicitations, {formData.prenom} !
                </h3>

                <p className="text-xs text-[var(--text-soft)] leading-relaxed max-w-sm mx-auto">
                  Vos informations personnelles et médicales ont été mises à jour avec succès. Merci de maintenir votre profil à jour pour le réseau citoyen VitaSang.
                </p>

                <div className="pt-3">
                  <button
                    type="button"
                    onClick={() => onNavigate('landing')}
                    className="btn-primary w-full cursor-pointer"
                    style={{ borderRadius: '30px', padding: '12px 24px' }}
                  >
                    <span>Retour à l'accueil &rarr;</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* ── MODAL BAS FLOU (Identifiant introuvable) ── */}
      {showNotFoundModal && (
        <div className="not-found-backdrop animate-fade-in" onClick={() => setShowNotFoundModal(false)}>
          <div className="not-found-bottom-drawer" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />

            <div className="flex items-center gap-3 mb-2 text-red-600">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
              <h3 className="text-base font-bold text-[var(--text)]">Identifiant introuvable</h3>
            </div>

            <p className="text-xs text-[var(--text-soft)] leading-relaxed mb-4">
              {attemptedCanal === 'email'
                ? "L'adresse email saisie n'a pas été trouvée parmi nos signataires."
                : "Le numéro de téléphone saisi n'a pas été trouvé parmi nos signataires."}
            </p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  setShowNotFoundModal(false);
                  setIdentifiant('');
                }}
                className="w-full py-2.5 px-4 rounded-full bg-[var(--primary)] text-white text-xs font-bold cursor-pointer"
              >
                {attemptedCanal === 'email'
                  ? "Essayer plutôt avec votre numéro de téléphone"
                  : "Essayer plutôt avec votre adresse email"}
              </button>

              <button
                type="button"
                onClick={() => setShowNotFoundModal(false)}
                className="w-full py-2 px-4 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold cursor-pointer border-none"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL BAS FLOU (Envoi téléphone impossible) ── */}
      {showPhoneFailedModal && (
        <div className="not-found-backdrop animate-fade-in" onClick={() => setShowPhoneFailedModal(false)}>
          <div className="not-found-bottom-drawer" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />

            <div className="flex items-center gap-3 mb-2 text-amber-600">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-base font-bold text-[var(--text)]">Envoi du code impossible</h3>
            </div>

            <p className="text-xs text-[var(--text-soft)] leading-relaxed mb-5">
              Impossible d'envoyer le code sur votre numéro pour l'instant. Veuillez réessayer ultérieurement.
            </p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setShowPhoneFailedModal(false)}
                className="w-full py-2.5 px-4 rounded-full bg-[var(--primary)] text-white text-xs font-bold cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
