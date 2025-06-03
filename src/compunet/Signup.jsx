import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUserId(null);

    try {
      const response = await fetch('http://todo.reworkstaging.name.ng/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password: password.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Signup error:', data);
        setError(data.msg || 'Signup failed');
      } else {
        console.log('Signup success:', data);
        // If the ID is returned in data.user.id or data.id
        const newUserId = data?.user?.id || data?.id;
        if (newUserId) {
          setUserId(newUserId);
          localStorage.setItem('user_id', newUserId); // optional
        }
        // Redirect to login after short delay
        setTimeout(() => navigate('/login'), 1500);
      }
    } catch (err) {
      console.error('Network error:', err);
      setError('Network error. Try again later.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {userId && <div className="text-green-600 mb-4">User ID: {userId}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
