# 💬 ChatApp

A full-stack real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js), featuring real-time messaging using Socket.io, robust authentication, and media sharing.

## ✨ Features

- **🔐 Robust Authentication & Authorization**: Secure user login and registration using JWT (JSON Web Tokens) and HTTP-only cookies.
- **⚡ Real-time Messaging**: Instant message delivery and receipt using Socket.io.
- **🟢 Online User Status**: See which users are currently online in real-time.
- **🖼️ Image Sharing**: Support for uploading and sharing images in real-time using Cloudinary.
- **🛡️ Security**: Enhanced security and rate-limiting using Arcjet.
- **📧 Email Notifications**: Email integration powered by Resend (e.g., for welcome emails or alerts).
- **💅 Modern UI**: Beautiful, responsive user interface built with React, TailwindCSS, and DaisyUI.
- **🔄 Global State Management**: Efficient state management using Zustand.
- **🚨 Error Handling**: Toast notifications for a smooth user experience (react-hot-toast).

## 🛠️ Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Styling**: TailwindCSS, DaisyUI
- **State Management**: Zustand
- **Routing**: React Router
- **Real-time Communication**: Socket.io-client
- **HTTP Client**: Axios
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Real-time Communication**: Socket.io
- **Authentication**: JWT, bcryptjs, cookie-parser
- **Image Storage**: Cloudinary
- **Security & Rate Limiting**: Arcjet
- **Emails**: Resend

## 🚀 Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (or yarn/pnpm)
- MongoDB Database (Local or MongoDB Atlas)
- Cloudinary Account
- Resend Account (Optional, for emails)
- Arcjet Key (Optional, for security features)

### Setup Instructions

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone https://github.com/Archis009/ChatApp.git
   cd ChatApp
   ```

2. **Install dependencies**:
   To install dependencies for both the frontend and backend, run the following command from the root directory:
   ```bash
   npm run build
   ```
   *(Alternatively, you can navigate to the `/backend` and `/frontend` directories and run `npm install` individually).*

3. **Environment Variables**:
   
   Create a `.env` file in the **`backend`** directory and add the following keys:
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret_key

   # Resend setup for emails
   RESEND_API_KEY=your_resend_api_key
   EMAIL_FROM=onboarding@resend.dev
   EMAIL_FROM_NAME=YourName

   # Cloudinary setup for image uploads
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret

   # Arcjet setup for security
   ARCJET_KEY=your_arcjet_api_key
   ARCJET_ENV=development

   CLIENT_URL=http://localhost:5173
   ```

   Create a `.env` file in the **`frontend`** directory and add the following keys:
   ```env
   VITE_BACKEND_URL=http://localhost:3000
   ```

### Running the Application Locally

1. **Start the Backend Server**:
   Open a terminal, navigate to the `backend` folder, and start the development server:
   ```bash
   cd backend
   npm run dev
   ```
   The backend server should now be running on `http://localhost:3000`.

2. **Start the Frontend Development Server**:
   Open a second terminal, navigate to the `frontend` folder, and start the Vite dev server:
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend application should now be running on `http://localhost:5173`.

## 📁 Project Structure

```
ChatApp/
├── backend/               # Express+Node.js backend
│   ├── src/
│   │   ├── controllers/   # Route controllers (auth, messages, etc.)
│   │   ├── models/        # Mongoose database models
│   │   ├── routes/        # Express API routes
│   │   ├── lib/           # Utility functions, DB connection, Socket.io setup
│   │   └── server.js      # Main entry point for the backend
│   └── package.json
└── frontend/              # React+Vite frontend
    ├── src/
    │   ├── components/    # Reusable React components
    │   ├── pages/         # Page-level components
    │   ├── store/         # Zustand state slices
    │   ├── lib/           # Utility functions and axios configuration
    │   ├── App.jsx        # Main App component
    │   └── main.jsx       # React DOM entry point
    └── package.json
```

## 📜 License

This project is open-source and available under the ISC License.
