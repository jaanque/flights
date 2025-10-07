import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlaneDeparture, FaTrophy, FaListAlt, FaGift, FaSuitcase, FaUserTie } from 'react-icons/fa';
import { supabase } from '../supabaseClient';
import './Inicio.css';

const Inicio = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [rank, setRank] = useState(null);

  useEffect(() => {
    const fetchProfileAndRank = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Fetch user profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('usuario, minutos')
          .eq('identificacion', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching user profile:', profileError);
          return;
        }
        setUserProfile(profile);

        // Fetch all profiles to calculate rank
        const { data: allProfiles, error: allProfilesError } = await supabase
          .from('profiles')
          .select('identificacion, minutos')
          .order('minutos', { ascending: false });

        if (allProfilesError) {
          console.error('Error fetching all profiles:', allProfilesError);
          return;
        }

        const userRank = allProfiles.findIndex(p => p.identificacion === user.id) + 1;
        setRank(userRank);
      }
    };

    fetchProfileAndRank();
  }, []);

  return (
    <div className="inicio-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1>
            {userProfile
              ? `Bienvenido, ${userProfile.usuario}!`
              : 'Bienvenido a Bordo, Viajero Frecuente'}
          </h1>
          <p className="subtitle">
            {rank
              ? `Estás en la posición #${rank} del ranking. ¡Sigue así!`
              : 'Registra tus vuelos, acumula minutos y compite para ser el número uno.'}
          </p>
          <p>
            Para empezar, simplemente haz clic en el botón "+" del encabezado para añadir tu último número de vuelo.
          </p>
        </div>
      </section>

      <section className="features-section">
        <h2>¿Qué puedes hacer?</h2>
        <div className="features-grid">
          <Link to="/ranking" className="feature-card">
            <FaTrophy className="feature-icon" />
            <h3>Ver el Ranking</h3>
            <p>Consulta la clasificación y mira quién lidera la tabla de los más pacientes.</p>
          </Link>
          <Link to="/mis-vuelos" className="feature-card">
            <FaListAlt className="feature-icon" />
            <h3>Mi Historial</h3>
            <p>Revisa todos los vuelos que has registrado, su estado y los minutos que has ganado.</p>
          </Link>
          <div className="feature-card disabled-card">
            <FaPlaneDeparture className="feature-icon" />
            <h3>Registrar Vuelo</h3>
            <p>Añade un nuevo vuelo usando el botón "+" en la parte superior de la página.</p>
          </div>
        </div>
      </section>

      <section className="rewards-section">
        <h2>¡Tus Minutos Tienen Premio!</h2>
        <p className="subtitle">Acumula minutos y canjéalos por recompensas exclusivas.</p>
        <div className="rewards-grid">
          <div className="reward-item">
            <FaGift className="reward-icon" />
            <h4>Vuelos Gratis</h4>
            <p>Canjea tus minutos por billetes de avión a tus destinos soñados.</p>
          </div>
          <div className="reward-item">
            <FaSuitcase className="reward-icon" />
            <h4>Equipaje Premium</h4>
            <p>Consigue maletas y accesorios de viaje de las mejores marcas.</p>
          </div>
          <div className="reward-item">
            <FaUserTie className="reward-icon" />
            <h4>Acceso a Salas VIP</h4>
            <p>Relájate antes de tu vuelo en las salas VIP de aeropuertos de todo el mundo.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Inicio;