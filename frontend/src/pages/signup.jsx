import React, { useContext, useState } from 'react'
import { IoMdEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import bg from '../assets/authBg.png';
import { useNavigate } from 'react-router-dom';
import { userDataContext } from '../context/UserContext.jsx';
import axios from 'axios';


function SignUp() {

    const [showPassword, setShowPassword] = useState(false)
    const { serverUrl, userData, setUserData } = useContext(userDataContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [err, setErr] = useState("")

    const handleSignup = async (e) => {
        e.preventDefault();
        setErr("")
        setLoading(true);
        try {
            let result = await axios.post(`${serverUrl}/api/auth/signup`,{
                name,email,password
            },{withCredentials:true});
            setUserData(result.data);
            navigate("/customize");
            setLoading(false);
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
            onSubmit={handleSignup} 
            className='w-[60%] h-[500px] max-w-[500px] bg-[#00000062] 
            backdrop-blur shadow-lg shadow-black flex flex-col items-center
            justify-center gap-[20px] px-[20px]'
        >
            <h1 
                className='text-white text-[30px] font-semibold mb-[30px]'
            >
                Register to
                <span 
                    className='text-blue-400'
                >
                    Virtual Assistant
                </span>
            </h1>
             {/* Name Input */}
            <input 
                type="text" 
                placeholder='Name'
                required
                value={name}
                onChange={(e)=>setName(e.target.value)}
                className='w-full h-[60px] outline-none border-2 border-white
                bg-transparent text-white placeholder-gray-300 px-[20px]
                py-[10px] rounded-full text-[18px] required'
            />
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
                {loading ? "Signing Up..." : "Sign Up"}
            </button>
            <p 
                className='text-[white] text-[18px] cursor-pointer'
                onClick={()=>navigate("/login")}
            >
                Already have an account ? 
                <span className='text-blue-400'>Login</span>
            </p>

        </form>        
    </div>
  )
}

export default SignUp
