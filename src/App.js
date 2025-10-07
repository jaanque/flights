import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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

const PageLayout = ({ session }) => {
  const location = useLocation();
  const showHeader = location.pathname !== '/login' && location.pathname !== '/register';

  return (
    <>
      {showHeader && <Header session={session} />}
      <main className={showHeader ? 'page-content' : ''}>
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
    </>
  );
};

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
        <PageLayout session={session} />
      </div>
    </Router>
  );
}

export default App;
