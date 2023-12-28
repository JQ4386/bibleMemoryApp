import sys
import json
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from sklearn.decomposition import PCA

# Handle the input sentences 
def get_embeddings(sentences):
    model = SentenceTransformer('sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2')
    embeddings = model.encode(sentences)
    return embeddings

# Function to calculate the similarity score between the model sentence and the other sentences
def calculate_similarity(embeddings):
    model_sentence_embedding = embeddings[0].reshape(1, -1)
    other_sentence_embeddings = embeddings[1:]

    similarity_scores = cosine_similarity(model_sentence_embedding, other_sentence_embeddings)
    return similarity_scores.flatten().tolist()  # Flatten to get a 1D list of scores

# Function to reduce the dimensions of the embeddings to 3 dimensions for visualization in the future
def reduce_dimensions(embeddings, n_components=3):
    pca = PCA(n_components=n_components)
    return pca.fit_transform(embeddings).tolist()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Error: No sentences provided", file=sys.stderr)
        sys.exit(1)

    sentences = sys.argv[1:]
    embeddings = get_embeddings(sentences)
    similarity_scores = calculate_similarity(embeddings)

    output = {
        "similarity_scores": similarity_scores
    }
    print(json.dumps(output))
