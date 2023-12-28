import React, { useState, useCallback } from 'react';
import SemanticScorer from './SemanticScorer';
import Speech2Text from './Speech2Text';
import VerseQuery from './VerseQuery';

// Component for hosting various components for the Bible Memory App
function BibleMemoryApp() {
  const [modelSentence, setModelSentence] = useState('');
  const [comparisonSentence, setComparisonSentence] = useState('');

  // Callback for handling selected verse
  const handleVerseSelected = useCallback((verse) => {
    // Remove punctuation from the verse text
    const cleanedVerse = verse.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"");
    setModelSentence(cleanedVerse);
  }, []);
  

  // Callback for handling transcription completion
  const handleTranscriptionDone = useCallback((transcription) => {
    setComparisonSentence(transcription); // Update comparisonSentence state
  }, []);

  return (
    <div>
      <h1>Bible Memory App</h1>
      <VerseQuery onVerseSelected={handleVerseSelected} />
      <Speech2Text onTranscriptionDone={handleTranscriptionDone} />
      <SemanticScorer 
        modelSentence={modelSentence} 
        comparisonSentence={comparisonSentence} 
      />
    </div>
  );
}

export default BibleMemoryApp;
