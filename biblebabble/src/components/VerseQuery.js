import React, { useState, useEffect } from "react";
import bibleData from '../bible-versions/NASB95.json';
import TrieSearch from "trie-search";

// Component for querying Bible verses
function VerseQuery({ onVerseSelected }) {
  const [book, setBook] = useState("");
  const [reference, setReference] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);

  // Mapping of book names to book numbers
  const bookMapping = {
    "Genesis": 1, "Exodus": 2, "Leviticus": 3, "Numbers": 4, "Deuteronomy": 5,
    "Joshua": 6, "Judges": 7, "Ruth": 8, "1 Samuel": 9, "2 Samuel": 10,
    "1 Kings": 11, "2 Kings": 12, "1 Chronicles": 13, "2 Chronicles": 14,
    "Ezra": 15, "Nehemiah": 16, "Esther": 17, "Job": 18, "Psalms": 19,
    "Proverbs": 20, "Ecclesiastes": 21, "Song of Solomon": 22, "Isaiah": 23,
    "Jeremiah": 24, "Lamentations": 25, "Ezekiel": 26, "Daniel": 27,
    "Hosea": 28, "Joel": 29, "Amos": 30, "Obadiah": 31, "Jonah": 32,
    "Micah": 33, "Nahum": 34, "Habakkuk": 35, "Zephaniah": 36, "Haggai": 37,
    "Zechariah": 38, "Malachi": 39, "Matthew": 40, "Mark": 41, "Luke": 42,
    "John": 43, "Acts": 44, "Romans": 45, "1 Corinthians": 46, "2 Corinthians": 47,
    "Galatians": 48, "Ephesians": 49, "Philippians": 50, "Colossians": 51,
    "1 Thessalonians": 52, "2 Thessalonians": 53, "1 Timothy": 54,
    "2 Timothy": 55, "Titus": 56, "Philemon": 57, "Hebrews": 58, "James": 59,
    "1 Peter": 60, "2 Peter": 61, "1 John": 62, "2 John": 63, "3 John": 64,
    "Jude": 65, "Revelation": 66
  };

  // Reset the active suggestion index when the suggestions change
  useEffect(() => {
    setActiveSuggestionIndex(0);
  }, [suggestions]);

  // Initialize the trie data structure for book name suggestions
  const booksTrie = new TrieSearch(["key"]);
  Object.keys(bookMapping).forEach((book) => booksTrie.add({ key: book }));

  // Function to handle user search query
  const handleSearch = () => {
    const chapterOnlyRegex = /^(\d+)$/;
    const chapterAndVerseRegex = /(\d+):(\d+)(?:-(\d+))?/;
    let chapterInt, startVerseInt, endVerseInt;

    if (chapterOnlyRegex.test(reference)) {
      chapterInt = parseInt(reference, 10);
      startVerseInt = null;
      endVerseInt = null;
    } else {
      const match = reference.match(chapterAndVerseRegex);

      if (match) {
        chapterInt = parseInt(match[1], 10);
        startVerseInt = parseInt(match[2], 10);
        endVerseInt = match[3] ? parseInt(match[3], 10) : startVerseInt;
      } else {
        console.log("Invalid search query");
        setSearchResult([]);
        return;
      }
    }

    const bookNumber = bookMapping[book];
    let results = bibleData.filter((v) => {
      return v.book === bookNumber &&
             v.chapter === chapterInt &&
             (!startVerseInt || v.verse >= startVerseInt) &&
             (!endVerseInt || v.verse <= endVerseInt);
    });

    setSearchResult(results);
    if (results.length > 0) {
      onVerseSelected(results[0].text); // Call the callback function with the selected verse
    }
  };

  // Function to handle user input for book name
  const handleBookInputChange = (e) => {
    const inputVal = e.target.value;
    setBook(inputVal);
    if (inputVal.length > 0) {
      const results = booksTrie.get(inputVal).map((item) => item.key);
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  };

  // Function to handle user input for chapter/verse references
  const handleReferenceChange = (e) => {
    setReference(e.target.value);
  };

  // Function to handle user keyboard input
  const onKeyDown = (e) => {
    if (e.keyCode === 13) {
      if (suggestions.length > 0) {
        setBook(suggestions[activeSuggestionIndex]);
        setSuggestions([]);
      }
    } else if (e.keyCode === 38) {
      setActiveSuggestionIndex(
        activeSuggestionIndex === 0
          ? suggestions.length - 1
          : activeSuggestionIndex - 1
      );
    } else if (e.keyCode === 40) {
      setActiveSuggestionIndex(
        activeSuggestionIndex === suggestions.length - 1
          ? 0
          : activeSuggestionIndex + 1
      );
    }
  };

  // Function to handle user click on a suggestion
  const handleClick = (suggestion) => {
    setBook(suggestion);
    setSuggestions([]);
  };

  // Component UI
  return (
    <div className="verse-query-container">
      <h1>Bible Verse Search</h1>
      <div className="search-container">
        <div className="input-container">
          <input
            type="text"
            placeholder="Enter book name"
            value={book}
            onChange={handleBookInputChange}
            onKeyDown={onKeyDown}
          />
          {suggestions.length > 0 && (
            <div className="dropdown-menu">
              {suggestions.map((suggestion, index) => (
                <div
                  key={suggestion}
                  onClick={() => handleClick(suggestion)}
                  className={index === activeSuggestionIndex ? "active" : ""}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
        <input
          type="text"
          placeholder="Chapter:Verse (e.g., 1:1-6)"
          value={reference}
          onChange={handleReferenceChange}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div>
        {searchResult.map((v) => (
          <p key={v.verse}>
            <b>{v.verse}</b> {v.text}
          </p>
        ))}
      </div>
    </div>
  );
}

export default VerseQuery;
