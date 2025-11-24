# Virtual Assistant - Backend Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Project Structure](#project-structure)
4. [Technologies Used](#technologies-used)
5. [Database Schema](#database-schema)
6. [API Endpoints](#api-endpoints)
7. [Controllers & Business Logic](#controllers--business-logic)
8. [Middleware & Authentication](#middleware--authentication)
9. [Gemini AI Integration](#gemini-ai-integration)
10. [File Upload & Cloudinary](#file-upload--cloudinary)
11. [Error Handling](#error-handling)
12. [Setup & Installation](#setup--installation)

---

## Overview

The Virtual Assistant Backend is a Node.js/Express server that provides REST APIs for user authentication, assistant customization, and AI-powered voice command processing. It integrates with MongoDB for data persistence, Google Gemini API for AI processing, and Cloudinary for image hosting.

**Key Features:**
- JWT-based Authentication
- User Profile Management
- AI Command Processing (Gemini)
- Image Upload & Storage (Cloudinary)
- Real-time Voice Command Response
- Secure Password Hashing (bcryptjs)
- Database Persistence (MongoDB)

---

## Architecture

### System Architecture Diagram

```
┌────────────────────────────────────────────────────────────┐
│                  CLIENT (BROWSER)                          │
│            (React Frontend - Port 5173)                    │
└──────────────────────┬─────────────────────────────────────┘
                       │ HTTP/HTTPS
                       │ (with Cookies & JWT)
                       ▼
┌────────────────────────────────────────────────────────────┐
│              EXPRESS SERVER (Port 8000)                    │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │            MIDDLEWARE LAYER                         │ │
│  │  - CORS Handler                                     │ │
│  │  - Body Parser (JSON)                              │ │
│  │  - Cookie Parser                                    │ │
│  │  - JWT Authentication (isAuth)                     │ │
│  │  - File Upload Handler (Multer)                    │ │
│  └──────────────────────────────────────────────────────┘ │
│                       ↓                                    │
│  ┌──────────────────────────────────────────────────────┐ │
│  │             ROUTE HANDLERS                          │ │
│  │                                                      │ │
│  │  ┌────────────────────┐  ┌──────────────────────┐  │ │
│  │  │ Authentication     │  │ User Management      │  │ │
│  │  │ Routes             │  │ Routes               │  │ │
│  │  │                    │  │                      │  │ │
│  │  │ • /signup          │  │ • /current           │  │ │
│  │  │ • /login           │  │ • /update            │  │ │
│  │  │ • /logout          │  │ • /asktoassistant    │  │ │
│  │  └─────────┬──────────┘  └──────────┬───────────┘  │ │
│  │            │                        │               │ │
│  └────────────┼────────────────────────┼───────────────┘ │
│               ▼                        ▼                 │
│  ┌──────────────────────────────────────────────────────┐ │
│  │            CONTROLLERS                              │ │
│  │                                                      │ │
│  │  auth.controllers.js:                              │ │
│  │  - SignUp()                                        │ │
│  │  - Login()                                         │ │
│  │  - Logout()                                        │ │
│  │                                                      │ │
│  │  user.controller.js:                               │ │
│  │  - getCurrentUser()                                │ │
│  │  - updateAssistant()                               │ │
│  │  - askToAssistant()                                │ │
│  └─────────────┬──────────────────────┬────────────────┘ │
│               │                        │                 │
│               ▼                        ▼                 │
│  ┌──────────────────────────────────────────────────────┐ │
│  │        BUSINESS LOGIC & SERVICES                    │ │
│  │                                                      │ │
│  │  • Password Hashing (bcryptjs)                      │ │
│  │  • JWT Token Generation                            │ │
│  │  • Gemini AI Processing (gemini.js)                │ │
│  │  • File Upload to Cloudinary                       │ │
│  │  • Database Operations (Mongoose)                  │ │
│  └────────────┬─────────────────────────┬──────────────┘ │
│               │                         │                │
└───────────────┼─────────────────────────┼────────────────┘
                │                         │
    ┌───────────▼───────────┐  ┌──────────▼──────────┐
    │  MongoDB Atlas        │  │  External Services  │
    │  (Database)           │  │                     │
    │                       │  │  • Google Gemini AI │
    │  Collections:         │  │  • Cloudinary       │
    │  - users              │  │                     │
    │  - sessions (if used) │  │                     │
    └───────────────────────┘  └────────────────────┘
```

---

## Project Structure

```
backend/
├── config/
│   ├── db.js                    # MongoDB connection
│   ├── token.js                 # JWT token generation
│   └── cloudinary.js            # Cloudinary upload utility
├── controllers/
│   ├── auth.controllers.js      # Authentication logic
│   └── user.controller.js       # User operations & AI
├── middlewares/
│   ├── isAuth.js                # JWT verification
│   └── multer.js                # File upload config
├── models/
│   └── User.js                  # MongoDB user schema
├── routes/
│   ├── auth.routes.js           # Auth endpoints
│   └── user.routes.js           # User endpoints
├── gemini.js                    # Gemini API integration
├── index.js                     # Server entry point
├── package.json                 # Dependencies
├── .env                         # Environment variables
└── public/                      # Temp file uploads
```

---

## Technologies Used

| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 14+ | JavaScript Runtime |
| Express | 5.1.0 | Web Framework |
| MongoDB | Latest | NoSQL Database |
| Mongoose | 8.19.3 | ODM (Object Data Modeling) |
| JWT | 9.0.2 | Token-based Authentication |
| bcryptjs | 3.0.3 | Password Hashing |
| Cloudinary | 2.8.0 | Image Hosting & CDN |
| Multer | 2.0.2 | File Upload Handling |
| Google Gemini API | Latest | AI Processing |
| Axios | 1.13.2 | HTTP Client |
| Moment.js | 2.30.1 | Date/Time Utilities |
| CORS | 2.8.5 | Cross-Origin Support |
| dotenv | 17.2.3 | Environment Variables |

---

## Database Schema

### User Collection

**MongoDB Schema Definition:**

```javascript
{
  _id: ObjectId,                 // MongoDB unique ID
  name: {
    type: String,
    required: true              // User's full name
  },
  email: {
    type: String,
    required: true,
    unique: true                // Email must be unique
  },
  password: {
    type: String,
    required: true              // Hashed password
  },
  assistantName: String,          // Custom assistant name
  assistantImage: String,         // Assistant avatar URL
  history: [String],              // Voice command history
  createdAt: Date,                // Account creation time
  updatedAt: Date                 // Last update time
}
```

**Example Document:**

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "name": "John Doe",
  "email": "john@example.com",
  "password": "$2a$10$e8BdI9MhgVdVFvA0YeYn3OPST9GeuDKzMT0oYR0OhK8",
  "assistantName": "JARVIS",
  "assistantImage": "https://res.cloudinary.com/demo/image/upload/v123/va/jarvis.jpg",
  "history": [
    "what is the time",
    "search for React",
    "tell me a joke"
  ],
  "createdAt": ISODate("2024-11-20T10:30:00.000Z"),
  "updatedAt": ISODate("2024-11-22T16:45:00.000Z")
}
```

**Indexes:**
```javascript
// Email index for fast lookups
userSchema.index({ email: 1 });

// Compound index for queries
userSchema.index({ _id: 1, email: 1 });
```

---

## API Endpoints

### Authentication Endpoints

#### 1. Sign Up (Create Account)

```
POST /api/auth/signup
Content-Type: application/json

Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}

Success Response (201 Created):
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "assistantName": null,
  "assistantImage": null,
  "history": [],
  "createdAt": "2024-11-22T10:30:00.000Z",
  "updatedAt": "2024-11-22T10:30:00.000Z"
}

Cookies Set:
Set-Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; 
            HttpOnly; Path=/; Max-Age=864000; SameSite=Strict

Error Responses:
400: { "message": "email already exists" }
400: { "message": "password must be at least 6 characters" }
500: { "message": "sign up error ..." }
```

**Flow Diagram:**
```
Request → Validate Email → Check Exists?
            ↓ (No)
         Validate Password Length
            ↓
         Hash Password (bcryptjs)
            ↓
         Create User in DB
            ↓
         Generate JWT Token (10 days)
            ↓
         Set httpOnly Cookie
            ↓
         Return User Object (201)
```

---

#### 2. Login (Authenticate User)

```
POST /api/auth/login
Content-Type: application/json

Request:
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}

Success Response (200 OK):
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "assistantName": "JARVIS",
  "assistantImage": "https://res.cloudinary.com/...",
  "history": [...],
  "createdAt": "2024-11-20T10:30:00.000Z",
  "updatedAt": "2024-11-22T15:45:00.000Z"
}

Cookies Set:
Set-Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; 
            HttpOnly; Path=/; Max-Age=864000; SameSite=Strict

Error Responses:
400: { "message": "email does not exists" }
400: { "message": "Incorrect password" }
500: { "message": "login error ..." }
```

**Flow Diagram:**
```
Request → Find User by Email → Found?
            ↓ (Yes)
         Compare Password Hash (bcryptjs)
            ↓ (Match)
         Generate JWT Token
            ↓
         Set httpOnly Cookie
            ↓
         Return User Object (200)
```

---

#### 3. Logout

```
GET /api/auth/logout
Authorization: Bearer token (in Cookie)

Success Response (200 OK):
{
  "message": "log out successfully"
}

Cookies Cleared:
Set-Cookie: token=; Path=/; Max-Age=0

Error Response:
400: { "message": "Token not found" }
```

---

### User Endpoints

#### 1. Get Current User

```
GET /api/user/current
Authorization: Bearer token (required via Cookie)

Success Response (200 OK):
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "assistantName": "JARVIS",
  "assistantImage": "https://res.cloudinary.com/...",
  "history": [...],
  "createdAt": "2024-11-20T10:30:00.000Z",
  "updatedAt": "2024-11-22T15:45:00.000Z"
}

Note: Password field is excluded for security

Error Response:
400: { "message": "User not found" }
500: { "message": "Get current user error" }
```

---

#### 2. Update Assistant

```
POST /api/user/update
Content-Type: multipart/form-data
Authorization: Bearer token (required via Cookie)

Request (FormData):
{
  "assistantName": "FRIDAY",
  "assistantImage": <file>,  // OR
  "imageUrl": "https://example.com/image.jpg"  // If not uploading file
}

Success Response (200 OK):
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "assistantName": "FRIDAY",
  "assistantImage": "https://res.cloudinary.com/demo/image/upload/v123/va/friday.jpg",
  "history": [],
  "createdAt": "2024-11-20T10:30:00.000Z",
  "updatedAt": "2024-11-22T17:00:00.000Z"
}

Error Response:
500: { "message": "Update Assistant error" }
```

**Flow Diagram:**
```
Request → Extract assistantName & imageUrl
    ↓
Check if File Uploaded
    ├─→ Yes: Upload to Cloudinary
    │        ├─ Get secure_url
    │        └─ Delete local file
    │
    └─→ No: Use imageUrl from request
    ↓
Update User in DB
    ├─ Set assistantName
    └─ Set assistantImage (URL)
    ↓
Return Updated User (200)
```

---

#### 3. Ask Assistant (Voice Command Processing)

```
POST /api/user/asktoassistant
Content-Type: application/json
Authorization: Bearer token (required via Cookie)

Request:
{
  "command": "what is the current time"
}

Success Response (200 OK):
{
  "type": "get_time",
  "userInput": "what is the current time",
  "response": "Current time is 03:45 PM"
}

Possible Response Types:
- get_time   → "Current time is HH:MM AM/PM"
- get_date   → "Current date is YYYY-MM-DD"
- get_day    → "Today is [Day Name]"
- get_month  → "Today is [Month Name]"
- google_search
- youtube_search / youtube_play
- calculator_open
- instagram_open / facebook_open
- weather_show
- general    → AI-generated response

Error Response:
400: { "response": "Sorry, i can't understand" }
500: { "response": "Ask to Assistant error" }
```

**Flow Diagram:**
```
Request → Extract Command
    ↓
Fetch User Data (name, assistantName)
    ↓
Call Gemini API with Prompt
    ├─ Include assistant name & user name
    ├─ Include command intent definitions
    └─ Return JSON response
    ↓
Parse Gemini Response JSON
    ↓
Extract Command Type
    ↓
Switch on Type:
    ├─ get_time   → Format with Moment.js
    ├─ get_date   → Format with Moment.js
    ├─ get_day    → Format with Moment.js
    ├─ get_month  → Format with Moment.js
    ├─ Other types → Return Gemini response as-is
    └─ Unknown    → Error response
    ↓
Return Response JSON (200)
```

---

## Controllers & Business Logic

### Authentication Controller (`auth.controllers.js`)

#### SignUp Function

```javascript
export const SignUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if email already exists
    const existEmail = await User.findOne({ email });
    if (existEmail) {
      return res.status(400).json({ message: "email already exists" });
    }
    
    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ message: "password must be at least 6 characters" });
    }
    
    // Hash password with bcryptjs (10 salt rounds)
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user document
    const user = await User.create({
      name,
      password: hashedPassword,
      email
    });
    
    // Generate JWT token (10 days expiry)
    const token = await genToken(user._id);
    
    // Set httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
      sameSite: "strict",
      secure: false  // Set to true in production with HTTPS
    });
    
    // Return user object
    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ message: `sign up error ${error}` });
  }
};
```

**Key Points:**
- Password validation: minimum 6 characters
- Email uniqueness: checked before creation
- Password hashing: bcryptjs with 10 rounds
- JWT expiry: 10 days
- Cookie: httpOnly for security

---

#### Login Function

```javascript
export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "email does not exists" });
    }
    
    // Compare provided password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    
    // Generate JWT token
    const token = await genToken(user._id);
    
    // Set httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: false
    });
    
    // Return user object
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `login error ${error}` });
  }
};
```

---

#### Logout Function

```javascript
export const Logout = async (req, res) => {
  try {
    // Clear token cookie
    res.clearCookie("token");
    return res.status(200).json({ message: "log out successfully" });
  } catch (error) {
    return res.status(500).json({ message: `logout error ${error}` });
  }
};
```

---

### User Controller (`user.controller.js`)

#### getCurrentUser Function

```javascript
export const getCurrentUser = async (req, res) => {
  try {
    // req.userId is set by isAuth middleware
    const userId = req.userId;
    
    // Find user and exclude password
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    
    // Return user data
    res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Get current user error' });
  }
};
```

---

#### updateAssistant Function

```javascript
export const updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body;
    let assistantImage;
    
    // Check if file was uploaded
    if (req.file) {
      // Upload to Cloudinary
      assistantImage = await uploadOnCloudinary(req.file.path);
    } else {
      // Use provided image URL
      assistantImage = imageUrl;
    }
    
    // Update user with new assistant data
    const user = await User.findByIdAndUpdate(
      req.userId,
      { assistantName, assistantImage },
      { new: true }  // Return updated document
    ).select("-password");
    
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Update Assistant error' });
  }
};
```

---

#### askToAssistant Function

```javascript
export const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body;
    
    // Get user data
    const user = await User.findById(req.userId);
    const userName = user.name;
    const assistantName = user.assistantName;
    
    // Call Gemini API with context
    const result = await geminiResponse(command, assistantName, userName);
    
    // Extract JSON from response
    const jsonMatch = result.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      return res.status(400).json({ response: "Sorry, i can't understand" });
    }
    
    // Parse JSON
    const gemResult = JSON.parse(jsonMatch[0]);
    const type = gemResult.type;
    
    // Handle different command types
    switch (type) {
      case "get_date":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Current date is ${moment().format("YYYY-MM-DD")}`
        });
      
      case "get_time":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Current time is ${moment().format("hh:mm A")}`
        });
      
      case "get_day":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Today is ${moment().format("dddd")}`
        });
      
      case "get_month":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Today is ${moment().format("MMMM")}`
        });
      
      case 'google_search':
      case 'youtube_search':
      case 'youtube_play':
      case 'calculator_open':
      case 'instagram_open':
      case 'facebook_open':
      case 'weather_show':
      case 'general':
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: gemResult.response
        });
      
      default:
        return res.status(400).json({ response: "Sorry, i can't understand this command" });
    }
  } catch (error) {
    return res.status(500).json({ response: 'Ask to Assistant error' });
  }
};
```

---

## Middleware & Authentication

### JWT Authentication Middleware (`isAuth.js`)

**Purpose:** Verify JWT token and attach user ID to request

```javascript
import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
  try {
    // Extract token from cookies
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(400).json({ message: "Token not found" });
    }
    
    // Verify token signature
    const verifyToken = await jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach userId to request object
    req.userId = verifyToken.userId;
    
    // Pass control to next middleware/route
    next();
  } catch (error) {
    return res.status(500).json({ message: "Is auth error" });
  }
};

