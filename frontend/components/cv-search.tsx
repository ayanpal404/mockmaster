import React, { useState } from 'react';

interface SearchResult {
  cvId: string;
  filename: string;
  chunkText: string;
  similarity: number;
  uploadedAt: string;
}

const CVSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(
        `http://localhost:5000/api/cv/search?query=${encodeURIComponent(query)}&limit=10`,
        {
          credentials: 'include',
        }
      );
      
      const data = await response.json();
      
      if (response.ok) {
        setResults(data.results || []);
      } else {
        setError(data.message || 'Search failed');
      }
    } catch (err) {
      setError('Search failed - Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Search CVs</h2>
      
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for skills, experience, education..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            Found {results.length} result(s) for "{query}"
          </h3>
          
          {results.map((result, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-lg">{result.filename}</h4>
                <span className="text-sm text-gray-500">
                  Match: {(result.similarity * 100).toFixed(1)}%
                </span>
              </div>
              
              <p className="text-gray-700 mb-2">{result.chunkText}</p>
              
              <div className="text-sm text-gray-500">
                CV ID: {result.cvId} | Uploaded: {new Date(result.uploadedAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {results.length === 0 && !loading && query && !error && (
        <div className="text-center py-8 text-gray-500">
          No results found for "{query}"
        </div>
      )}
    </div>
  );
};

export default CVSearch;
