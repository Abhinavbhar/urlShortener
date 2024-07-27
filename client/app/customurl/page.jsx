'use client';
import React, { useState, FormEvent } from 'react';
import axios from 'axios';

const Page = () => {
  const [url, setUrl] = useState('');
  const [shortCode, setShortCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [magicLink, setMagicLink] = useState('');
  const [error, setError] = useState('');
  const [fullCustomUrl, setFullCustomUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(''); // Clear previous error

    try {
      const response = await axios.post(
        'http://localhost:8080/customurl',
        { url, "custom_url": shortCode },
        { withCredentials: true }
      );

      console.log(response.data);
      setMagicLink(response.data.finalUrl);

      // Construct the full custom URL
      const customUrl = `http://localhost:8080/${shortCode}`;
      setFullCustomUrl(customUrl);
    } catch (err) {
      setError(err.response?.data || 'An error occurred');
      console.log(err.response?.data);
    }

    setIsLoading(false);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleOpen = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Generate Custom Url</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Enter custom URL"
            value={shortCode}
            onChange={(e) => setShortCode(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${
              isLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>

        {isLoading && (
          <div className="mt-4 text-center">
            <svg
              className="animate-spin h-5 w-5 text-blue-500 mx-auto"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}

        {magicLink && (
          <div className="mt-6 p-4 bg-green-100 border border-green-200 rounded-lg">
            <p className="mb-2 font-medium">Your magic link is:</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">{magicLink}</span>
              <button
                onClick={() => handleCopy(magicLink)}
                className="ml-4 px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Copy
              </button>
            </div>
          </div>
        )}

        {fullCustomUrl && (
          <div className="mt-6 p-4 bg-yellow-100 border border-yellow-200 rounded-lg">
            <p className="mb-2 font-medium">Your custom URL is:</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">{fullCustomUrl}</span>
              <button
                onClick={() => handleCopy(fullCustomUrl)}
                className="ml-4 px-3 py-1 bg-yellow-500 text-white text-sm rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                Copy
              </button>
              <button
                onClick={() => handleOpen(fullCustomUrl)}
                className="ml-4 px-3 py-1 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-600"
              >
                Open
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-100 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
