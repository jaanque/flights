import React from 'react';
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
      <button onClick={handleLogout} className="logout-button">
        Cerrar Sesión
      </button>
    </div>
  );
};

export default ProfileDropdown;