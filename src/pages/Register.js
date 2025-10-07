import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase, checkUsernameUnique } from '../supabaseClient';
import './Auth.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (username.trim() === '') {
      setIsUsernameAvailable(null);
      setUsernameError('');
      return;
    }

    const check = setTimeout(async () => {
      const isAvailable = await checkUsernameUnique(username);
      setIsUsernameAvailable(isAvailable);
      if (!isAvailable) {
        setUsernameError('El nombre de usuario ya está en uso.');
      } else {
        setUsernameError('');
      }
    }, 500);

    return () => clearTimeout(check);
  }, [username]);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!isUsernameAvailable) {
      alert('Por favor, elige un nombre de usuario disponible.');
      return;
    }

    try {
      const { data: { user }, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;

      if (user) {
        const { error: profileError } = await supabase
          .from('perfiles')
          .insert([
            { identificacion: user.id, usuario: username, actualizado_en: new Date() },
          ]);

        if (profileError) throw profileError;

        alert('¡Registro exitoso! Revisa tu correo para verificar tu cuenta.');
        navigate('/login');
      }
    } catch (error) {
      alert(error.error_description || error.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-image-panel">
      </div>
      <div className="auth-form-panel">
        <div className="auth-container">
          <h1>Registrarse</h1>
          <form onSubmit={handleRegister} className="auth-form">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="username-input-container">
              <input
                type="text"
                placeholder="Nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              {isUsernameAvailable === true && <span className="username-available">✔</span>}
              {isUsernameAvailable === false && <span className="username-taken">✖</span>}
            </div>
            {usernameError && <p className="error-message">{usernameError}</p>}
            <button type="submit" disabled={!isUsernameAvailable}>Registrarse</button>
          </form>
          <p>
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;