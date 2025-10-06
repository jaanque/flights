import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { supabase } from './supabaseClient';
import Header from './components/Header/Header';
import Inicio from './pages/Inicio';
import RegistrarVuelo from './pages/RegistrarVuelo';
import Ranking from './pages/Ranking';
import MisVuelos from './pages/MisVuelos';
import Contacto from './pages/Contacto';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Router>
      <div className="App">
        <Header session={session} />
        <main>
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/registrar-vuelo" element={<RegistrarVuelo />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/mis-vuelos" element={<MisVuelos />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
