import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userDataContext } from '../context/UserContext.jsx'
import axios from 'axios'
import { MdKeyboardBackspace } from "react-icons/md";


function Customize2() {
    const { userData, backendImage, selectedImage, setUserData, serverUrl } = useContext(userDataContext)
    const [ assistantName, setAssistantName ] = useState(userData?.AssistantName || "")
    const [loading , setLoading] = useState(false)
    const Navigate = useNavigate()
    
    const handleUpdateAssistant = async () => {
      setLoading(true)
      try {
        let formData = new FormData()
        formData.append("assistantName",assistantName)
        if(backendImage){
          formData.append("assistantImage",backendImage)
        }else{
          formData.append("imageUrl", selectedImage)
        }
        const result = await axios.post(`${serverUrl}/api/user/update`,
        formData,{withCredentials:true})
        setLoading(false)
        console.log(result.data)
        setUserData(result.data)
        Navigate("/")
      } catch (error) {
        setLoading(false)
        console.log(error)
      }
    }

  return (
    <div 
        className='w-full h-[100vh] bg-gradient-to-t from-[black] 
        to-[#02023d] flex justify-center items-center flex-col gap-[15px]
        related'
    >
        <MdKeyboardBackspace 
          onClick={()=>Navigate("/customize")}
          className='absolute top-[30px] cursor-pointer left-[30px]
          text-white w-[25px] h-[25px]'
        />
        <h1
        className='text-white mb-[30px] text-[30px] text-center'
        >
            Enter your 
            <span className='text-blue-200'>Assistant Name</span>
        </h1>
        {/* Input field */}
        <input 
                type="text" 
                placeholder='Enter Name'
                required
                value={assistantName}
                onChange={(e)=>setAssistantName(e.target.value)}
                className='w-full max-w-[600px] h-[60px] outline-none border-2 border-white
                bg-transparent text-white placeholder-gray-300 px-[20px]
                py-[10px] rounded-full text-[18px]'
        />
        {assistantName && 
            <button 
              className='min-w-[300px] h-[60px] bg-white rounded-full mt-[20px]
              cursor-pointer'
              disabled={loading}
              onClick={()=>{
                handleUpdateAssistant()
              }}
            >
              {!loading?"Create your Assistant":"loading..."}
            </button>
        }
      
    </div>
  )
}

export default Customize2
