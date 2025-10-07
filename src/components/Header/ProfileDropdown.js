import React from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import './Header.css';

const ProfileDropdown = ({ onLogout }) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <div className="profile-dropdown">
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