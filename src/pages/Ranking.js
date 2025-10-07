import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import './Ranking.css';

const Ranking = () => {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        setLoading(true);
        // Leemos desde la nueva 'ranking_view', que calculará los totales automáticamente.
        // La vista contendrá 'username' y 'total_minutes'.
        const { data, error } = await supabase
          .from('ranking_view') // Leemos desde la vista
          .select('*') // La vista ya tiene los campos que necesitamos
          .order('total_minutes', { ascending: false }) // Ordenamos por el total de minutos
          .limit(500); // Limitamos a los primeros 500

        if (error) {
          throw error;
        }

        setRanking(data);
      } catch (error) {
        alert('Error al cargar el ranking: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, []);

  if (loading) {
    return <div>Cargando ranking...</div>;
  }

  return (
    <div className="ranking-container">
      <h1>🏆 Ranking de Viajeros 🏆</h1>
      <p>Los viajeros con más minutos acumulados por retrasos.</p>
      <table className="ranking-table">
        <thead>
          <tr>
            <th>Posición</th>
            <th>Usuario</th>
            <th>Minutos Acumulados</th>
          </tr>
        </thead>
        <tbody>
          {ranking.map((player, index) => (
            <tr key={player.user_id}>
              <td>{index + 1}</td>
              <td>{player.username || 'Usuario Anónimo'}</td>
              <td>{player.total_minutes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Ranking;