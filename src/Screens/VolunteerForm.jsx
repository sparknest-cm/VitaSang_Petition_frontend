import { useState, useEffect } from 'react';
import countryData from '../Json/Country.json';
import { mettreAJourProfil } from '../connection/supabase';
import './PetitionForm.css';

const REGIONS = Array.from(new Set(countryData.map(c => c.region))).sort();
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function VolunteerForm({ registeredUser, onNavigate, onOpenCityModal, selectedCityObj }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Pre-rempli avec les données existantes (Nom, Prénom, Téléphone)
  const [formData, setFormData] = useState({
    nom: registeredUser?.nom || '',
    prenom: registeredUser?.prenom || '',
    telephone: registeredUser?.telephone || '',
    region: registeredUser?.region || '',
    ville: registeredUser?.ville || '',
    courriel: registeredUser?.courriel || '',
    sexe: registeredUser?.sexe || '',
    age: registeredUser?.age || '',
    connait_groupe_sanguin: null,
    groupe_sanguin: registeredUser?.groupe_sanguin || '',
    a_deja_donne_sang: false,
    pret_urgence: true,
    souhaite_devenir_ambassadeur: null
  });

  // Synchroniser la ville sélectionnée depuis le modal
  useEffect(() => {
    if (selectedCityObj) {
      setFormData(prev => ({
        ...prev,
        region: selectedCityObj.region,
        ville: selectedCityObj.nom
      }));
    }
  }, [selectedCityObj]);

  // ── Helpers de validation ──
  const validatePhone = (tel) => /^6[0-9]{8}$/.test(tel.replace(/\s/g, ''));
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleNextStep = (e) => {
    e.preventDefault();
    if (formData.telephone && !validatePhone(formData.telephone)) {
      setErrorMsg('Le numéro doit commencer par 6 et comporter 9 chiffres (ex: 6XX XXX XXX).');
      return;
    }
    if (!formData.region || !formData.ville) {
      setErrorMsg('Veuillez sélectionner votre Région et votre Ville.');
      return;
    }
    setErrorMsg('');
    setLoading(true);
    setTimeout(() => {
      setStep(2);
      setLoading(false);
    }, 350);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation email (optionnel mais doit être valide si renseigné)
    if (formData.courriel && !validateEmail(formData.courriel)) {
      setErrorMsg('L\'adresse email saisie n\'est pas valide (ex: vous@email.com).');
      return;
    }
    if (formData.connait_groupe_sanguin === null) {
      setErrorMsg('Veuillez indiquer si vous connaissez votre groupe sanguin.');
      return;
    }
    if (formData.connait_groupe_sanguin && !formData.groupe_sanguin) {
      setErrorMsg('Veuillez sélectionner votre groupe sanguin.');
      return;
    }
    if (formData.souhaite_devenir_ambassadeur === null) {
      setErrorMsg('Veuillez indiquer si vous souhaitez devenir ambassadeur.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const signatId = registeredUser?.id;
      const payload = {
        region: formData.region,
        ville: formData.ville,
        courriel: formData.courriel,
        sexe: formData.sexe,
        age: formData.age,
        connait_groupe_sanguin: formData.connait_groupe_sanguin,
        groupe_sanguin: formData.groupe_sanguin,
        a_deja_donne_sang: formData.a_deja_donne_sang,
        pret_urgence: formData.pret_urgence,
        souhaite_devenir_ambassadeur: formData.souhaite_devenir_ambassadeur
      };

      const result = await mettreAJourProfil(signatId, payload);
      const fullUserData = { ...registeredUser, ...result, ...formData, isVolunteer: true };
      onNavigate('confirm', fullUserData);
    } catch (err) {
      setErrorMsg(err.message || 'Une erreur est survenue lors de l\'enregistrement.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-screen animate-fade-in">
      <div className="form-split-container">

        {/* Côté Gauche : Présentation du Profil Volontaire */}
        <div className="form-left-panel">
          <div className="max-w-xs space-y-4 text-center md:text-left">
            <div>
              <span className="inline-block text-[10px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full bg-[var(--tint)] text-[var(--primary)] mb-3">
                Inscription Communauté
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-2 text-[var(--text)] leading-tight">
                Complétez votre profil de <span style={{ color: 'var(--primary)' }}>Donneur Volontaire</span>
              </h2>
              <p className="text-xs md:text-sm text-[var(--text-soft)] leading-relaxed">
                Bonjour <strong>{registeredUser?.prenom}</strong> ! Vos coordonnées (Nom, Prénom, Téléphone) sont déjà sauvegardées. Précisez votre localisation et votre profil sanguin.
              </p>
            </div>

            <div className="flex justify-center pt-2">
              <svg className="animate-float" width="160" height="190" viewBox="0 0 200 230" fill="none">
                <path d="M100 10C100 10 30 100 30 155a70 70 0 00140 0c0-55-70-145-70-145z" fill="var(--primary)" />
                <circle cx="82" cy="150" r="6" fill="var(--tint)" opacity="0.9" />
                <circle cx="118" cy="150" r="6" fill="var(--tint)" opacity="0.9" />
                <path d="M85 170 Q100 185 115 170" stroke="var(--tint)" strokeWidth="5" strokeLinecap="round" fill="none" />
              </svg>
            </div>
          </div>
        </div>

        {/* Côté Droit : Formulaire en 2 Étapes */}
        <div className="form-right-panel">
          <div className="maquette-form-card">
            
            {/* Indicateur de Progression (Étape 1 sur 2 / Étape 2 sur 2) */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center gap-2 flex-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${step === 1 ? 'bg-[var(--primary)]' : 'bg-[var(--green)]'}`}>
                  {step === 1 ? '1' : '✓'}
                </div>
                <span className="text-xs font-semibold text-[var(--text)]">1. Localisation & Profil</span>
              </div>
              <div className="h-px flex-1 bg-[var(--border)]"></div>
              <div className="flex items-center gap-2 flex-1 justify-end">
                <span className={`text-xs font-semibold ${step === 2 ? 'text-[var(--text)]' : 'text-[var(--text-soft)]'}`}>2. Engagement</span>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 2 ? 'bg-[var(--primary)] text-white' : 'border border-[var(--border)] text-[var(--text-soft)] bg-[var(--tint)]'}`}>
                  2
                </div>
              </div>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200 text-left">
                {errorMsg}
              </div>
            )}

            {/* ÉTAPE 1 SUR 2 : LOCALISATION & PROFIL SANGUIN */}
            {step === 1 && (
              <form onSubmit={handleNextStep} className="space-y-4 text-left">
                {/* Information Identité Rappel */}
                <div className="p-3 rounded-2xl bg-[var(--tint)] border border-[var(--border)] flex justify-between items-center text-xs">
                  <div>
                    <span className="text-[var(--text-soft)]">Identité enregistrée : </span>
                    <strong className="text-[var(--text)]">{registeredUser?.prenom} {registeredUser?.nom}</strong>
                  </div>
                  <span className="font-mono text-[var(--primary)] font-bold">{registeredUser?.telephone}</span>
                </div>

                {/* Région et Ville */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="form-label-left">Région *</label>
                    <select
                      required
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
                    <div onClick={onOpenCityModal} className="city-field-box">
                      <span className={formData.ville ? 'text-[var(--text)] font-semibold' : 'text-[var(--text-soft)]'}>
                        {formData.ville || 'Cliquer...'}
                      </span>
                      <svg className="w-3.5 h-3.5 text-[var(--primary)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Sexe et Âge */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="form-label-left">Sexe</label>
                    <select
                      value={formData.sexe}
                      onChange={e => setFormData({ ...formData, sexe: e.target.value })}
                      className="form-input-custom"
                    >
                      <option value="">Optionnel</option>
                      <option value="homme">Homme</option>
                      <option value="femme">Femme</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label-left">Âge</label>
                    <input
                      type="number"
                      min="16"
                      max="99"
                      value={formData.age}
                      onChange={e => setFormData({ ...formData, age: e.target.value })}
                      className="form-input-custom"
                      placeholder="ex: 26"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full mt-3 cursor-pointer"
                  style={{ borderRadius: '30px', padding: '12px 24px' }}
                >
                  <span>Continuer (Étape 2/2) &rarr;</span>
                </button>
              </form>
            )}

            {/* ÉTAPE 2 SUR 2 : ENGAGEMENT CITOYEN & OPTIONNEL */}
            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                {/* Courriel Optionnel */}
                <div>
                  <label className="form-label-left">Courriel <span className="text-[var(--text-soft)]">(optionnel)</span></label>
                  <input
                    type="email"
                    value={formData.courriel}
                    onChange={e => setFormData({ ...formData, courriel: e.target.value })}
                    className="form-input-custom"
                    placeholder="ex: vous@email.com"
                  />
                </div>

                {/* Groupe Sanguin */}
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
                    <div className="mt-2 animate-fade-in">
                      <select
                        required
                        value={formData.groupe_sanguin}
                        onChange={e => setFormData({ ...formData, groupe_sanguin: e.target.value })}
                        className="form-input-custom"
                      >
                        <option value="">Sélectionnez votre groupe sanguin</option>
                        {BLOOD_GROUPS.map(g => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Prêt urgence & Ambassadeur */}
                <div className="space-y-3 pt-1">
                  <label className="flex items-center gap-2.5 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.pret_urgence}
                      onChange={e => setFormData({ ...formData, pret_urgence: e.target.checked })}
                      className="w-4 h-4 rounded border-[var(--border)] text-[var(--primary)]"
                    />
                    <span>Je serais prêt(e) à donner mon sang en cas d'urgence</span>
                  </label>

                  <div>
                    <label className="form-label-left block mb-1.5">Souhaitez-vous devenir ambassadeur du projet ?</label>
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
                    onClick={() => setStep(1)}
                    className="px-5 py-2.5 rounded-[30px] text-xs font-semibold border border-[var(--border)] bg-transparent cursor-pointer hover:bg-[var(--tint)]"
                  >
                    &larr; Retour
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex-1 cursor-pointer"
                    style={{ borderRadius: '30px', padding: '11px 24px' }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner"></span>
                        <span>Enregistrement...</span>
                      </>
                    ) : (
                      <span>Finaliser mon inscription</span>
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
