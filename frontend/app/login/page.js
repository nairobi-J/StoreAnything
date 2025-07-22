'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      // Spring Security's default login endpoint is /login with form-urlencoded data
      // For REST APIs, you usually send JSON, so a custom /api/auth/login endpoint
      // that issues JWT tokens is more common.
      // For simplicity with HTTP Basic, we'll try a basic fetch that
      // Spring Security can handle for form-based auth or directly.
      // A more robust app would exchange username/password for a JWT token here.

      // For initial testing with Spring Security's default basic auth:
      // You'd typically make a request to a protected endpoint, and Spring Security
      // would automatically trigger a login challenge. Or, if you use formLogin,
      // it hits /login with x-www-form-urlencoded data.
      // Let's implement a simple direct HTTP Basic login check for now
      // and redirect to a dashboard if successful.
      
      const credentials = btoa(`${username}:${password}`); // Base64 encode for HTTP Basic

      const response = await fetch('http://localhost:8080/api/some-protected-resource', { // Replace with an actual protected endpoint or custom login
          method: 'GET', // Or POST if it's a dedicated login endpoint
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Basic ${credentials}` // Send Basic Auth header
          }
      });
      
      if (response.ok) {
          // In a real app, successful login would return a JWT.
          // For now, we assume success means auth worked and redirect.
          setMessage('Login successful!');
          // Store token in localStorage (if using JWT)
          // localStorage.setItem('jwtToken', data.token);
          router.push('/dashboard'); // Redirect to a protected dashboard page
      } else if (response.status === 401) {
          setMessage('Invalid username or password.');
      } else {
          const errorData = await response.json();
          setMessage(errorData.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label htmlFor="username" style={{ display: 'block', marginBottom: '5px' }}>Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Login</button>
      </form>
      {message && <p style={{ marginTop: '15px', color: message.includes('successful') ? 'green' : 'red' }}>{message}</p>}
      <p style={{ marginTop: '15px' }}>Don't have an account? <Link href="/register">Register here</Link></p>
    </div>
  );
}