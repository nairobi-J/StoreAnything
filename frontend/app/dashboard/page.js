'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/dashboard-data');
        setData(response.data);
      } catch (err) {
        setError('Failed to fetch dashboard data. Are you logged in?');
        console.error('Dashboard data fetch error:', err);
        if (err.response && err.response.status === 401) {
          // If not authorized, redirect to login
          router.push('/login');
        }
      }
    };
    fetchData();
  }, [router]);

  const handleLogout = () => {
    // In a real app, this would also clear a JWT token.
    router.push('/login');
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Dashboard</h2>
          <p className="text-red-500 mb-6">{error}</p>
          <button onClick={() => router.push('/login')} className="py-2 px-4 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors duration-300">Go to Login</button>
        </div>
      </div>
    );
  }

  if (!data) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-100"><p className="text-lg text-gray-600">Loading dashboard...</p></div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Dashboard</h1>
        <p className="text-gray-600 text-xl mb-8">{data}</p>
        <div className="flex justify-center space-x-4">
          {/* Link to the home page */}
          <Link href="/home" className="inline-block py-3 px-6 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300 transition-colors duration-300">
            Go to Home
          </Link>
          <button onClick={handleLogout} className="py-3 px-6 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition-colors duration-300">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
