# 📘 SitCoders

> *The official student forum platform for our college community.*

---

## 🗂️ Overview
SitCoders is an open-source project to build a modern, web-based discussion forum for college students.  

Our mission is to enable students to:
- Ask questions
- Share project updates
- Discuss academic and technical topics
- Collaborate with peers in a safe, moderated environment

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
