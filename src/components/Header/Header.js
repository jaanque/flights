import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import ProfileDropdown from './ProfileDropdown';
import './Header.css';

const Header = ({ session }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showFlightInput, setShowFlightInput] = useState(false);
  const [flightNumber, setFlightNumber] = useState('');
  const [userMinutes, setUserMinutes] = useState(0);
  const dropdownRef = useRef(null);
  const flightFormRef = useRef(null); // Ref para el formulario de vuelo

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
      // Cierra el dropdown del perfil
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      // Cierra el formulario de vuelo
      if (flightFormRef.current && !flightFormRef.current.contains(event.target)) {
        // Cierra solo si el clic no fue en el botón de abrir (+)
        if (!event.target.closest('.add-flight-button')) {
          setShowFlightInput(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    const fetchUserMinutes = async () => {
      if (session?.user) {
        const { data, error } = await supabase
          .from('ranking_view')
          .select('total_minutes')
          .eq('user_id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching user minutes:', error);
        } else if (data) {
          setUserMinutes(data.total_minutes);
        }
      } else {
        setUserMinutes(0); // Reset minutes on logout
      }
    };

    fetchUserMinutes();

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [session, dropdownRef]);

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
              <form onSubmit={handleFlightSubmit} className="flight-input-form" ref={flightFormRef}>
                <input
                  type="text"
                  value={flightNumber}
                  onChange={(e) => setFlightNumber(e.target.value)}
                  placeholder="Nº de vuelo"
                  className="flight-input"
                  autoFocus
                />
                <button type="submit" className="flight-submit-button">✓</button>
                <button type="button" onClick={() => setShowFlightInput(false)} className="flight-close-button">×</button>
              </form>
            )}
            <div className="points-container">
              <div className="points-display">
                <span>🪙</span> {userMinutes}
              </div>
              <span className="points-tooltip">
                Estos son tus minutos acumulados por retrasos de vuelos.
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