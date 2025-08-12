'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.post(
        'http://localhost:8080/api/auth/register',
        { username, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.status === 200 || response.status === 201) {
        setMessage('Registration successful! Redirecting to login...');
        setTimeout(() => router.push('/login'), 2000);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMessage(error.response?.data?.message || 'Registration failed.');
    }
  };



  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h1>Register</h1>
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
        <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Register</button>
      </form>
      {message && <p style={{ marginTop: '15px', color: message.includes('successful') ? 'green' : 'red' }}>{message}</p>}
      <p style={{ marginTop: '15px' }}>Already have an account? <Link href="/login">Login here</Link></p>
    </div>
  );
}