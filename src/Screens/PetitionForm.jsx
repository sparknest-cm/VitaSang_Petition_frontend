import { useState, useEffect } from 'react';
import countryData from '../Json/Country.json';
import { signerPetition } from '../connection/supabase';
import './PetitionForm.css';

const REGIONS = Array.from(new Set(countryData.map(c => c.region))).sort();

export default function PetitionForm({ onNavigate, onOpenCityModal, selectedCityObj }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Formulaire State
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    region: '',
    ville: '',
    courriel: '',
    sexe: '',
    age: '',
    connait_groupe_sanguin: null, // boolean
    groupe_sanguin: '',
    a_deja_donne_sang: false,
    pret_urgence: true,
    souhaite_infos_lancement: true,
    souhaite_devenir_ambassadeur: null // boolean
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

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!formData.nom.trim() || !formData.prenom.trim() || !formData.telephone.trim() || !formData.region || !formData.ville) {
      setErrorMsg('Veuillez remplir tous les champs obligatoires (*).');
      return;
    }
    setErrorMsg('');
    setLoading(true);
    setTimeout(() => {
      setStep(2);
      setLoading(false);
    }, 400);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      const params = new URLSearchParams(window.location.search);
      const ref = params.get('ref');
      const utmSource = params.get('utm_source');
      const utmMedium = params.get('utm_medium');
      const utmCampaign = params.get('utm_campaign');

      const payload = {
        ...formData,
        ref,
        canal_acquisition: utmSource || (ref ? 'whatsapp' : 'lien_direct'),
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign
      };

      const result = await signerPetition(payload);
      onNavigate('confirm', result);
    } catch (err) {
      setErrorMsg(err.message || 'Une erreur est survenue lors de la signature.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-screen animate-fade-in">
      <div className="form-split-container">

        {/* Côté Gauche : Mascotte & Message */}
        <div className="form-left-panel">
          <div className="max-w-xs space-y-4">
            <div>
              <h2 className="font-display text-xl md:text-2xl font-bold mb-1.5 text-[var(--text)]">
                Une signature, un geste qui compte
              </h2>
              <p className="text-xs md:text-sm text-[var(--text-soft)] leading-relaxed">
                Vos réponses restent confidentielles et servent uniquement à bâtir un réseau de donneurs fiable, prêt à agir en cas d'urgence.
              </p>
            </div>

            <div className="flex justify-center pt-2">
              <svg className="animate-float" width="200" height="230" viewBox="0 0 220 260" fill="none">
                <path d="M110 15C110 15 45 100 45 150a65 65 0 00130 0c0-50-65-135-65-135z" fill="var(--primary)" />
                <circle cx="92" cy="145" r="5.5" fill="var(--tint)" />
                <circle cx="128" cy="145" r="5.5" fill="var(--tint)" />
                <path d="M95 162 Q110 172 125 162" stroke="var(--tint)" strokeWidth="4" strokeLinecap="round" fill="none" />
                <rect x="60" y="175" width="100" height="70" rx="8" fill="var(--surface)" stroke="var(--border)" strokeWidth="3" />
                <line x1="75" y1="192" x2="130" y2="192" stroke="var(--border)" strokeWidth="3" strokeLinecap="round" />
                <line x1="75" y1="206" x2="145" y2="206" stroke="var(--border)" strokeWidth="3" strokeLinecap="round" />
                <line x1="75" y1="220" x2="120" y2="220" stroke="var(--border)" strokeWidth="3" strokeLinecap="round" />
                <line x1="150" y1="230" x2="170" y2="205" stroke="var(--text)" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Côté Droit : Formulaire */}
        <div className="form-right-panel">
          <div className="maquette-form-card">
            {/* Stepper Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center gap-2 flex-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${step === 1 ? 'bg-[var(--primary)]' : 'bg-[var(--green)]'}`}>
                  {step === 1 ? '1' : '✓'}
                </div>
                <span className="text-xs font-semibold text-[var(--text)]">Données personnelles</span>
              </div>
              <div className="h-px flex-1 bg-[var(--border)]"></div>
              <div className="flex items-center gap-2 flex-1 justify-end">
                <span className={`text-xs font-semibold ${step === 2 ? 'text-[var(--text)]' : 'text-[var(--text-soft)]'}`}>Don de sang</span>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 2 ? 'bg-[var(--primary)] text-white' : 'border border-[var(--border)] text-[var(--text-soft)] bg-[var(--tint)]'}`}>
                  2
                </div>
              </div>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
                {errorMsg}
              </div>
            )}

            {/* STEP 1 */}
            {step === 1 && (
              <form onSubmit={handleNextStep} className="space-y-3.5 text-left">
                {/* Rangée 1 : Nom et Prénom */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="form-label-left">Nom *</label>
                    <input
                      required
                      type="text"
                      value={formData.nom}
                      onChange={e => setFormData({ ...formData, nom: e.target.value })}
                      className="form-input-custom"
                      placeholder="Mbarga"
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
                      placeholder="Charles"
                    />
                  </div>
                </div>

                {/* Rangée 2 : Téléphone et Courriel sur la MÊME LIGNE */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="form-label-left">Téléphone *</label>
                    <input
                      required
                      type="tel"
                      value={formData.telephone}
                      onChange={e => setFormData({ ...formData, telephone: e.target.value })}
                      className="form-input-custom"
                      placeholder="+237 6XX XXX XXX"
                    />
                  </div>
                  <div>
                    <label className="form-label-left">Courriel <span style={{ color: 'var(--text-soft)' }}>(opt.)</span></label>
                    <input
                      type="email"
                      value={formData.courriel}
                      onChange={e => setFormData({ ...formData, courriel: e.target.value })}
                      className="form-input-custom"
                      placeholder="vous@email.com"
                    />
                  </div>
                </div>

                {/* Rangée 3 : Région et Ville */}
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
                    <div
                      onClick={onOpenCityModal}
                      className="city-field-box"
                    >
                      <span className={formData.ville ? 'text-[var(--text)] font-semibold' : 'text-[var(--text-soft)]'}>
                        {formData.ville || 'Cliquer...'}
                      </span>
                      <svg className="w-3.5 h-3.5 text-[var(--primary)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Rangée 4 : Sexe et Âge */}
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
                      placeholder="ex: 28"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full mt-3"
                  style={{ borderRadius: '30px', padding: '11px 24px' }}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      <span>Chargement...</span>
                    </>
                  ) : (
                    <span>Continuer &rarr;</span>
                  )}
                </button>
              </form>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div>
                  <p className="text-xs text-[var(--text-soft)] mb-2">Ces réponses nous aident à qualifier votre profil.</p>
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
                    <div className="mt-2 animate-fade-in">
                      <select
                        required
                        value={formData.groupe_sanguin}
                        onChange={e => setFormData({ ...formData, groupe_sanguin: e.target.value })}
                        className="form-input-custom"
                      >
                        <option value="">Sélectionnez votre groupe sanguin</option>
                        <option>A+</option><option>A-</option>
                        <option>B+</option><option>B-</option>
                        <option>AB+</option><option>AB-</option>
                        <option>O+</option><option>O-</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="space-y-2.5 pt-1">
                  <label className="flex items-center gap-2.5 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.pret_urgence}
                      onChange={e => setFormData({ ...formData, pret_urgence: e.target.checked })}
                      className="w-4 h-4 rounded border-[var(--border)] text-[var(--primary)]"
                    />
                    <span>Je serais prêt(e) à donner mon sang en cas d'urgence</span>
                  </label>

                  <label className="flex items-center gap-2.5 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.a_deja_donne_sang}
                      onChange={e => setFormData({ ...formData, a_deja_donne_sang: e.target.checked })}
                      className="w-4 h-4 rounded border-[var(--border)] text-[var(--primary)]"
                    />
                    <span>J'ai déjà effectué un don de sang</span>
                  </label>

                  <label className="flex items-center gap-2.5 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.souhaite_infos_lancement}
                      onChange={e => setFormData({ ...formData, souhaite_infos_lancement: e.target.checked })}
                      className="w-4 h-4 rounded border-[var(--border)] text-[var(--primary)]"
                    />
                    <span>Tenez-moi informé du lancement officiel</span>
                  </label>
                </div>

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

                <div className="flex gap-3 pt-2">
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
                    className="btn-primary flex-1"
                    style={{ borderRadius: '30px', padding: '11px 24px' }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner"></span>
                        <span>Chargement...</span>
                      </>
                    ) : (
                      <span>Valider ma signature</span>
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