export default isAuth;
```

**Usage in Routes:**
```javascript
// Protect endpoint with JWT verification
userRouter.get("/current", isAuth, getCurrentUser);
userRouter.post("/update", isAuth, upload.single("assistantImage"), updateAssistant);
```

**Flow:**
```
Client Request (with Cookie)
    ↓
Extract token from cookies
    ↓
Verify JWT signature & expiry
    ↓
Valid? → Extract userId → Attach to req.userId → next()
Invalid? → 400 error response
```

---

### File Upload Middleware (`multer.js`)

**Purpose:** Handle file uploads to temporary storage

```javascript
import multer from 'multer';

const storage = multer.diskStorage({
  // Set destination directory
  destination: (req, file, cb) => {
    cb(null, './public');  // Save to ./public folder
  },
  // Set filename
  filename: (req, file, cb) => {
    cb(null, file.originalname);  // Keep original name
  }
});

const upload = multer({ storage });

export default upload;
```

**Usage:**
```javascript
// Single file upload as "assistantImage"
router.post("/update", upload.single("assistantImage"), updateAssistant);
```

**File Flow:**
```
Client sends multipart/form-data
    ↓
Multer intercepts
    ↓
Save to ./public with original filename
    ↓
Pass file info to controller
    ├─ req.file.path      → File path
    ├─ req.file.filename  → Original filename
    └─ req.file.size      → File size
    ↓
