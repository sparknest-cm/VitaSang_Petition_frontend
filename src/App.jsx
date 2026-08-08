import { useState, useEffect } from 'react';
import Landing from '@screens/Landing';
import PetitionForm from '@screens/PetitionForm';
import Confirmation from '@screens/Confirmation';
import ProgramInfo from '@screens/ProgramInfo';
import VolunteerForm from '@screens/VolunteerForm';
import MonProfil from '@screens/MonProfil';
import CitySearchModal from '@components/CitySearchModal';
import PrivacyModal from '@components/PrivacyModal';
import { obtenirStatsGlobales } from '@connection/supabase';
import { initMetaPixel, trackMetaPixelEvent } from './utils/metaPixel';

function App() {
  const [screen, setScreen] = useState('landing'); // 'landing' | 'form' | 'confirm' | 'program_info' | 'volunteer_form' | 'mon_profil'
  const [registeredUser, setRegisteredUser] = useState(null);
  
  // Initialisation du Pixel Meta si présent
  useEffect(() => {
    const metaPixelId = import.meta.env.VITE_META_PIXEL_ID;
    if (metaPixelId) {
      initMetaPixel(metaPixelId);
    }
  }, []);

  // Modal Ville State
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [selectedCityObj, setSelectedCityObj] = useState(null);

  // Modal Confidentialité & Protection des données State
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  // Stats globales pour la Landing page
  const [stats, setStats] = useState({
    total_signatures: 4218,
    total_prets_urgence: 1340,
    total_ambassadeurs_potentiels: 612,
    signatures_dernieres_24h: 312
  });

  useEffect(() => {
    obtenirStatsGlobales()
      .then(data => {
        if (data) {
          setStats({
            total_signatures: data.total_signatures,
            total_prets_urgence: data.total_prets_urgence,
            total_ambassadeurs_potentiels: data.total_ambassadeurs_potentiels,
            signatures_dernieres_24h: data.signatures_dernieres_24h || 312
          });
        }
      })
      .catch(err => console.error('Erreur chargement stats:', err));
  }, [screen]);

  // Redirection d'écrans & Suivi anonyme Meta Pixel
  const handleNavigate = (targetScreen, userData = null) => {
    if (userData) {
      setRegisteredUser(prev => ({ ...prev, ...userData }));
    }

    if (targetScreen === 'program_info') {
      trackMetaPixelEvent('ViewContent', { content_name: 'En savoir plus VitaSang', page: 'program_info' });
    } else if (targetScreen === 'mon_profil') {
      trackMetaPixelEvent('ViewContent', { content_name: 'Espace Profil Citoyen', page: 'mon_profil' });
    } else if (targetScreen === 'form') {
      trackMetaPixelEvent('ViewContent', { content_name: 'Formulaire Signature Petition', page: 'form' });
    }

    setScreen(targetScreen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {screen === 'landing' && (
        <Landing
          stats={stats}
          onNavigate={handleNavigate}
          onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
        />
      )}
      
      {/* Formulaire Express (Nom, Prénom, Téléphone) */}
      {screen === 'form' && (
        <PetitionForm
          onNavigate={handleNavigate}
          onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
        />
      )}

      {/* Confirmation (Remerciements & Partage + CTA Rejoindre le réseau) */}
      {screen === 'confirm' && (
        <Confirmation
          registeredUser={registeredUser}
          onNavigate={handleNavigate}
        />
      )}

      {/* Présentation du Programme VitaSang (Mascotte + Explications) */}
      {screen === 'program_info' && (
        <ProgramInfo
          registeredUser={registeredUser}
          onNavigate={handleNavigate}
        />
      )}

      {/* Inscription Communauté en 2 Étapes (sans redemander Nom, Prénom, Tél) */}
      {screen === 'volunteer_form' && (
        <VolunteerForm
          registeredUser={registeredUser}
          onNavigate={handleNavigate}
          onOpenCityModal={() => setIsCityModalOpen(true)}
          selectedCityObj={selectedCityObj}
          onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
        />
      )}

      {/* Modification du profil citoyen (OTP dual-canal) */}
      {screen === 'mon_profil' && (
        <MonProfil
          onNavigate={handleNavigate}
        />
      )}

      {/* Modal global de recherche de ville */}
      <CitySearchModal
        isOpen={isCityModalOpen}
        onClose={() => setIsCityModalOpen(false)}
        onSelectCity={(city) => {
          setSelectedCityObj(city);
          setIsCityModalOpen(false);
        }}
      />

      {/* Modal global de Politique de Confidentialité & Protection des données */}
      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </>
  );
}

export default App;
