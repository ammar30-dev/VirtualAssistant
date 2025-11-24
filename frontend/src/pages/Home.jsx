import React, { useContext, useEffect, useRef, useState } from 'react'
import { userDataContext } from '../context/UserContext.jsx'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import aiImg from '../../src/assets/ai.gif'
import userImg from '../../src/assets/user.gif'
import { IoMenu } from "react-icons/io5";
import { ImCross } from "react-icons/im";



function Home() {
  const {userData, serverUrl, setUserData, getGeminiResponse} = useContext(userDataContext)
  const navigate = useNavigate()
  const [listening, setListening] = useState(false)
  const [userText, setUserText] = useState("")
  const [aiText, setAiText] = useState("")
  const isSpeakingRef = useRef(false)
  const recognitionRef = useRef(null)
  const [ham, setHam] = useState(false)
  const isRecognizingRef = useRef(false)
  const synth = window.speechSynthesis

  // handle logout function 
  const handleLogout = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logout`,
        {withCredentials:true}
      )
      setUserData(null)
      navigate("/login")
    } catch (error) {
      setUserData(null)
      console.log(error)
    }
  }


  // start recognition function
  const startRecognition = () => {
    if(!isSpeakingRef.current && !isRecognizingRef.current) {
    try {
      recognitionRef.current?.start();
      console.log("Recogniztion request to start");
    } catch (error) {
      if(error.name !== "InvalidStateError") {
        console.log("Start error:", error)
      }
    }
  }
  }


  // Speech Synthesis Setup
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'hi-IN';
    const voices = window.speechSynthesis.getVoices()
    const hindiVoice = voices.find(v => v.lang === 'hi-IN');
    if(hindiVoice){
      utterance.voice = hindiVoice;
    }
    isSpeakingRef.current = true
    utterance.onend = () => {
    setAiText("")
    isSpeakingRef.current = false
    setTimeout(() => {
      startRecognition();
    }, 800);
    }
    synth.cancel();
    synth.speak(utterance);
  }


  // search on site 
  const handleCommand = (data) => {
    const {type, userInput, response} = data
    speak(response);

    if(type === 'google_search'){
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`,
        '_blank');
    }

    if(type === 'calculator_open'){
      window.open(`https://www.google.com/?q=calculator`, '_blank');
    }

    if(type === 'instagram_open'){
      window.open(`https://www.instagram.com/`, '_blank');
    }

    if(type === 'facebook_open'){
      window.open(`https://www.facebook.com/`, '_blank');
    }

    if(type === 'weather_show'){
      window.open(`https://www.google.com/search?q=weather`, '_blank');
    }

    if(type === 'youtube_search' || type === 'youtube_play'){
      const query = encodeURIComponent(userInput);
      window.open(`https://www.youtube.com/results?search_query=${query}`,
        '_blank');
    }


  }


  // Speech Recognition Setup
  useEffect(()=>{
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    const recognition = new SpeechRecognition()
    recognition.continuous=true,
    recognition.lang='en-US'
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    let isMounted = true;

    // Start recognition after 1 second delay only if component still mounted
    const startTimeout = setTimeout(() => {
      if (isMounted && ! isSpeakingRef.current && 
        !isRecognizingRef.current) 
      {
        try {
          recognition.start();
          console.log("Recognition requested to start");
        } catch (e) {
          if (e.name !== "InvalidStateError") {
            console.log(e);
          }
        }
      }
    }, 1000);


    recognition.onstart = () =>{
      console.log("Recognition started");
      isRecognizingRef.current = true;
      setListening(true);
    };

    recognition.onend = () =>{
      console.log("Recognition ended");
      isRecognizingRef.current = false;
      setListening(false);
      if (isMounted && !isSpeakingRef.current) {
        setTimeout(() => { 
          if (isMounted) {
            try {
              recognition.start();
              console.log("Recognition restarted")
            } catch (e) {
                if (e.name !== "InvalidStateError")
                  console.error(e);
            }
          }
        }, 1000)
      }
    };
  

    recognition.oneerror = (event) => {
      console.warn("Recognition error:", event.error);
      isRecognizingRef.current = false;
      setListening(false);
      if (event.error !== "aborted" && isMounted && !isSpeakingRef.current){
        setTimeout(() => {
          try {
            recognition.start();
            console.log("Recognition restarted after error")
          } catch (e) {
            if (e.name !== "invalidStateError")
              console.log(e);
          }
        }, 1000)
      }
    }


    recognition.onresult = async (e)=>{
      const transcript = e.results[e.results.length-1][0].transcript.trim()
      console.log("heard : " + transcript)
    if(transcript.toLowerCase().includes(userData.assistantName.toLowerCase()))
    {
      setAiText("")
      setUserText(transcript)
      recognition.stop()
      isRecognizingRef.current = false
      setListening(false)
      const data = await getGeminiResponse(transcript)
      handleCommand(data)
      setAiText(data.response)
      setUserText("")
    }
    };


      const greeting = new SpeechSynthesisUtterance(
        `Hello ${userData.name}, What can I help you With?`);
        greeting.lang = 'hi-IN';
        window.speechSynthesis.speak(greeting);


    return () => {
      isMounted = false;
      clearTimeout(startTimeout);
      recognition.stop();
      setListening(false);
      isRecognizingRef.current = false;
    }

  },[])
  
  return (

    <div
      className='w-full h-[100vh] bg-gradient-to-t from-[black] 
      to-[#02023d] flex justify-center items-center flex-col gap-[15px]
      overflow-hidden'
    >
        <IoMenu 
          className='lg:hidden text-white absolute top-[20px] right-[20px]
          w-[25px] h-[25px]'
          onClick={()=>setHam(true)}
        />
        <div
          className={`absolute top-0 w-full h-full bg-[#00000053] lg:hidden
          backdrop-blur-lg p-[15px] flex flex-col gap-[15px] items-start
          ${ham?"translate-x-0":"translate-x-full"} transition-transform`}
        >
        <ImCross  
          className='text-white absolute top-[20px] right-[20px]
          w-[25px] h-[25px]'
          onClick={()=>setHam(false)}
        />
        <button 
          onClick={handleLogout}
          className='min-w-[150px] h-[60px] bg-white rounded-full
          cursor-pointer'
        >
          Logout
        </button>
        <button 
          className='min-w-[150px] h-[60px] bg-white rounded-full 
          px-[20px] py-[10px] cursor-pointer'
          onClick={()=>navigate("/customize")}
        >
          Customize your Assistant
        </button>
        <div
          className='w-full h-[2px] bg-gray-400'
        >
        </div>
          <h1
            className='text-white font-semibold text-[19px] '
          >
            History
          </h1>
          <div
            className='w-full h-[400px] gap-[20px] overflow-y-auto flex 
            flex-col'
          >
            {userData.history?.map((his)=>(
              <span
                className='text-gray-200 text-[18px] truncate'
              >
                {his}
              </span>
            ))}
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className='min-w-[150px] h-[60px] bg-white rounded-full absolute
          top-[20px] right-[20px] cursor-pointer hidden lg:block'
        >
          Logout
        </button>
        <button 
          className='min-w-[150px] h-[60px] bg-white rounded-full absolute
          top-[100px] right-[20px] px-[20px] py-[10px] cursor-pointer  
          hidden lg:block'
          onClick={()=>navigate("/customize")}
        >
          Customize your Assistant
        </button>
      <div
        className='w-[300px] h-[400px] flex justify-center items-center
        overflow-hidden rounded-4xl shadow-lg'
      >
      <img 
        src={userData?.assistantImage} 
        alt=""
        className='h-full object-cover'
      />
      </div>
      <h1
        className='text-white text-[18px] font-semibold'
      >
        I'm {userData.assistantName}
      </h1>
      
      {!aiText && 
        <img 
          src={userImg} 
          alt="" 
          className='w-[200px]' 
        />
        }
      {aiText && 
        <img 
          src={aiImg} 
          alt="" 
          className='w-[200px]' 
        />
      }
      <h1 
        className='text-white text-[18px] font-semibold text-wrap'
      >
        {userText?userText:aiText?aiText:null}
      </h1>
    </div>
  )
}

export default Home
