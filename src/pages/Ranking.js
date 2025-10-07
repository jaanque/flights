import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import './Ranking.css'; // Asumiremos que crearemos este archivo para los estilos

const Ranking = () => {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        setLoading(true);
        // Obtener perfiles y ordenarlos por 'minutes' en orden descendente
        // También seleccionamos el email del usuario desde la tabla 'users' de auth
        const { data, error } = await supabase
          .from('profiles')
          .select(`
            username,
            minutes,
            user_id
          `)
          .order('minutes', { ascending: false });

        if (error) {
          throw error;
        }

        // Para obtener el email, necesitamos hacer una consulta adicional o un join.
        // Por simplicidad aquí, asumiremos que 'username' en 'profiles' es el email o un nombre de usuario.
        // Si 'username' no existe en tu tabla 'profiles', esto necesitará un ajuste.
        // Por ejemplo, podrías tener que buscar cada email por user_id.

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
          {ranking.map((profile, index) => (
            <tr key={profile.user_id}>
              <td>{index + 1}</td>
              <td>{profile.username || 'Usuario Anónimo'}</td>
              <td>{profile.minutes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Ranking;