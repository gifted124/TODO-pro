import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://todo.reworkstaging.name.ng/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password: password.trim()
        }),
      });

      const data = await response.json();
      console.log('Signup Response:', data); // Debugging

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      // Store user data if needed
      if (data.user) {
        localStorage.setItem('temp_user', JSON.stringify({
          email: email,
          password: password
        }));
      }

      navigate('/login', { state: { signedUp: true, email: email } });

    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="relative max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      {/* Right-side loading line animation */}
      {isLoading && (
        <div className="absolute top-0 right-0 bottom-0 w-1 bg-gray-100 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-purple-500 animate-loading-vertical"></div>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
      
      {/* Error message */}
      {error && (
        <div className="text-red-500 mb-4 p-2 bg-red-50 rounded-md flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}
      
      {/* Success message */}
      {successMessage && (
        <div className="text-green-600 mb-4 p-2 bg-green-50 rounded-md flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
            disabled={isLoading}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
            disabled={isLoading}
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
            disabled={isLoading}
          />
          <p className="text-xs text-gray-500 mt-1">
            Password should be at least 6 characters
          </p>
        </div>
        <button
          type="submit"
          className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded transition disabled:opacity-70 flex justify-center items-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            </>
          ) : 'Sign Up'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <button 
          onClick={() => navigate('/login')} 
          className="text-purple-500 hover:text-purple-700 font-medium"
        >
          Log in
        </button>
      </p>

      <style jsx>{`
        @keyframes loading-vertical {
          0% {
            height: 0%;
            top: 0;
            bottom: auto;
          }
          50% {
            height: 100%;
            top: 0;
            bottom: auto;
          }
          51% {
            height: 100%;
            top: auto;
            bottom: 0;
          }
          100% {
            height: 0%;
            top: auto;
            bottom: 0;
          }
        }
        .animate-loading-vertical {
          animation: loading-vertical 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Signup;