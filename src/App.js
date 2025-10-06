import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import Inicio from './pages/Inicio';
import RegistrarVuelo from './pages/RegistrarVuelo';
import Ranking from './pages/Ranking';
import MisVuelos from './pages/MisVuelos';
import Contacto from './pages/Contacto';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div className="App">
        <Header isLoggedIn={isLoggedIn} />
        <main>
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/registrar-vuelo" element={<RegistrarVuelo />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/mis-vuelos" element={<MisVuelos />} />
            <Route path="/contacto" element={<Contacto />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
