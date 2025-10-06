import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = ({ isLoggedIn }) => {
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
        {isLoggedIn ? (
          <>
            <button className="points-button">CONSULTAR PUNTOS</button>
            <div className="profile-icon">ICONA DE PERFIL</div>
          </>
        ) : (
          <>
            <button className="login-button">INICIAR SESIÓN</button>
            <button className="register-button">REGISTRARSE</button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;