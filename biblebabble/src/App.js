import React from 'react';
import './App.css';
import VerseQuery from './components/VerseQuery'; 
import Speech2Text from './components/Speech2Text'; 

import "./App.css";
import SemanticScorer from './components/SemanticScorer';


function App() {
  return (
    <div className="App">
      <h1>Bible Verse Memory App</h1>
      <VerseQuery /> 
      <Speech2Text /> 
      <SemanticScorer />
    </div>
  );
}

export default App;
