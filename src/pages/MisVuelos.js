import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import './MisVuelos.css'; // Crearemos este archivo para los estilos

const MisVuelos = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error('Debes iniciar sesión para ver tus vuelos.');
        }

        const { data, error } = await supabase
          .from('flights')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }); // Ordenar por fecha, los más nuevos primero

        if (error) {
          throw error;
        }

        setFlights(data);
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, []);

  if (loading) {
    return <div>Cargando tus vuelos...</div>;
  }

  return (
    <div className="mis-vuelos-container">
      <h1>Mis Vuelos Registrados</h1>
      <p>Aquí puedes ver el historial de los vuelos que has registrado y su estado.</p>
      <div className="vuelos-list">
        {flights.length > 0 ? (
          flights.map((flight) => (
            <div key={flight.id} className={`vuelo-item ${flight.status ? 'verificado' : 'pendiente'}`}>
              <div className="vuelo-info">
                <span className="flight-number">Vuelo: {flight.flight_number}</span>
                <span className="flight-date">
                  Registrado el: {new Date(flight.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="vuelo-status">
                {flight.status ? (
                  <span className="minutos-sumados">+{flight.delay_minutes} min</span>
                ) : (
                  <span>Pendiente</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>Aún no has registrado ningún vuelo. ¡Añade uno desde el botón "+" en el encabezado!</p>
        )}
      </div>
    </div>
  );
};

export default MisVuelos;