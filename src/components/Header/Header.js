import React from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import './Header.css';

const Header = ({ session }) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

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
            <button className="points-button">CONSULTAR PUNTOS</button>
            <div className="profile-icon">{session.user.email.charAt(0).toUpperCase()}</div>
            <button onClick={handleLogout} className="register-button">CERRAR SESIÓN</button>
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