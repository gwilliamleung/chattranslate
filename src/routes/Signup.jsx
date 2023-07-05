import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const Signup = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError ] = useState('')
    const navigate = useNavigate()

    function signUp(email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('')
        try {
          await signUp(email, password);
          console.log(auth.currentUser);
          navigate('/')
        } catch (error) {
          console.log(error);
          setError(error.message)
        }
    }
  
  return (
    <div className="flex justify-center items-center rounded-t-lg h-screen bg-gray-200">
        <div className="flex w-2/5 h-2/3 bg-white rounded-t-lg shadow-lg">
            <div className="flex flex-col w-full bg-gray-200 rounded-t-lg">
                <div className="justify-center items-center grid grid-cols-4 h-1/6 bg-gray-300 rounded-tlg">
                <div className="col-span-3 flex justify-center items-center ml-6 text-lg font-bold">Chat Translate</div>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-1">
                <input
                    onChange={(e) => setEmail(e.target.value)}
                    className="border border-gray-400"
                    type="text"
                    placeholder="Username"
                />
                <input
                    onChange={(e) => setPassword(e.target.value)}
                    className="border border-gray-400 rounded px-2 py-1"
                    type="password"
                    placeholder="Password"
                />
                <button className="bg-blue-500 text-white font-bold py-2 rounded">
                    Sign Up
                </button>
                {error && <span className="text-red-500">{error}</span>}
                <Link to="/" className="flex justify-center text-blue-500 cursor-pointer text-sm">
                Already have an account? Login
                </Link>
                </form>
            </div>
        </div>
    </div>
  )
}

export default Signup