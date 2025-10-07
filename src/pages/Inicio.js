import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlaneDeparture, FaTrophy, FaListAlt } from 'react-icons/fa'; // Importando iconos
import './Inicio.css'; // Crearemos este archivo para los estilos

const Inicio = () => {
  return (
    <div className="inicio-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Bienvenido a Bordo, Viajero Frecuente</h1>
          <p className="subtitle">
            Registra tus vuelos, acumula minutos por cada retraso y compite para ser el número uno en nuestro ranking.
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
    </div>
  );
};

export default Inicio;