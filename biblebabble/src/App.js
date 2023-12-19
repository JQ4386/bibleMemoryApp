import React, { useState, useRef } from 'react';
import axios from 'axios';

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [transcription, setTranscription] = useState('');
  const mediaRecorder = useRef(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);
    mediaRecorder.current.start();
    setIsRecording(true);

    let chunks = [];
    mediaRecorder.current.ondataavailable = (event) => {
      chunks.push(event.data);
    };

    mediaRecorder.current.onstop = async () => {
      const audioBlob = new Blob(chunks, { type: 'audio/webm' }); 
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      chunks = []; 

      // Transcribe the audio
      const transcriptionResult = await transcribeAudio(audioBlob);
      setTranscription(transcriptionResult);
    };
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob) => {
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.webm"); 

    try {
      const response = await axios.post(
        "https://api-inference.huggingface.co/models/jonatasgrosman/wav2vec2-large-xlsr-53-english",
        formData,
        {
          headers: {
            'Authorization': 'Bearer YOUR_HUGGING_FACE_API_KEY'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error in transcription: ", error);
      return "Error in transcription";
    }
  };

  return (
    <div>
      <header>
        <h1>Bible Verse Memory App</h1>
      </header>

      <main>
        {audioUrl && <audio src={audioUrl} controls />}
        <button onClick={startRecording} disabled={isRecording}>Start Recording</button>
        <button onClick={stopRecording} disabled={!isRecording}>Stop Recording</button>

        <section className="transcription-section">
          <h3>Transcription</h3>
          <p>{transcription}</p>
        </section>
      </main>
    </div>
  );
}

export default App;
