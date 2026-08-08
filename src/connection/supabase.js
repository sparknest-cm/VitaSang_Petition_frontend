// Connexion au backend VitaSang (Vercel Serverless API)
const rawUrl = 'http://localhost:5000'; // Remplacez par l'URL de votre backend en production
export const BACKEND_URL = rawUrl.endsWith('/api') ? rawUrl : `${rawUrl.replace(/\/$/, '')}/api`;

/**
 * 1. Enregistrer une signature (POST /api/sign)
 */
export const signerPetition = async (data) => {
  try {
    const res = await fetch(`${BACKEND_URL}/sign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      return await res.json();
    }

    let errData = {};
    try {
      errData = await res.json();
    } catch { /* empty */ }

    const err = new Error(errData.error || 'Erreur lors de la signature');
    err.code = errData.code;
    err.status = res.status;
    throw err;
  } catch (err) {
    if (err.code || err.status) throw err;
    console.error('[FRONTEND API ERROR] Échec de communication avec le backend :', err.message);
    throw err;
  }
};

/**
 * 2. Mettre à jour le profil communauté d'un signataire existant (PUT /api/sign/:id)
 *    Utilisé par le formulaire "Inscription Communauté" (VolunteerForm)
 */
export const mettreAJourProfil = async (id, data) => {
  try {
    const res = await fetch(`${BACKEND_URL}/sign/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      return await res.json();
    }

    // Gérer les erreurs HTTP du backend
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody.error || `Erreur serveur (${res.status})`);
  } catch (err) {
    console.error('[FRONTEND API ERROR] Échec de mise à jour du profil :', err.message);
    throw err;
  }
};

/**
 * 3. Enregistrer un partage (POST /api/partage)
 */
export const enregistrerPartage = async (signataireId, plateforme) => {
  try {
    const res = await fetch(`${BACKEND_URL}/partage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ signataire_id: signataireId, plateforme })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('[FRONTEND API WARN] Impossible d\'enregistrer le partage :', err.message);
  }
};

/**
 * 4. Obtenir les statistiques globales réelles (GET /api/stats)
 */
export const obtenirStatsGlobales = async () => {
  try {
    const res = await fetch(`${BACKEND_URL}/stats`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('[FRONTEND API ERROR] Impossible de lire les stats backend :', err.message);
  }

  return {
    total_signatures: 0,
    total_prets_urgence: 0,
    total_ambassadeurs_potentiels: 0,
    total_partages_generes: 0,
    signatures_dernieres_24h: 0
  };
};

/**
 * 5. Générer un code OTP (POST /api/otp/generer)
 *    identifiant : email OU numéro de téléphone du signataire
 */
export const genererOtpApi = async (identifiant) => {
  const res = await fetch(`${BACKEND_URL}/otp/generer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifiant }),
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(body.error || `Erreur serveur (${res.status})`);
  }

  return body; // { success, canal, message, canaux_utilises }
};

/**
 * 6. Vérifier un code OTP (POST /api/otp/verifier)
 *    Retourne le profil pré-rempli du signataire si le code est valide.
 */
export const verifierOtpApi = async (identifiant, code_otp) => {
  const res = await fetch(`${BACKEND_URL}/otp/verifier`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifiant, code_otp }),
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(body.error || `Erreur serveur (${res.status})`);
  }

  return body; // { success, message, profil: { signataire_id, nom, prenom, ... } }
};

/**
 * 7. Sauvegarder les modifications du profil (POST /api/otp/sauvegarder)
 *    Le code OTP est re-vérifié côté serveur avant la mise à jour.
 */
export const sauvegarderProfilApi = async (identifiant, code_otp, donneesModifiees) => {
  const res = await fetch(`${BACKEND_URL}/otp/sauvegarder`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifiant, code_otp, ...donneesModifiees }),
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(body.error || `Erreur serveur (${res.status})`);
  }

  return body; // { success, message, confirmation_email }
};

/**
 * 4. Obtenir la liste des signataires réels (GET /api/admin/signatures)
 */
export const obtenirSignataires = async (filtres = {}) => {
  try {
    const query = new URLSearchParams(filtres).toString();
    const res = await fetch(`${BACKEND_URL}/admin/signatures?${query}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('[FRONTEND API ERROR] Impossible de lire les signataires backend :', err.message);
  }
  return [];
};

