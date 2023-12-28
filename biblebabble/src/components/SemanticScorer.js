import React, { useState, useEffect } from 'react';

// Component for scoring the similarity between two sentences
function SemanticScorer({ modelSentence, comparisonSentence }) {
    const [similarityScore, setSimilarityScore] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch similarity score when modelSentence or comparisonSentence changes
    useEffect(() => {
        // Fetches similarity score from backend
        const fetchSimilarityScore = async () => {
            try {
                setLoading(true);
                setError('');

                // Convert sentences to lowercase
                const lowerCaseModelSentence = modelSentence.toLowerCase();
                const lowerCaseComparisonSentence = comparisonSentence.toLowerCase();

                const sentencesArray = [lowerCaseModelSentence, lowerCaseComparisonSentence].filter(line => line.trim() !== '');

                const response = await fetch('http://localhost:5001/embed', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ sentences: sentencesArray })
                });
                const data = await response.json();
                if (data.similarity_scores && Array.isArray(data.similarity_scores)) {
                    setSimilarityScore(data.similarity_scores.length > 0 ? data.similarity_scores[0] : '');
                } else {
                    setSimilarityScore('');
                    setError('Similarity scores not found in response');
                }
            } catch (err) {
                setError(err.message);
                setSimilarityScore('');
            } finally {
                setLoading(false);
            }
        };
        // Only fetch similarity score if both sentences are not empty 
        if (modelSentence && comparisonSentence) {
            fetchSimilarityScore();
        }
    }, [modelSentence, comparisonSentence]); 

    // Component UI
    return (
        <div>
            <h2>Semantic Scorer</h2>
            <div>
                <div>
                    <label>Model Sentence: </label>
                    <span>{modelSentence}</span> 
                </div>
                <div>
                    <label>Comparison Sentence: </label>
                    <span>{comparisonSentence}</span> 
                </div>
            </div>
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
