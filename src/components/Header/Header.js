import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import ProfileDropdown from './ProfileDropdown';
import './Header.css';

const Header = ({ session }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <header className="main-header">
      <div className="header-left">
        <button className="pro-user-button">CONVERTIRSE A USUARIO PRO</button>
      </div>
      <div className="header-center">
        <nav className="main-menu">
          <Link to="/">Inicio</Link>
          <Link to="/registrar-vuelo">Registrar Vuelo</Link>
          <Link to="/ranking">Ranking</Link>
          <Link to="/mis-vuelos">Mis Vuelos</Link>
          <Link to="/contacto">Contacto</Link>
        </nav>
      </div>
      <div className="header-right">
        {session ? (
          <>
            <div className="points-container">
              <div className="points-display">
                <span>🪙</span> 0
              </div>
              <span className="points-tooltip">
                Estos son tus puntos. Ganas puntos al registrar vuelos.
              </span>
            </div>
            <div className="profile-container" ref={dropdownRef}>
              <div className="profile-icon" onClick={toggleDropdown}>
                {session.user.email.charAt(0).toUpperCase()}
              </div>
              {isDropdownOpen && <ProfileDropdown onLogout={() => setIsDropdownOpen(false)} />}
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="login-button">INICIAR SESIÓN</Link>
            <Link to="/register" className="register-button">REGISTRARSE</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;