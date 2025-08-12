'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.post(
        'http://localhost:8080/api/auth/login', // Fixed URL (no Docker)
        { username, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.status === 200) {
        setMessage('Login successful!');
        router.push('/home');
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage(error.response?.data?.message || 'Login failed.');
    }
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div>
            <label htmlFor="username" className="block text-gray-700 font-medium mb-1">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 font-medium mb-1">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button type="submit" className="w-full py-3 px-6 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300">Login</button>
        </form>
        {message && <p className={`mt-4 text-center ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
        <p className="mt-6 text-center text-gray-600">Don&apos;t have an account? <Link href="/register" className="text-blue-600 hover:underline font-medium">Register here</Link></p>
      </div>
    </div>
  );
}