Controller uploads to Cloudinary
    ↓
Delete local file
    ↓
Return Cloudinary URL
```

---

## Gemini AI Integration

### Gemini API Module (`gemini.js`)

**Purpose:** Process natural language commands and classify intent

```javascript
import axios from 'axios';

const geminiResponse = async (command, assistantName, userName) => {
  try {
    const apiUrl = process.env.GEMINI_API_URL;
    
    // Build comprehensive prompt
    const prompt = `You are a virtual assistant named ${assistantName}
    created by ${userName}.
    You are not a Google. you will now behave like a voice-enabled assistant.
    Your task is to understand the user's natural language input and response with a json object like this:
    {
      "type": "general" | "google_search" | "youtube_search" | "youtube_play" 
      | "get_time" | "get_date" | "get_day" | "get_month" | "calculator_open" 
      | "instagram_open" | "facebook_open" | "weather_show",
      "userInput": "<original user input>",
      "response": "<a short spoken response>"
    }
    
    Type meanings:
    - "general": Factual or informational question
    - "google_search": User wants to search on Google
    - "youtube_search": User wants to search on YouTube
    - "youtube_play": User wants to play a video/song
    - "calculator_open": User wants to open calculator
    - "instagram_open": User wants to open Instagram
    - "facebook_open": User wants to open Facebook
    - "weather_show": User wants to know weather
    - "get_time": User asks for current time
    - "get_date": User asks for today's date
    - "get_day": User asks what day it is
    - "get_month": User asks for current month
    
    Now process this command: ${command}`;
    
    // Send to Gemini API
    const result = await axios.post(apiUrl, {
      "contents": [{
        "parts": [{ "text": prompt }]
      }]
    });
    
    // Extract response text
    return result.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.log(error);
  }
};

