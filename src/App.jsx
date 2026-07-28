import { useState, useEffect } from 'react';
import Landing from '@screens/Landing';
import PetitionForm from '@screens/PetitionForm';
import Confirmation from '@screens/Confirmation';
import CitySearchModal from '@components/CitySearchModal';
import { obtenirStatsGlobales } from '@connection/supabase';

function App() {
  const [screen, setScreen] = useState('landing'); // 'landing' | 'form' | 'confirm'
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
      setRegisteredUser(userData);
    }
    setScreen(targetScreen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {screen === 'landing' && (
        <Landing stats={stats} onNavigate={handleNavigate} />
      )}
      {screen === 'form' && (
        <PetitionForm
          onNavigate={handleNavigate}
          onOpenCityModal={() => setIsCityModalOpen(true)}
          selectedCityObj={selectedCityObj}
        />
      )}
      {screen === 'confirm' && (
        <Confirmation registeredUser={registeredUser} onNavigate={handleNavigate} />
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
