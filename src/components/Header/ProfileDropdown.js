import React from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import './Header.css';

const ProfileDropdown = ({ onLogout, flightsCount, flightLimit }) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    if (onLogout) {
      onLogout();
    }
  };

  const progressPercentage = (flightsCount / flightLimit) * 100;

  return (
    <div className="profile-dropdown">
      <div className="progress-container">
        <span className="progress-label">Vuelos del mes: {flightsCount}/{flightLimit}</span>
        <div className="progress-bar-background">
          <div
            className="progress-bar-foreground"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
      <div className="dropdown-divider"></div>
      <Link to="/contacto" className="dropdown-link">
        Contacto
      </Link>
      <button onClick={handleLogout} className="logout-button">
        Cerrar Sesión
      </button>
    </div>
  );
};

export default ProfileDropdown;