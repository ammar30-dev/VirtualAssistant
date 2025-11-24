import React, { useContext, useState } from 'react'
import { IoMdEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import bg from '../assets/authBg.png';
import { useNavigate } from 'react-router-dom';
import { userDataContext } from '../context/UserContext';
import axios from 'axios';


function login() {

    const [showPassword, setShowPassword] = useState(false)
    const { serverUrl, userData, setUserData } = useContext(userDataContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [err, setErr] = useState("")

    const handleLogin = async (e) => {
        e.preventDefault();
        setErr("")
        setLoading(true);
        try {
            let result = await axios.post(`${serverUrl}/api/auth/login`,{
              email,password
            },{withCredentials:true});
            setUserData(result.data);
            setLoading(false);
            navigate("/");
        } catch (error) {
            console.log(error);
            setUserData(null);
            setLoading(false);
            setErr(error.response.data.message)
        }
    }

  return (
    <div className="relative w-full h-screen flex justify-center items-center overflow-hidden">

    {/* Background Image */}
    <img 
        src={bg}
        alt=""
        className="absolute top-0 left-0 w-full h-full object-cover items-center"
    />
        <form
            onSubmit={handleLogin} 
            className='w-[60%] h-[500px] max-w-[500px] bg-[#00000062] 
            backdrop-blur shadow-lg shadow-black flex flex-col items-center
            justify-center gap-[20px] px-[20px]'
        >
            <h1 
                className='text-white text-[30px] font-semibold mb-[30px]'
            >
                Login to
                <span 
                    className='text-blue-400'
                >
                    Virtual Assistant
                </span>
            </h1>
             {/* Email Input */}
            <input 
                type="email" 
                placeholder='Email'
                required
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                className='w-full h-[60px] outline-none border-2 border-white
                bg-transparent text-white placeholder-gray-300 px-[20px]
                py-[10px] rounded-full text-[18px]'
            />
            {/* Password Input with show/hide functionality */}
            <div
                className='w-full h-[60px] border-2 border-white
                bg-transparent text-white rounded-full text-[18px] relative'
            >
                <input 
                    type={showPassword?"text":"password"}
                    placeholder='Password'
                    required
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    className='w-full h-full rounded-full outline-none
                    bg-transparent placeholder-gray-300 px-[20px] py-[10px]'
                />
                {!showPassword && 
                <IoMdEye
                    onClick={()=> setShowPassword(true)} 
                    className='absolute top-1/2 right-5 -translate-y-1/2
                    text-white cursor-pointer'
                />}
                {showPassword && 
                <IoIosEyeOff
                    onClick={()=> setShowPassword(false)} 
                    className='absolute top-1/2 right-5 -translate-y-1/2
                    text-white cursor-pointer'
                />}

            </div>
            {err.length > 0 && 
                <p
                    className='text-red-500 text-[17px]'
                >
                    *{err}
                </p>
            }
            <button 
                className='min-w-[150px] h-[60px] bg-white rounded-full'
                disabled={loading}
            >
                {loading ? "Logging In..." : "Login"}
            </button>
            <p 
                className='text-[white] text-[18px] cursor-pointer'
                onClick={()=>navigate("/signup")}
            >
                Want to create a new account ? 
                <span className='text-blue-400'>Sign Up</span>
            </p>

        </form>        
    </div>
  )
}

export default login
