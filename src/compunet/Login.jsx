import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Pre-fill email if coming from signup
    if (location.state?.signedUp) {
      setEmail(location.state.email || '');
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://todo.reworkstaging.name.ng/v1/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email.trim(),
          password: password.trim() 
        }),
      });

      const data = await response.json();
      console.log('Login Response:', data); // Debugging

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 401) {
          throw new Error('Incorrect email or password');
        }
        throw new Error(data.message || 'Login failed');
      }

      // Verify the response contains required auth data
      if (!data.id && !data.token) {
        throw new Error('Invalid ditails');
      }

      // Store authentication data
      localStorage.setItem('user_id', data.id);
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
      }

      // Redirect to protected page
      navigate('/todo');

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      {/* Right-side loading line animation - purple color */}
      {isLoading && (
        <div className="absolute top-0 right-0 bottom-0 w-1 bg-gray-100 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-purple-500 animate-loading-vertical"></div>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-6">Login</h2>
      {error && (
        <div className="text-red-500 mb-4 p-2 bg-red-50 rounded-md flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
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
              Processing...
            </>
          ) : 'Login'}
        </button>
      </form>

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

export default Login;