import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import SignUp from './pages/signup.jsx'
import Login from './pages/login.jsx'
import Customize from './pages/Customize.jsx'
import Customize2 from './pages/Customize2.jsx'
import { userDataContext } from './context/UserContext.jsx'
import Home from './pages/Home.jsx'
import { Navigate } from 'react-router-dom'

const App = () => {
  const { userData, setUserData } = useContext(userDataContext);
  return (
    <Routes>
      <Route path='/' element={(userData?.assistantImage && 
        userData?.assistantName)? <Home/> :<Navigate to={"/customize"}/>} />
      <Route path='/signup' element={!userData?<SignUp/>:
      <Navigate to={"/"}/>} />
      <Route path='/login' element={!userData?<Login/>:
      <Navigate to={"/"}/>}/>
      <Route path='/customize' element={userData?<Customize/>:
      <Navigate to={"/signup"}/>}/>
      <Route path='/customize2' element={userData?<Customize2/>:
      <Navigate to={"/signup"}/>}/>
    </Routes>
  )
}

export default App