export default geminiResponse;
```

**Request/Response Flow:**

```
Voice Command Input
    ↓
Extract text from command
    ↓
Build Prompt with Context:
  - Assistant Name
  - User Name
  - Intent Definitions
  - Command Text
    ↓
Send to Google Gemini API
    ↓
Gemini Returns:
{
  "type": "command_type",
  "userInput": "user text",
  "response": "spoken response"
}
    ↓
Extract JSON from response
    ↓
Return to Controller
```

**Environment Variable Required:**
```
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=YOUR_API_KEY
```

---

## File Upload & Cloudinary

### Cloudinary Upload Module (`config/cloudinary.js`)

**Purpose:** Upload files to Cloudinary CDN and return secure URLs

```javascript
import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

const uploadOnCloudinary = async (filePath) => {
  // Configure Cloudinary
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  try {
    // Upload file to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(filePath);
    
    // Remove local file after successful upload
    fs.unlinkSync(filePath);
    
    // Return secure HTTPS URL
    return uploadResult.secure_url;
  } catch (error) {
    // Clean up local file on error
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    // Throw error for controller to handle
    throw new Error(`Cloudinary Upload Error: ${error.message}`);
  }
};

export default uploadOnCloudinary;
```

**Upload Flow:**

```
User Uploads Avatar Image
    ↓
