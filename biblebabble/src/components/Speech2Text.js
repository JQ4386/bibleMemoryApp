import React, { useState } from 'react';

// Component for recording audio and transcribing it to text
function Speech2Text({ onTranscriptionDone }) {
    const [isRecording, setIsRecording] = useState(false);
    const [transcription, setTranscription] = useState('');
    const [transcriptionError, setTranscriptionError] = useState('');
    const [recognition, setRecognition] = useState(null);

    // Start recording audio and transcribing it to text
    const startRecording = () => {
        if ('webkitSpeechRecognition' in window) {
            const speechRecognition = new window.webkitSpeechRecognition();
            speechRecognition.continuous = true;
            speechRecognition.interimResults = true;
            speechRecognition.lang = 'en-US';

            speechRecognition.onstart = () => {
                setIsRecording(true);
                setTranscription(''); // Reset transcription for new session
            };

            speechRecognition.onresult = (event) => {
                const latestTranscript = Array.from(event.results)
                    .map(result => result[0].transcript)
                    .join('');
                setTranscription(latestTranscript);
            };

            speechRecognition.onerror = (event) => {
                setTranscriptionError('Speech recognition error: ' + event.error);
            };

            speechRecognition.onend = () => {
                setIsRecording(false);
            };

            speechRecognition.start();
            setRecognition(speechRecognition);
        } else {
            setTranscriptionError('Web Speech API is not supported in this browser.');
        }
    };

    // Stop recording audio and transcribing it to text
    const doneRecording = () => {
        if (recognition) {
            recognition.stop();
            setRecognition(null);
            setIsRecording(false);
            onTranscriptionDone(transcription); // Notify parent component with the transcription
        }
    };

    // Component UI
    return (
        <div className="speech-to-text-container">
            <header>
                <h1>Bible Verse Memory App</h1>
            </header>
            <main>
                <button onClick={startRecording} disabled={isRecording}>Start Recording</button>
                <button onClick={doneRecording} disabled={!isRecording}>Done</button>
                <section className="transcription-section">
                    <h3>Transcription</h3>
                    {transcriptionError ? (
                        <p>Error: {transcriptionError}</p>
                    ) : (
                        <p>{transcription}</p>
                    )}
                </section>
            </main>
        </div>
    );
}

export default Speech2Text;
