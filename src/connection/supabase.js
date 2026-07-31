// Connexion au backend VitaSang
const rawUrl = 'https://vitasang-petition-backend.onrender.com';
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
  } catch (err) {
    console.error('[FRONTEND API ERROR] Échec de communication avec le backend :', err.message);
  }

  // Secours temporaire
  return {
    id: crypto.randomUUID(),
    nom: data.nom,
    prenom: data.prenom,
    telephone: data.telephone,
    ville: data.ville,
    region: data.region,
    code_parrainage: 'VS-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
    date_creation: new Date().toISOString()
  };
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