Multer saves to ./public/
    ↓
updateAssistant controller calls uploadOnCloudinary(filePath)
    ↓
Configure Cloudinary with credentials
    ↓
Upload file to Cloudinary CDN
    ↓
Success? → Get secure_url → Delete local file → Return URL
Fail? → Delete local file → Throw Error
    ↓
Controller catches error → Return 500 response
    OR
    ↓
Return secure URL to client
```

**Environment Variables Required:**
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## Error Handling

### Global Error Handling Strategy

**HTTP Status Codes:**
```
201 Created    → Resource created successfully (signup)
200 OK         → Request successful
400 Bad Request → Invalid input, validation error
500 Server Error → Unexpected error
```

**Error Response Format:**
```javascript
{
  "message": "Error description"
  // OR
  "response": "Error description"  // For askToAssistant
}
```

### Common Error Scenarios

**1. Authentication Errors:**
```javascript
// Email already exists
400: { "message": "email already exists" }

// Password too short
400: { "message": "password must be at least 6 characters" }

// Email not found
400: { "message": "email does not exists" }

// Wrong password
400: { "message": "Incorrect password" }

// Token missing
400: { "message": "Token not found" }
```

**2. User Errors:**
```javascript
// User not found
400: { "message": "User not found" }

// AI can't understand command
400: { "response": "Sorry, i can't understand" }

