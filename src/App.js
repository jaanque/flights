import React, { useState } from 'react';
import './App.css';
import Header from './components/Header/Header';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="App">
      <Header isLoggedIn={isLoggedIn} />
      <div className="controls">
        <p>Use this button to toggle the login state:</p>
        <button onClick={() => setIsLoggedIn(!isLoggedIn)}>
          {isLoggedIn ? 'Log Out' : 'Log In'}
        </button>
      </div>
    </div>
  );
}

export default App;
