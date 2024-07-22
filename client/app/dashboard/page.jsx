'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function DashboardPage() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLinks() {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard`, { withCredentials: true });
        setLinks(response.data.active_links); // Set the links
      } catch (err) {
        setError('Failed to fetch links');
      } finally {
        setLoading(false);
      }
    }

    fetchLinks();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (error) return <div className="flex items-center justify-center h-screen">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto p-4">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Your Links</h2>
          <ul className="space-y-4">
            {links.map((link) => (
              <li key={link.id} className="p-4 border rounded-lg hover:bg-gray-100 transition">
                <div className="flex flex-col">
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {link.url}
                  </a>
                  <a href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${link.short_code}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                    {`${process.env.NEXT_PUBLIC_BACKEND_URL}/${link.short_code}`}
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;