// Unknown command type
400: { "response": "Sorry, i can't understand this command" }
```

**3. Server Errors:**
```javascript
// General signup error
500: { "message": "sign up error ..." }

// General login error
500: { "message": "login error ..." }

// General logout error
500: { "message": "logout error ..." }

// Database error
500: { "message": "Get current user error" }

// Update error
500: { "message": "Update Assistant error" }

// AI processing error
500: { "response": "Ask to Assistant error" }
```

### Error Handling Pattern

```javascript
export const someController = async (req, res) => {
  try {
    // Business logic here
    
    // Validation check
    if (condition) {
      return res.status(400).json({ message: "Bad request" });
    }
    
    // Success response
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);  // Log for debugging
    return res.status(500).json({ message: "Operation error" });
  }
};
```

---

## Setup & Installation

### Prerequisites

- Node.js v14 or higher
- npm or yarn
- MongoDB Atlas account
- Google Gemini API key
- Cloudinary account
- Postman (for API testing)

### Step 1: Initialize Project

```bash
cd backend
npm init -y
```

### Step 2: Install Dependencies

```bash
npm install express mongoose jsonwebtoken bcryptjs cloudinary multer axios moment cors cookie-parser dotenv
npm install -D nodemon
```

### Step 3: Create Environment File

Create `.env` file in backend root:

```env
# MongoDB
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/virtualassistant

# JWT
JWT_SECRET=your_super_secret_key_make_it_long_and_complex

# Gemini API
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=YOUR_API_KEY

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server
PORT=8000
```

### Step 4: Start Server

```bash
npm run index
```

Expected output:
```
Server is running on port 8000
MongoDB connected successfully
```

### Step 5: Test API Endpoints

Using cURL:
```bash
# Sign up
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"test123"}'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

---

## Server Entry Point (`index.js`)

```javascript
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import cors from "cors";
import cookieParser from 'cookie-parser';

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// Load environment variables
dotenv.config();

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  connectDB();  // Connect to MongoDB
  console.log(`Server is running on port ${PORT}`);
});
```

---

**Documentation Version:** 1.0.0  
**Last Updated:** November 22, 2025
