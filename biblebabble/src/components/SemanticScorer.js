import React, { useState } from 'react';

// The SemanticScorer component Allows users to compare semantic similarity between two sentences.
function SemanticScorer() {
    // State management for user input and results.
    const [modelSentence, setModelSentence] = useState('');
    const [comparisonSentence, setComparisonSentence] = useState('');
    const [similarityScore, setSimilarityScore] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetches similarity score from backend.
    const fetchSimilarityScore = async () => {
        try {
            setLoading(true);
            setError('');
            const sentencesArray = [modelSentence, comparisonSentence].filter(line => line.trim() !== '');

            const response = await fetch('http://localhost:5001/embed', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sentences: sentencesArray })
            });
            const data = await response.json();
            setSimilarityScore(data.similarity_scores.length > 0 ? data.similarity_scores[0] : '');
        } catch (err) {
            setError(err.message);
            setSimilarityScore('');
        } finally {
            setLoading(false);
        }
    };

    // Handles form submission.
    const handleSubmit = (event) => {
        event.preventDefault();
        fetchSimilarityScore();
    };

    // Component UI.
    return (
        <div>
            <h2>Semantic Scorer</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Model Sentence: </label>
                    <input
                        type="text"
                        value={modelSentence}
                        onChange={e => setModelSentence(e.target.value)}
                        placeholder="Enter the model sentence"
                    />
                </div>
                <div>
                    <label>Comparison Sentence: </label>
                    <input
                        type="text"
                        value={comparisonSentence}
                        onChange={e => setComparisonSentence(e.target.value)}
                        placeholder="Enter a sentence to compare"
                    />
                </div>
                <button type="submit" disabled={loading}>Get Similarity Score</button>
            </form>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <h3>Similarity Score:</h3>
            {similarityScore !== '' && (
                <p><b>Similarity to model sentence:</b> {similarityScore}</p>
            )}
        </div>
    );
}

export default SemanticScorer;
