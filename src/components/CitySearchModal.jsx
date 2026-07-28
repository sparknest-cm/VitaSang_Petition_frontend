import { useState, useEffect } from 'react';
import countryData from '../Json/Country.json';
import './CitySearchModal.css';

export default function CitySearchModal({ isOpen, onClose, onSelectCity }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Filtrer en temps réel
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const cleanQuery = searchQuery
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      const results = countryData.filter(c => {
        const cleanName = c.nom
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        return cleanName.includes(cleanQuery);
      });
      setSearchResults(results.slice(0, 15));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-panel" onClick={e => e.stopPropagation()}>
        {/* Header du modal */}
        <div className="p-6 pb-3 flex items-center justify-between border-b border-[var(--border)] mb-4">
          <div>
            <h3 className="font-display font-bold text-xl text-[var(--text)]">Où êtes-vous situé ?</h3>
            <p className="text-xs text-[var(--text-soft)]">Recherchez et sélectionnez votre ville de résidence.</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-[var(--tint)] flex items-center justify-center text-[var(--text-soft)] transition cursor-pointer text-lg font-semibold"
          >
            ✕
          </button>
        </div>

        {/* Corps */}
        <div className="modal-body">
          <div className="search-city-input-wrapper">
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Saisissez votre ville (ex: Douala, Yaoundé...)"
            />
          </div>

          <div className="results-scrollable">
            {searchQuery.trim().length > 1 ? (
              searchResults.length > 0 ? (
                searchResults.map(city => (
                  <button
                    key={city.geonameid}
                    onClick={() => {
                      onSelectCity(city);
                      setSearchQuery('');
                    }}
                    className="city-result-btn"
                  >
                    <span className="font-bold text-sm">{city.nom}</span>
                    <span className="city-badge-reg">{city.region}</span>
                  </button>
                ))
              ) : (
                <div className="text-center py-8 text-sm text-[var(--text-soft)]">
                  Aucune ville trouvée pour cette recherche.
                </div>
              )
            ) : (
              <div className="text-center py-8 text-xs text-[var(--text-soft)] italic">
                Tapez au moins 2 lettres pour lancer la recherche...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
