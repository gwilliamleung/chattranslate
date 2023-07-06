import React from 'react'
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import { auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';

const NavBar = () => {    
    const navigate = useNavigate();

    function logOut(){
        return signOut(auth)
    }

    const handleLogout = async () => {
        try{
            await logOut()
            navigate('/signup')
        } catch(error){
            console.log(error)
        }
    }

    const test = () => {
        console.log(auth)
    }

  return (
    <div className="fixed top-0 right-0 h-screen bg-gray-300">
        <Link to="/home" className="col-span-1 flex flex-col m-8 justify-center items-center text-xl">
            <FaUser />  
        </Link>
        <button 
            onClick={handleLogout}
            className="col-span-1 flex flex-col m-8 justify-center items-center text-xl">
            <FaSignOutAlt />
        </button>
        <button
            onClick={test}
        >TEST</button>
  </div>
  
  )
}

export default NavBar