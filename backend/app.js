import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import express from 'express';
import connectDB from './db/index.js';
import cookieParser from 'cookie-parser';
import { scheduleCleanup } from './utilities/fileCleanup.js';


const app = express();
const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  console.log('Database connected successfully');
  // Start automatic cleanup of temporary files
  import('./utilities/deleteUsers.js');
  scheduleCleanup(6); // Cleanup every 6 hours
}).catch((error) => {
  console.error('Database connection failed:', error);
  process.exit(1); // Exit the process with failure
});

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to SitVerse API' });
});


import userRoutes from './routes/user.route.js';

app.use('/api/users', userRoutes);

import adminRoutes from './routes/admin.route.js';
app.use('/api/admin', adminRoutes);


import postRoutes from './routes/post.route.js';
app.use('/api/posts', postRoutes);

import commentRoutes from './routes/comment.route.js';
app.use('/api/comments', commentRoutes);
