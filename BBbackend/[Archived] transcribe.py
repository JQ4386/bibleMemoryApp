import sys
import logging
from huggingsound import SpeechRecognitionModel

# Suppress logging messages
logging.getLogger('huggingsound').setLevel(logging.ERROR)

def transcribe_audio(file_path):
    model = SpeechRecognitionModel("jonatasgrosman/wav2vec2-large-xlsr-53-english")
    transcriptions = model.transcribe([file_path])
    return transcriptions[0]['transcription']

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Error: Incorrect number of arguments", file=sys.stderr)
        sys.exit(1)

    file_path = sys.argv[1]
    result = transcribe_audio(file_path)
    print(result)  
