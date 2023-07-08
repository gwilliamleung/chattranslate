import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function logIn() {
    return signInWithEmailAndPassword(auth, email, password);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await logIn();
      console.log(auth.currentUser);
      navigate('/Home');
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="flex flex-col w-2/5 h-2/3 rounded-lg ">
        <div className="flex flex-col h-full border rounded-lg bg-gray-300">
            <div className="flex justify-center items-center bg-gray-400 text-xl h-1/6 border-0 rounded-tr-lg rounded-tl-lg">Chat Translate </div>
              <form onSubmit={handleSubmit} className="flex rounded-b-lg  flex-col p-4 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <input
                    id="username"
                    onChange={(e) => setEmail(e.target.value)}
                    className="border rounded-lg m-2 p-4"
                    type="text"
                    placeholder="Username"
                />
                <input
                    id="password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="border rounded-lg m-2 p-4"
                    type="password"
                    placeholder="Password"
                />
                  <button
                    className="text-xl m-2">
                      Login
                  </button>
                  {error && <span className="flex justify-center">{error}</span>}
                  <Link to="/Signup" className="flex justify-center text-xl m-2">
                   No account? Sign up here
                  </Link>
                </form>
            </div>
        </div>
    </div>
  )
}

export default Login