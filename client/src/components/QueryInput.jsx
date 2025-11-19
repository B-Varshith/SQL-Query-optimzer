import React from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-sql';
import 'prismjs/themes/prism-tomorrow.css'; // Dark theme

const QueryInput = ({ query, setQuery, onAnalyze, loading }) => {
  return (
    <div className="query-input-container">
      <div className="editor-wrapper">
        <Editor
          value={query}
          onValueChange={code => setQuery(code)}
          highlight={code => highlight(code, languages.sql)}
          padding={15}
          style={{
            fontFamily: '"Fira Code", "Fira Mono", monospace',
            fontSize: 14,
            backgroundColor: '#1e1e1e',
            color: '#f8f8f2',
            borderRadius: '8px',
            minHeight: '150px',
          }}
          placeholder="Enter your SQL query here..."
        />
      </div>
      <div className="button-container">
        <button
          className="analyze-button"
          onClick={onAnalyze}
          disabled={loading || !query.trim()}
        >
          {loading ? 'Analyzing...' : 'Analyze Query'}
        </button>
      </div>
    </div>
  );
};

export default QueryInput;