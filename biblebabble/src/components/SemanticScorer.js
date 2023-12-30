import React, { useState, useEffect } from 'react';

// Function to transform the similarity score to a percentage
const final_combined_transform_score = (similarity_score) => {
    if (similarity_score >= 0.997) {
        return 100;
    } else if (similarity_score >= 0.995) {
        return 99;
    } else if (similarity_score >= 0.9) {
        return Math.round(50 + (Math.cbrt((similarity_score - 0.9) / 0.095)) * 49);
    } else {
        return Math.round(similarity_score * 50 / 0.9);
    }
};

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

                // Make a POST request to the server
                const response = await fetch('http://localhost:5001/embed', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ sentences: sentencesArray })
                });
                const data = await response.json();
                // Check if similarity_scores is defined and is an array
                if (data.similarity_scores && Array.isArray(data.similarity_scores)) {
                    const originalScore = data.similarity_scores.length > 0 ? data.similarity_scores[0] : '';
                    console.log("Original vector score:", originalScore); // Logging the original vector score
                    const transformedScore = final_combined_transform_score(originalScore);
                    setSimilarityScore(transformedScore);
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
                    <span>{modelSentence}</span> {/* Display as plain text */}
                </div>
                <div>
                    <label>Comparison Sentence: </label>
                    <span>{comparisonSentence}</span> {/* Display as plain text */}
                </div>
            </div>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <h3>Similarity Score:</h3>
            {similarityScore !== '' && (
                <p><b>Similarity to model sentence:</b> {similarityScore}%</p>
            )}
        </div>
    );
}

export default SemanticScorer;
