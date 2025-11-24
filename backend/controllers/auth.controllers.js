import genToken from "../config/token.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// Signup function for new user
export const SignUp = async (req, res)=>{
try {
    const {name, email, password} = req.body;
    // Check if user already exists
    const existEmail = await User.findOne({email});
    if(existEmail){
        return res.status(400).json({message: "email already exists"});
    }

    if(password.length < 6){
        return res.status(400).json({message: "password must be at least 6 characters"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        password:hashedPassword,
        email
    })

    const token = await genToken(user._id)
    res.cookie("token",token,{
        httpOnly:true,
        maxAge:7*24*60*60*1000,
        sameSite:"strict",
        secure:false

    })

    return res.status(201).json(user)


} catch (error) {
    return res.status(500).json({message:`sign up error ${error}`})
}
}

// Login function for exist user
export const Login = async (req, res)=>{
try {
    const {email, password} = req.body;
    // Check user
    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({message: "email does not exists"});
    }
    const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch){
        return res.status(400).json({message: "Incorrect password"});
    }

    const token = await genToken(user._id)

    res.cookie("token",token,{
        httpOnly:true,
        maxAge:7*24*60*60*1000,
        sameSite:"strict",
        secure:false

    })

    return res.status(200).json(user)


} catch (error) {
    return res.status(500).json({message:`login error ${error}`})
}
}

//Logout function for user 
export const Logout = async (req, res)=>{
    try {
        res.clearCookie("token")
        return res.status(200).json({message: "log out successfully"})
    } catch (error) {
        return res.status(500).json({message: `logout error ${error}`})
    }
}