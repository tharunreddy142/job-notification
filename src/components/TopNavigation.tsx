import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import './TopNavigation.css';

const navLinks = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/saved', label: 'Saved' },
  { path: '/digest', label: 'Digest' },
  { path: '/settings', label: 'Settings' },
  { path: '/proof', label: 'Proof' },
];

export function TopNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="top-nav" aria-label="Main Navigation">
      <Link to="/" className="top-nav__brand" onClick={closeMobileMenu}>
        Job Notification App
      </Link>

      <ul className="top-nav__links">
        {navLinks.map((link) => (
          <li key={link.path}>
            <NavLink
              to={link.path}
              className={({ isActive }) =>
                isActive
                  ? 'top-nav__link top-nav__link--active'
                  : 'top-nav__link'
              }
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>

      <button
        className="top-nav__menu-button"
        onClick={toggleMobileMenu}
        aria-expanded={mobileMenuOpen}
        aria-controls="mobile-menu"
        aria-label="Toggle navigation menu"
      >
        Menu
      </button>

      <div
        id="mobile-menu"
        className={`top-nav__mobile-menu ${
          mobileMenuOpen ? 'top-nav__mobile-menu--open' : ''
        }`}
      >
        <ul className="top-nav__mobile-links">
          {navLinks.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  isActive
                    ? 'top-nav__mobile-link top-nav__mobile-link--active'
                    : 'top-nav__mobile-link'
                }
                onClick={closeMobileMenu}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
