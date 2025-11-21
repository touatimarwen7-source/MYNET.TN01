import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/hero-search.css';

export default function HeroSearch() {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    category: 'all',
    keywords: '',
    region: 'all'
  });

  const categories = [
    { value: 'all', label: 'Toutes les Catégories' },
    { value: 'technology', label: 'Technologie' },
    { value: 'services', label: 'Services' },
    { value: 'construction', label: 'Construction' },
    { value: 'supplies', label: 'Fournitures' }
  ];

  const regions = [
    { value: 'all', label: 'Toutes les Régions' },
    { value: 'tunis', label: 'Tunis' },
    { value: 'ariana', label: 'Ariana' },
    { value: 'ben-arous', label: 'Ben Arous' },
    { value: 'manouba', label: 'Manouba' },
    { value: 'nabeul', label: 'Nabeul' },
    { value: 'hammamet', label: 'Hammamet' },
    { value: 'sfax', label: 'Sfax' },
    { value: 'sousse', label: 'Sousse' },
    { value: 'monastir', label: 'Monastir' },
    { value: 'kairouan', label: 'Kairouan' },
    { value: 'kasserine', label: 'Kasserine' },
    { value: 'sidi-bouzid', label: 'Sidi Bouzid' },
    { value: 'gabes', label: 'Gabès' },
    { value: 'medenine', label: 'Médenine' },
    { value: 'tataouine', label: 'Tataouine' },
    { value: 'djerba', label: 'Djerba' },
    { value: 'tozeur', label: 'Tozeur' },
    { value: 'kebili', label: 'Kébili' },
    { value: 'douz', label: 'Douz' },
    { value: 'jendouba', label: 'Jendouba' },
    { value: 'beja', label: 'Béja' },
    { value: 'kef', label: 'Le Kef' },
    { value: 'siliana', label: 'Siliana' },
    { value: 'zaghouan', label: 'Zaghouan' }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Construct query string
    const params = new URLSearchParams();
    if (searchData.keywords) params.append('q', searchData.keywords);
    if (searchData.category !== 'all') params.append('category', searchData.category);
    if (searchData.region !== 'all') params.append('region', searchData.region);
    
    // Navigate to search/tenders page with filters
    navigate(`/tenders?${params.toString()}`);
  };

  const handleCategoryChange = (e) => {
    setSearchData({ ...searchData, category: e.target.value });
  };

  const handleKeywordsChange = (e) => {
    setSearchData({ ...searchData, keywords: e.target.value });
  };

  const handleRegionChange = (e) => {
    setSearchData({ ...searchData, region: e.target.value });
  };

  return (
    <div className="hero-search-container">
      <form onSubmit={handleSearch} className="hero-search-form">
        {/* Category Filter */}
        <div className="search-filters">
          <div className="filter-group">
            <label className="filter-label">Catégorie</label>
            <div className="filter-options">
              {categories.map(cat => (
                <div key={cat.value} className="radio-option">
                  <input
                    type="radio"
                    id={`cat-${cat.value}`}
                    name="category"
                    value={cat.value}
                    checked={searchData.category === cat.value}
                    onChange={handleCategoryChange}
                  />
                  <label htmlFor={`cat-${cat.value}`}>{cat.label}</label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Search Fields */}
        <div className="search-fields">
          {/* Keywords Input */}
          <div className="search-field keywords-field">
            <label htmlFor="keywords-input" className="field-label">
              Mots-clés ou Organisme
            </label>
            <div className="input-wrapper">
              <input
                id="keywords-input"
                type="text"
                placeholder="Ex: Plomberie, informatique, construction..."
                value={searchData.keywords}
                onChange={handleKeywordsChange}
                className="search-input"
              />
              <span className="input-icon">🔍</span>
            </div>
          </div>

          {/* Region Select */}
          <div className="search-field region-field">
            <label htmlFor="region-select" className="field-label">
              Zone Géographique
            </label>
            <div className="select-wrapper">
              <select
                id="region-select"
                value={searchData.region}
                onChange={handleRegionChange}
                className="search-select"
              >
                {regions.map(region => (
                  <option key={region.value} value={region.value}>
                    {region.label}
                  </option>
                ))}
              </select>
              <span className="select-icon">📍</span>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <button type="submit" className="search-button">
          <span className="button-icon">🔎</span>
          <span>Rechercher les Appels d'Offres</span>
        </button>
      </form>
    </div>
  );
}
