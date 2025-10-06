import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Auth.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      alert('¡Registro exitoso! Revisa tu correo para verificar tu cuenta.');
      navigate('/login');
    } catch (error) {
      alert(error.error_description || error.message);
    }
  };

  return (
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
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
};

export default Register;