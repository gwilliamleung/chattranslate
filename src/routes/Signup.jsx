import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { setDoc, doc} from 'firebase/firestore'
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
          await setDoc(doc(db,'users',email),{
            data:[]
          })
          console.log(auth.currentUser);
          navigate('/home')
        } catch (error) {
          console.log(error);
          setError(error.message)
        }
    }
  
  return (
        <div className="flex justify-center items-center h-screen bg-gray-200">
          <div className="flex flex-col w-2/5 h-2/3 rounded-lg ">
            <div className="flex flex-col h-full border rounded-lg bg-gray-300">
                <div className="flex justify-center items-center bg-gray-400 text-xl h-1/6 border-0 rounded-tr-lg rounded-tl-lg">Chat Translate </div>
                <form onSubmit={handleSubmit} className="flex rounded-b-lg  flex-col p-4 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                  <input
                      onChange={(e) => setEmail(e.target.value)}
                      className="border rounded-lg m-2 p-4"
                      type="text"
                      placeholder="Username"
                  />
                <input
                    onChange={(e) => setPassword(e.target.value)}
                    className="border rounded-lg m-2 p-4"
                    type="password"
                    placeholder="Password"
                />
                <button
                  className="text-xl m-2">
                    Sign Up
                </button>
                {error && <span className="flex justify-center">{error}</span>}
                <Link to="/" className="flex justify-center text-xl m-2">
                Already have an account? Login
                </Link>
                </form>
            </div>
        </div>
    </div>
  )
}

export default Signup