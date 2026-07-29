import { useState, useEffect } from 'react';
import Landing from '@screens/Landing';
import PetitionForm from '@screens/PetitionForm';
import Confirmation from '@screens/Confirmation';
import ProgramInfo from '@screens/ProgramInfo';
import VolunteerForm from '@screens/VolunteerForm';
import CitySearchModal from '@components/CitySearchModal';
import { obtenirStatsGlobales } from '@connection/supabase';

function App() {
  const [screen, setScreen] = useState('landing'); // 'landing' | 'form' | 'confirm' | 'program_info' | 'volunteer_form'
  const [registeredUser, setRegisteredUser] = useState(null);
  
  // Modal Ville State
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [selectedCityObj, setSelectedCityObj] = useState(null);

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

  // Redirection d'écrans
  const handleNavigate = (targetScreen, userData = null) => {
    if (userData) {
      setRegisteredUser(prev => ({ ...prev, ...userData }));
    }
    setScreen(targetScreen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {screen === 'landing' && (
        <Landing stats={stats} onNavigate={handleNavigate} />
      )}
      
      {/* Formulaire Express (Nom, Prénom, Téléphone) */}
      {screen === 'form' && (
        <PetitionForm
          onNavigate={handleNavigate}
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
    </>
  );
}

export default App;
