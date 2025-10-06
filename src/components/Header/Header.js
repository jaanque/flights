import React from 'react';
import './Header.css';

const Header = ({ isLoggedIn }) => {
  return (
    <header className="main-header">
      <div className="header-left">
        <button className="pro-user-button">CONVERTIRSE A USUARIO PRO</button>
      </div>
      <div className="header-center">
        <div className="main-menu">MENÚ PRINCIPAL</div>
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