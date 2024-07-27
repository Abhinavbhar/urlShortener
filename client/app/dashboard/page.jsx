'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

function DashboardPage() {
  const [links, setLinks] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchLinks() {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard`, { withCredentials: true });
        const fetchedLinks = response.data.active_links || [];
        setLinks(fetchedLinks);
      } catch (err) {
        setError('Failed to fetch links');
      } finally {
        setLoading(false);
      }
    }
    fetchLinks();
  }, []);

  const handleBoxClick = (shortCode) => {
    router.push(`/ips/${shortCode}`);
  };

  const handleDelete = async (shortCode) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/deleteurl`, { short_code: shortCode }, { withCredentials: true });
      setLinks(links.filter(link => link.short_code !== shortCode));
    } catch (err) {
      setError('Failed to delete link');
    }
  };

  const handleAnalyticsClick = (shortCode) => {
    router.push(`/ips/${shortCode}`);
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (error) return <div className="flex items-center justify-center h-screen">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto p-4">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Your Links</h2>
          { links === null || links.length === 0 ? (
            <div className="text-gray-500">No links here</div>
          ) : (
            <ul className="space-y-4">
              {links.map((link, index) => (
                <li 
                  key={index} 
                  className="p-4 border rounded-lg hover:bg-gray-100 transition cursor-pointer" 
                  onClick={() => handleBoxClick(link.short_code)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <a
                        href={link.url}
                        className="text-blue-600 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {link.url}
                      </a>
                      <a
                        href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${link.short_code}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {`${process.env.NEXT_PUBLIC_BACKEND_URL}/${link.short_code}`}
                      </a>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-800 transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAnalyticsClick(link.short_code);
                        }}
                      >
                        Analytics
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(link.short_code);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;
