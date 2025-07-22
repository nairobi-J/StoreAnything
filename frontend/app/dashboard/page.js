'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios'; // Using axios for simplicity

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // This is a placeholder for a protected resource.
    // In a real app, you'd send a JWT token in the Authorization header.
    // For HTTP Basic, Spring Security might automatically prompt.
    // For simplicity, let's create a dummy endpoint in Spring Boot
    // that just returns "Dashboard data" and requires authentication.

    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/dashboard-data', {
          // For HTTP Basic auth, if you stored credentials (not recommended)
          // or if the browser prompts for credentials.
          // More commonly, for JWT, you'd add:
          // headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
        });
        setData(response.data);
      } catch (err) {
        setError('Failed to fetch dashboard data. Are you logged in?');
        console.error('Dashboard data fetch error:', err);
        // If 401 Unauthorized, redirect to login
        if (err.response && err.response.status === 401) {
          router.push('/login');
        }
      }
    };
    fetchData();
  }, [router]);

  const handleLogout = () => {
    // For basic auth, there's no "logout" token to invalidate.
    // You just clear local storage if you stored anything or redirect.
    // For JWT, you'd clear the token from localStorage/cookies.
    // If using Spring Security's default form login with session, you'd hit a /logout endpoint.
    // For this example, we'll just redirect.
    // localStorage.removeItem('jwtToken'); // If you had a JWT
    router.push('/login');
  };

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Dashboard</h2>
        <p style={{ color: 'red' }}>{error}</p>
        <button onClick={() => router.push('/login')} style={{ padding: '10px 15px', marginTop: '20px' }}>Go to Login</button>
      </div>
    );
  }

  if (!data) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading dashboard...</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '50px auto', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h1>Welcome to the Dashboard!</h1>
      <p>{data}</p>
      <button onClick={handleLogout} style={{ padding: '10px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '20px' }}>Logout</button>
    </div>
  );
}