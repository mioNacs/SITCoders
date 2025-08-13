# 📘 SitCoders – College Community Forum

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-brightgreen?style=flat-square\&logo=mongodb\&logoColor=white)]()
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)]()
[![Status](https://img.shields.io/badge/Status-Production--Ready-success?style=flat-square)]()

> A production-ready student community forum built with the MERN stack, designed for collaboration, knowledge sharing, and engagement within college communities.
=======
> *The official student forum platform for our college community.*

---

## 📁 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [API Overview](#api-overview)
5. [Project Structure](#project-structure)
6. [Getting Started](#getting-started)
7. [Roadmap](#roadmap)
8. [Team](#team)

---

## 💂 Overview

SitCoders is a web-based forum designed for students to post, discuss, and collaborate. It includes authentication, role-based access, post & comment systems, and a powerful admin dashboard — all in a modern, responsive interface.

---

## 🚀 Features

### 🔐 Authentication & Security

* Email + OTP verification
* JWT-based authentication (HTTP-only cookies)
* Role-based access: Student, Admin, Super Admin
* Admin approval for new users

### 📝 Content & Interaction

* Rich-text posts with Markdown & image uploads (Cloudinary)
* Tag-based filtering & shareable post URLs
* Nested comments & replies
* User profiles with avatars, bio, and post history

### 🛠 Admin Tools

* Approve/reject user registrations
* Manage posts & accounts
* Assign admin roles
* View user analytics

### 🎨 UI/UX

* Responsive design with Tailwind CSS
* Real-time updates
* URL-based navigation & pagination

---

## 🌐 Tech Stack

**Frontend:**

* React 19, React Router 7
* Tailwind CSS, Axios, DOMPurify, Marked

**Backend:**

* Node.js, Express 5
* MongoDB & Mongoose
* JWT, Bcrypt
* Multer & Cloudinary
* Nodemailer, Node-cron

**Development Tools:**

* Git & GitHub, ESLint, Nodemon, Vite

---

## 🔌 API Overview

### Users

```http
POST   /api/users/register           # Register with email & OTP
POST   /api/users/verify-otp         # Verify OTP
POST   /api/users/login              # Login
PUT    /api/users/profile            # Update profile
POST   /api/users/upload-avatar      # Upload avatar
```

### Posts

```http
GET    /api/posts/get-posts          # Get posts (pagination, filter)
POST   /api/posts/create-post        # Create post
PUT    /api/posts/:postId            # Edit post
DELETE /api/posts/:postId            # Delete post
```

### Comments

```http
POST   /api/comments/create/:postId  # Add comment
POST   /api/comments/reply/:id       # Reply to comment
```

### Admin

```http
GET    /api/admin/unverified-users   # List unverified users
PUT    /api/admin/verify-user/:id    # Verify user
```

---

## 📁 Project Structure

```
SITCoders/
├── backend/       # API controllers, models, routes, middleware
├── frontend/      # React application
└── uploads/       # Temporary file storage
```

---

## ⚡ Getting Started

### Prerequisites

* Node.js ≥16
* MongoDB
* Cloudinary account
* SMTP email service (e.g., Gmail)

### Installation

```bash
# Clone repo
git clone <repository-url>
cd SITCoders

# Backend setup
cd backend
npm install
npm run dev

# Frontend setup
cd frontend
npm install
npm run dev
```

**Backend `.env` Example**

```
MONGO_URI=your_mongodb_connection
ACCESS_TOKEN_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
EMAIL_USER=your_email
EMAIL_PASS=your_app_password
```

---

## 📌 Roadmap

* [ ] Real-time notifications (WebSocket)
* [ ] Advanced search
* [ ] Mobile app version
* [ ] Cloud deployment (AWS/Vercel)
* [ ] Unit testing

---

## 👨‍💻 Team

Built with ❤️ by:

* **Navneet Raj** – Lead Developer
* **Avesh Raj Singh** – Lead Developer

> *"Code together. Learn together." – SitCoders Team*

=======
This repository is currently **in active development.**

---

## 🚀 Project Status
✅ **Backend Development in Progress**  
✅ Repository created  
✅ Database models defined  
✅ User authentication system implemented  
✅ Post creation and management features  
✅ Comment and reply system  
🔄 Frontend development in progress  
🗓️ Next step: Complete frontend integration and testing

---

## 🏗️ Current Features
### Backend (Completed)
- **User Authentication:** JWT-based auth with secure login/signup
- **Profile Management:** User profiles with customizable details
- **Post Management:** Create, read, update, delete posts
- **Comment System:** Hierarchical comments with replies
- **Media Upload:** Image upload support with Cloudinary
- **Role-based Access:** Student and Admin roles
- **API Security:** Protected routes and input validation

### Frontend (In Development)
- Modern React-based user interface
- Responsive design with Tailwind CSS
- Real-time interactions

---

## 🌐 Tech Stack
- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Media Storage:** Cloudinary
- **File Upload:** Multer middleware
- **Security:** bcryptjs for password hashing
- **Environment:** dotenv for configuration

---

## 📁 Project Structure
```
SITCoders/
├── backend/
│   ├── controllers/     # Route handlers
│   ├── models/         # Database schemas
│   ├── routes/         # API endpoints
│   ├── middleware/     # Auth & validation
│   └── utils/          # Helper functions
├── frontend/           # React application
└── uploads/           # Temporary file storage
```

---

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB database
- Cloudinary account

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure your environment variables
npm run dev
```

### Environment Variables
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

---

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `GET /api/posts/:id` - Get specific post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### Comments
- `POST /api/comments/:postId` - Add comment to post
- `POST /api/comments/:commentId/reply` - Reply to comment
- `GET /api/comments/:postId` - Get comments for post

---

## 🤝 Contributing
We welcome contributions from fellow students and developers!

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Current Needs
- Frontend component development
- UI/UX improvements
- Testing and bug fixes
- Documentation improvements

---

## 🚀 What's Next
- [ ] Complete frontend development
- [ ] Implement real-time notifications
- [ ] Add admin moderation dashboard
- [ ] Mobile responsiveness improvements
- [ ] Performance optimizations
- [ ] Deployment setup

---


## ✨ Team
Built with ❤️ by the SitCoders development team.

> *"Code together. Learn together." – The SitCoders Team*

---
