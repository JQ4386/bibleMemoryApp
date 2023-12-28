const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const app = express();
require('dotenv').config();

// Middleware setup
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse incoming JSON requests

// POST endpoint for sentence embedding
app.post('/embed', (req, res) => {
    const sentences = req.body.sentences;

    // Validate incoming data
    if (!sentences || !Array.isArray(sentences)) {
        return res.status(400).json({ message: 'Invalid input' });
    }

    // Spawn a Python process to handle sentence embedding
    const pythonProcess = spawn('python', ['sentence_embedding.py', ...sentences]);

    let result = '';

    // Capture stdout data from the Python process
    pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
    });

    // Capture stderr data and log errors
    pythonProcess.stderr.on('data', (data) => {
        console.error('stderr:', data.toString());
    });

    // Handle the close event of the Python process
    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            // Non-zero exit code indicates an error
            return res.status(500).json({ message: 'Error processing embeddings' });
        }

        try {
            // Parse the result and send it back in the response
            const output = JSON.parse(result);
            res.json(output);
        } catch (error) {
            // Handle JSON parsing errors
            res.status(500).json({ message: 'Error parsing embeddings' });
        }
    });
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
