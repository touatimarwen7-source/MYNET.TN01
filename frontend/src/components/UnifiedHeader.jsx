import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/unified-header.css';

export default function UnifiedHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState('Utilisateur');
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState('fr');
  const [notifications, setNotifications] = useState(3);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('accessToken');
      const role = localStorage.getItem('userRole');
      const name = localStorage.getItem('userName') || 'Utilisateur';
      setIsAuthenticated(!!token);
      setUserRole(role);
      setUserName(name);
    };

    checkAuth();
    window.addEventListener('authChanged', checkAuth);
    return () => window.removeEventListener('authChanged', checkAuth);
  }, []);

  const isPublicPage = ['/', '/about', '/features', '/pricing', '/contact'].includes(
    location.pathname
  );

  const publicLinks = [
    { label: 'Accueil', href: '/' },
    { label: 'À Propos', href: '/about' },
    { label: 'Solutions', href: '/features' },
    { label: 'Tarification', href: '/pricing' },
    { label: 'Contact', href: '/contact' }
  ];

  const authenticatedLinks = [
    { label: '📊 Tableau de Bord', href: '/dashboard' },
    { label: '📋 Appels d\'Offres', href: '/tenders' },
    { label: '💼 Mon Profil', href: '/profile' }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    window.dispatchEvent(new Event('authChanged'));
    navigate('/login');
  };

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="unified-header">
      <div className="header-container">
        {/* LEFT SECTION: Logo & Navigation */}
        <div className="header-left">
          <div className="header-brand">
            <a href="/" className="brand-logo">
              <span className="brand-icon">🌐</span>
              <span className="brand-text">MyNet.tn</span>
            </a>
          </div>

          <nav className="header-nav">
            {isPublicPage || !isAuthenticated ? (
              <>
                {publicLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className={`nav-link ${location.pathname === link.href ? 'active' : ''}`}
                  >
                    {link.label}
                  </a>
                ))}
              </>
            ) : (
              <>
                {authenticatedLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className={`nav-link ${location.pathname === link.href ? 'active' : ''}`}
                  >
                    {link.label}
                  </a>
                ))}
              </>
            )}
          </nav>
        </div>

        {/* CENTER SECTION: Global Search */}
        {isAuthenticated && (
          <form className="header-search" onSubmit={handleSearch}>
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Rechercher appels d'offres..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        )}

        {/* RIGHT SECTION: Actions & Profile */}
        <div className="header-right">
          {isAuthenticated ? (
            <>
              {/* Notifications */}
              <button className="icon-btn notification-btn" title="Notifications">
                <span className="icon">🔔</span>
                {notifications > 0 && (
                  <span className="badge">{notifications}</span>
                )}
              </button>

              {/* Language Switcher */}
              <select
                className="language-switcher"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                title="Changer la langue"
              >
                <option value="fr">🇫🇷 FR</option>
                <option value="en">🇬🇧 EN</option>
                <option value="ar">🇹🇳 AR</option>
              </select>

              {/* Profile Menu */}
              <div className="profile-menu">
                <span className="profile-avatar">👤</span>
                <div className="profile-info">
                  <span className="profile-name">{userName}</span>
                  <span className="profile-role">
                    {userRole === 'buyer' ? '🏢 Acheteur' : '🏭 Fournisseur'}
                  </span>
                </div>
              </div>

              {/* Logout Button */}
              <button className="btn-logout" onClick={handleLogout} title="Déconnexion">
                🚪
              </button>
            </>
          ) : (
            <>
              <a href="/login" className="btn-login">
                🔐 Connexion
              </a>
              <a href="/register" className="btn-register">
                ✍️ Inscription
              </a>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          {isAuthenticated && (
            <form className="mobile-search" onSubmit={handleSearch}>
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Rechercher..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          )}

          <nav className="mobile-nav">
            {isPublicPage || !isAuthenticated ? (
              <>
                {publicLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className={`mobile-nav-link ${
                      location.pathname === link.href ? 'active' : ''
                    }`}
                    onClick={handleNavClick}
                  >
                    {link.label}
                  </a>
                ))}
              </>
            ) : (
              <>
                {authenticatedLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className={`mobile-nav-link ${
                      location.pathname === link.href ? 'active' : ''
                    }`}
                    onClick={handleNavClick}
                  >
                    {link.label}
                  </a>
                ))}
              </>
            )}
          </nav>

          <div className="mobile-actions">
            {isAuthenticated ? (
              <>
                <div className="mobile-profile">
                  <span className="profile-avatar">👤</span>
                  <div>
                    <div className="profile-name">{userName}</div>
                    <div className="profile-role">
                      {userRole === 'buyer' ? '🏢 Acheteur' : '🏭 Fournisseur'}
                    </div>
                  </div>
                </div>
                <select className="language-switcher" value={language} onChange={(e) => setLanguage(e.target.value)}>
                  <option value="fr">🇫🇷 Français</option>
                  <option value="en">🇬🇧 English</option>
                  <option value="ar">🇹🇳 العربية</option>
                </select>
                <button className="btn-logout" onClick={handleLogout}>
                  🚪 Déconnexion
                </button>
              </>
            ) : (
              <>
                <a href="/login" className="btn-login">
                  🔐 Connexion
                </a>
                <a href="/register" className="btn-register">
                  ✍️ Inscription
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
