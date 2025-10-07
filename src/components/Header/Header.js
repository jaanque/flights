import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import ProfileDropdown from './ProfileDropdown';
import './Header.css';

const Header = ({ session }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showFlightInput, setShowFlightInput] = useState(false);
  const [flightNumber, setFlightNumber] = useState('');
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleFlightInput = () => setShowFlightInput(!showFlightInput);

  const handleFlightSubmit = async (e) => {
    e.preventDefault();
    if (!flightNumber.trim()) {
      alert('Por favor, introduce un número de vuelo.');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Debes iniciar sesión para registrar un vuelo.');
      }

      const { error } = await supabase
        .from('flights')
        .insert([{
          flight_number: flightNumber.trim(),
          user_id: user.id,
          status: false // Explicitly setting boolean false
        }]);

      if (error) {
        // Provide a more specific error message if possible
        alert(`Error al registrar el vuelo: ${error.message}`);
        throw error;
      }

      alert(`Vuelo ${flightNumber} registrado. Está pendiente de validación.`);
      setFlightNumber('');
      setShowFlightInput(false);
    } catch (error) {
      console.error('Error submitting flight:', error);
      // Avoid alerting the same error twice
    }
  };

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
          <Link to="/ranking">Ranking</Link>
          <Link to="/mis-vuelos">Mis Vuelos</Link>
        </nav>
      </div>
      <div className="header-right">
        {session ? (
          <>
            {!showFlightInput && (
              <button onClick={toggleFlightInput} className="add-flight-button">+</button>
            )}
            {showFlightInput && (
              <form onSubmit={handleFlightSubmit} className="flight-input-form">
                <input
                  type="text"
                  value={flightNumber}
                  onChange={(e) => setFlightNumber(e.target.value)}
                  placeholder="Nº de vuelo"
                  className="flight-input"
                  autoFocus
                />
                <button type="submit" className="flight-submit-button">✓</button>
              </form>
            )}
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