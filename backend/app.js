import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './db/index.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  console.log('Database connected successfully');
}).catch((error) => {
  console.error('Database connection failed:', error);
  process.exit(1); // Exit the process with failure
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

