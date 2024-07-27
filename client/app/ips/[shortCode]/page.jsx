'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

function IPsPage() {
  const [ips, setIps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { shortCode } = useParams();

  useEffect(() => {
    async function fetchIps() {
      if (!shortCode) return;
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/url/ip`, { short_code: shortCode }, { withCredentials: true });
        console.log(response.data)
        setIps(response.data);
      } catch (err) {
        setError('Failed to fetch accessed IPs');
      } finally {
        setLoading(false);
      }
    }
    fetchIps();
  }, [shortCode]);

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (error) return <div className="flex items-center justify-center h-screen">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto p-4">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Accessed IPs for {shortCode}</h2>
          {ips===null||ips.length === 0 ? (
            <div className="text-gray-500">No IPs found</div>
          ) : (
            <ul className="space-y-4">
              {ips.map((ip, index) => (
                <li key={index} className="p-4 border rounded-lg hover:bg-gray-100 transition">
                  {ip}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}

export default IPsPage;
