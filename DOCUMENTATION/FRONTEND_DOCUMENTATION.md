# Virtual Assistant - Frontend Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Project Structure](#project-structure)
4. [Technologies Used](#technologies-used)
5. [Components & Pages](#components--pages)
6. [State Management](#state-management)
7. [User Flows](#user-flows)
8. [Features & Implementation](#features--implementation)
9. [Styling & Design](#styling--design)
10. [Voice Features](#voice-features)
11. [Setup & Installation](#setup--installation)

---

## Overview

The Virtual Assistant Frontend is a React 19 application built with Vite that provides a modern, interactive user interface for voice-controlled AI assistant. Users can register, customize their assistant with avatars and names, and interact via voice commands.

**Key Features:**
- User Authentication (Sign Up / Login)
- Assistant Customization (Avatar Selection & Name Input)
- Real-time Voice Recognition
- Text-to-Speech Response
- Responsive Design with TailwindCSS
- Real-time AI Command Processing

---

## Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    BROWSER                              │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │          React Application (Port 5173)           │  │
│  │                                                  │  │
│  │  ┌────────────────────────────────────────────┐ │  │
│  │  │        React Router (BrowserRouter)        │ │  │
│  │  │                                            │ │  │
│  │  │  ┌─────────┐  ┌─────────┐  ┌──────────┐  │ │  │
│  │  │  │ Sign Up │→ │ Login   │→ │Customize │  │ │  │
│  │  │  └─────────┘  └─────────┘  │ Pages    │  │ │  │
│  │  │                             ├──────────┤  │ │  │
│  │  │                             │   Home   │  │ │  │
│  │  │                             │ (Voice)  │  │ │  │
│  │  │                             └──────────┘  │ │  │
│  │  └────────────────────────────────────────────┘ │  │
│  │                       ↓                         │  │
│  │  ┌────────────────────────────────────────────┐ │  │
│  │  │     UserContext (Global State)             │ │  │
│  │  │   - userData                               │ │  │
│  │  │   - selectedImage                          │ │  │
│  │  │   - assistantName                          │ │  │
│  │  │   - Gemini API calls                       │ │  │
│  │  └────────────────────────────────────────────┘ │  │
│  │                       ↓                         │  │
│  │  ┌────────────────────────────────────────────┐ │  │
│  │  │    Web APIs                                │ │  │
│  │  │   - Speech Recognition (Microphone)       │ │  │
│  │  │   - Speech Synthesis (Speaker)            │ │  │
│  │  │   - Fetch/Axios (HTTP)                    │ │  │
│  │  └────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
                          ↓ HTTPS/HTTP
              ┌───────────────────────────┐
              │   Backend API Server      │
              │   (http://localhost:8000) │
              └───────────────────────────┘
```

---

## Project Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── signup.jsx              # User registration page
│   │   ├── login.jsx               # User login page
│   │   ├── Customize.jsx           # Avatar selection page
│   │   ├── Customize2.jsx          # Assistant name input page
│   │   └── Home.jsx                # Main voice interaction page
│   ├── components/
│   │   └── Card.jsx                # Avatar image card component
│   ├── context/
│   │   └── UserContext.jsx         # Global state management
│   ├── assets/
│   │   ├── image1.png to image7    # Pre-made assistant avatars
│   │   ├── authBg.png              # Authentication background
│   │   └── ai.gif                  # AI animation
│   ├── App.jsx                     # Router configuration
│   ├── main.jsx                    # React entry point
│   └── index.css                   # Global styles (TailwindCSS)
├── public/
│   └── vite.svg                    # Static assets
├── index.html                      # HTML template
├── vite.config.js                  # Vite configuration
├── eslint.config.js                # ESLint configuration
├── package.json                    # Dependencies
└── README.md                       # Project README
```

---

## Technologies Used

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.2.0 | UI Framework |
| React Router | 7.9.6 | Client-side Routing |
| Vite | 7.2.2 | Build Tool & Dev Server |
| TailwindCSS | 4.1.17 | Utility-first CSS Framework |
| Axios | 1.13.2 | HTTP Client |
| React Icons | 5.5.0 | Icon Library |
| Moment.js | 2.30.1 | Date/Time Utilities |
| Web Speech API | Native Browser | Voice Recognition & Synthesis |

---

## Components & Pages

### 1. Sign Up Page (`signup.jsx`)

**Purpose:** User registration with email and password

**Features:**
- Name, Email, Password input fields
- Password visibility toggle
- Form validation
- Loading state during submission
- Error message display
- Link to login page
- Glass-morphism design with backdrop blur

**Flow:**
```
User Input → Validation → API Call (POST /api/auth/signup)
   ↓
Success: Set JWT Cookie + Navigate to /customize
Fail: Show Error Message
```

**Key States:**
- `name`, `email`, `password` (form inputs)
- `loading` (submission state)
- `err` (error message)
- `showPassword` (password visibility)

**Key Functions:**
```javascript
const handleSignup = async (e) => {
  // Validate input
  // Call signup API
  // Set context userData
  // Navigate to customize
}
```

---

### 2. Login Page (`login.jsx`)

**Purpose:** User authentication

**Features:**
- Email and Password input
- Password visibility toggle
- Form validation
- Error handling
- Link to signup page
- Same glass-morphism design

**Flow:**
```
Email & Password Input → API Call (POST /api/auth/login)
   ↓
Success: Set JWT Cookie + Navigate to /
Fail: Show Error Message
```

---

### 3. Customize Page (`Customize.jsx`)

**Purpose:** Avatar selection for the assistant

**Features:**
- Display 7 pre-made avatar images
- Custom image upload functionality
- Selected image highlighting
- Responsive grid layout
- Visual feedback on selection
- "Next" button to proceed

**Avatar Selection Flow:**
```
┌─────────────────────────────────┐
│  Display Image Grid             │
│  - 7 Pre-made Images            │
│  - 1 Upload Box                 │
└────────┬────────────────────────┘
         │
         ↓
  User Clicks Image
         │
         ├─→ Pre-made? → setSelectedImage(imageUrl)
         │
         └─→ Upload? → Open File Input → Read File
                      → setBackendImage(file)
                      → setFrontendImage(preview)
         │
         ↓
  Highlight Selected Image
  Show "Next" Button
         │
         ↓
  Click Next → Navigate to /customize2
```

**State Management:**
```javascript
selectedImage   // Currently selected image
frontendImage   // Preview for uploaded image
backendImage    // File object for upload
```

---

### 4. Customize2 Page (`Customize2.jsx`)

**Purpose:** Set custom assistant name

**Features:**
- Text input for assistant name
- Submit button (enabled only when name is entered)
- Loading state during API call
- Navigation to home page
- Back button to image selection

**Flow:**
```
User Enters Name
         ↓
Submit Button Enabled
         ↓
Click Submit → API Call (POST /api/user/update)
         ↓
FormData Creation:
  - assistantName
  - assistantImage (file) OR imageUrl (string)
         ↓
Success: Update userData in context
         ↓
Navigate to / (Home)
```

---

### 5. Home Page (`Home.jsx`)

**Purpose:** Main voice interaction interface

**Features:**
- Display assistant avatar image
- Display assistant name
- Real-time voice recognition
- Voice synthesis (text-to-speech)
- Continuous listening mode
- Logout button
- Customize button

**Voice Interaction Flow:**
```
┌─────────────────────────────────────────────────┐
│  Initialize Web Speech API                      │
│  Set continuous listening = true                │
│  Language = en-US                              │
└──────────────┬──────────────────────────────────┘
               │
               ↓
    🎤 Listening for Commands...
               │
      User Says: "Assistant Name [Command]"
               │
               ↓
    Check if Assistant Name Mentioned
               │
       ┌───────┴────────┐
       │                │
      NO               YES
       │                │
       ↓                ↓
  Continue        Stop Microphone
  Listening       │
                  ↓
            Send to Gemini AI
            POST /api/user/asktoassistant
                  │
                  ↓
        Get Response JSON:
        {
          type: string,
          userInput: string,
          response: string
        }
                  │
                  ↓
        🔊 Speak Response (Text-to-Speech)
                  │
        ┌─────────┼─────────┐
        │         │         │
      Search  YouTube  Other
        │         │         │
        ↓         ↓         ↓
     Open URL  Open URL  Just Speak
        │         │         │
        └─────────┼─────────┘
                  │
                  ↓
        Resume Microphone Listening
```

**Key States:**
```javascript
listening        // Microphone active state
isSpeakingRef   // Ref to track speech state
recognitionRef  // Web Speech API instance
```

**Key Functions:**
```javascript
startRecognition()     // Start listening
speak(text)            // Text-to-speech
handleCommand(data)    // Process command type
handleLogout()         // Logout user
```

---

### 6. Card Component (`Card.jsx`)

**Purpose:** Reusable avatar image card

**Features:**
- Display image with hover effects
- Selection highlighting
- Responsive sizing
- Click handler for selection

**Props:**
```javascript
{
  image: string  // Image URL or path
}
```

**Styling:**
- Mobile: 70px × 140px
- Desktop: 150px × 250px
- Hover: Shadow & border effects
- Selected: White border & blue shadow

---

## State Management

### UserContext (Global State)

**Location:** `src/context/UserContext.jsx`

**Context Structure:**
```javascript
{
  serverUrl,              // Backend API URL
  userData: {             // Current user data
    _id,
    name,
    email,
    assistantName,
    assistantImage,
    history,
    createdAt,
    updatedAt
  },
  setUserData,            // Function to update userData
  frontendImage,          // Image preview URL
  setFrontendImage,
  backendImage,           // File object for upload
  setBackendImage,
  selectedImage,          // Currently selected image
  setSelectedImage,
  getGeminiResponse      // Function to fetch AI response
}
```

**Provider Setup:**
```javascript
<BrowserRouter>
  <UserContext>
    <App />
  </UserContext>
</BrowserRouter>
```

**Key Methods:**
```javascript
// Fetch current user on mount
handleCurrentUser()

// Get AI response for voice command
getGeminiResponse(command)
  → POST /api/user/asktoassistant
  → Return {type, userInput, response}
```

---

## User Flows

### Complete User Journey

```
START
  │
  ├─→ New User Path
  │   │
  │   ├─→ Sign Up Page
  │   │   ├─ Enter: Name, Email, Password
  │   │   ├─ Validate inputs
  │   │   └─ POST /api/auth/signup
  │   │       │
  │   │       ├─ Success: JWT Cookie Set
  │   │       └─ Navigate to /customize
  │   │
  │   ├─→ Customize Page (Image Selection)
  │   │   ├─ Display 7 avatars + upload
  │   │   ├─ User selects or uploads image
  │   │   └─ Navigate to /customize2
  │   │
  │   ├─→ Customize2 Page (Name Input)
  │   │   ├─ Enter assistant name
  │   │   ├─ POST /api/user/update
  │   │   │   ├─ FormData: name + image
  │   │   │   └─ Cloudinary upload
  │   │   └─ Navigate to /
  │   │
  │   └─→ Home Page (Voice Interaction)
  │       ├─ Display avatar + name
  │       ├─ Initialize voice recognition
  │       └─ Start listening...
  │
  ├─→ Existing User Path
  │   │
  │   ├─→ Login Page
  │   │   ├─ Enter: Email, Password
  │   │   ├─ POST /api/auth/login
  │   │   │   └─ JWT Cookie Set
  │   │   └─ Navigate to /
  │   │
  │   └─→ Home Page (Voice Interaction)
  │       ├─ Display avatar + name
  │       ├─ Initialize voice recognition
  │       └─ Start listening...
  │
  └─→ End State (Voice Interaction Loop)
      │
      ├─→ Speak command with assistant name
      ├─→ AI processes request
      ├─→ Get response (type + text)
      ├─→ Handle command (search, time, etc.)
      ├─→ Speak response
      ├─→ Resume listening
      └─→ Loop back to voice input
```

---

## Features & Implementation

### 1. Authentication Flow

**Sign Up:**
```
Form Input → Validation → axios.post(/api/auth/signup)
              ↓
          JWT Cookie Set (httpOnly)
              ↓
          userData in Context
              ↓
          Navigate to /customize
```

**Login:**
```
Form Input → Validation → axios.post(/api/auth/login)
              ↓
          JWT Cookie Set (httpOnly)
              ↓
          userData in Context
              ↓
          Navigate to / (Home)
```

### 2. Image Selection & Upload

**Pre-made Avatar:**
```
Click Card → setSelectedImage(imageUrl)
         → Store URL in context
         → Pass to backend on update
```

**Custom Upload:**
```
Click Upload Box → Open File Dialog
                → Read File
                → setBackendImage(file)
                → Preview: setFrontendImage(URL.createObjectURL(file))
                → Pass file to FormData on update
```

### 3. Voice Recognition Implementation

**Browser APIs Used:**
- `window.SpeechRecognition` or `window.webkitSpeechRecognition`
- `window.SpeechSynthesisUtterance`

**Continuous Listening:**
```javascript
recognition.continuous = true;
recognition.interimResults = true;

recognition.onresult = (e) => {
  const transcript = e.results[e.results.length - 1][0].transcript;
  
  if (transcript.toLowerCase().includes(assistantName.toLowerCase())) {
    // Name mentioned, process command
    getGeminiResponse(transcript);
  }
};

recognition.onend = () => {
  // Auto-restart after 10 seconds or manual restart
  setTimeout(() => recognition.start(), 10000);
};
```

### 4. Command Processing

**Types Handled:**
```javascript
get_time        → Format current time
get_date        → Format current date
get_day         → Get day name
get_month       → Get month name
google_search   → Open Google search
youtube_search  → Open YouTube search
youtube_play    → Open YouTube
calculator_open → Open calculator
instagram_open  → Open Instagram
facebook_open   → Open Facebook
weather_show    → Open weather search
general         → AI response
```

**Implementation:**
```javascript
const handleCommand = (data) => {
  const {type, userInput, response} = data;
  
  speak(response);  // Speak the response
  
  switch(type) {
    case 'google_search':
      window.open(`https://www.google.com/search?q=${userInput}`, '_blank');
      break;
    case 'youtube_search':
      window.open(`https://www.youtube.com/results?search_query=${userInput}`, '_blank');
      break;
    // ... handle other types
  }
};
```

---

## Styling & Design

### Design System

**Color Palette:**
```
Primary Background:   #030353 (Dark Blue)
Secondary Background: #000000 (Black)
Text Color:          #FFFFFF (White)
Accent Color:        #0084ff (Bright Blue)
Error Color:         #EF4444 (Red)
Border Color:        #0000ff66 (Transparent Blue)
```

**Typography:**
```
Headings:     font-semibold, text-[30px]
Body Text:    text-white, text-[18px]
Placeholder:  text-gray-300
Errors:       text-red-500
```

**Components Styling:**
```
Input Fields:  
  - rounded-full (border-radius: 9999px)
  - border-2 border-white
  - bg-transparent
  - text-white

Buttons:
  - rounded-full
  - min-w-[150px], h-[60px]
  - bg-white
  - cursor-pointer
  - hover effects

Cards:
  - rounded-2xl
  - border-2 border-[#0000ff66]
  - hover:shadow-2xl hover:shadow-blue-950
  - Selected: border-4 border-white
```

**Responsive Design:**
```
Mobile:    w-[70px] h-[140px]
Desktop:   lg:w-[150px] lg:h-[250px]

Grid:      grid gap-[15px]
Flex:      flex justify-center items-center flex-col
```

**Effects:**
```
Gradient:        bg-gradient-to-t from-[black] to-[#02023d]
Backdrop Blur:   backdrop-blur
Shadow:          shadow-lg shadow-black
Transitions:     smooth hover effects
```

---

## Voice Features

### Web Speech API Integration

**Speech Recognition Setup:**
```javascript
const recognition = new (window.SpeechRecognition || 
                         window.webkitSpeechRecognition)();

recognition.continuous = true;      // Keep listening
recognition.interimResults = false;  // Only final results
recognition.lang = 'en-US';          // Language
```

**Speech Synthesis:**
```javascript
const speak = (text) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 1.0;
  
  utterance.onend = () => {
    // Resume listening after speech
    startRecognition();
  };
  
  window.speechSynthesis.speak(utterance);
};
```

**Name Trigger Detection:**
```javascript
// Check if user mentioned assistant name
if (transcript.toLowerCase().includes(
    userData.assistantName.toLowerCase()
)) {
  // Process as command
  stop_recognition();
  getGeminiResponse(transcript);
}
```

---

## Setup & Installation

### Prerequisites
- Node.js v14 or higher
- npm or yarn
- Backend server running (port 8000)
- Modern browser with Web Speech API support

### Installation Steps

**1. Navigate to frontend directory:**
```bash
cd frontend
```

**2. Install dependencies:**
```bash
npm install
```

**3. Start development server:**
```bash
npm run dev
```

Server runs on: `http://localhost:5173`

**4. Build for production:**
```bash
npm run build
```

Output: `dist/` folder

### Environment Configuration

Create `.env.local` if needed:
```
VITE_API_BASE_URL=http://localhost:8000
```

### Browser Requirements

**For Voice Features:**
- Chrome 25+
- Firefox 20+
- Safari 14.1+
- Edge 79+

**Permissions Required:**
- Microphone access (granted by browser popup)
- Clipboard access (for any copy operations)

---

## API Integration

### Endpoints Used

**Authentication:**
- `POST /api/auth/signup` → Register user
- `POST /api/auth/login` → Login user
- `GET /api/auth/logout` → Logout user

**User Management:**
- `GET /api/user/current` → Get current user data
- `POST /api/user/update` → Update assistant name & image
- `POST /api/user/asktoassistant` → Get AI response

### Axios Configuration

```javascript
const config = {
  withCredentials: true,  // Send cookies
  headers: {
    'Content-Type': 'application/json'
  }
};

axios.post(url, data, config);
```

---

## Troubleshooting

### Common Issues

**Microphone Not Working:**
- Check browser permissions
- Grant microphone access
- Refresh page
- Try different browser

**Cannot Login:**
- Check backend is running
- Verify API URL in context
- Check network tab for CORS errors
- Verify credentials

**Images Not Loading:**
- Check Cloudinary connection
- Verify image URLs are correct
- Check file permissions

**Voice Commands Not Processing:**
- Ensure assistant name is set
- Say assistant name clearly
- Check browser console for errors
- Verify Gemini API is working

---

**Documentation Version:** 1.0.0  
**Last Updated:** November 22, 2025
