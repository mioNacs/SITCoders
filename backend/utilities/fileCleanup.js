import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Clean up old temporary files from uploads directory
 * Files older than specified age (in milliseconds) will be deleted
 */
export const cleanupOldFiles = async (maxAge = 24 * 60 * 60 * 1000) => { // Default: 24 hours
  const uploadsDir = path.join(__dirname, '../uploads/temp');
  
  try {
    if (!fs.existsSync(uploadsDir)) {
      return;
    }

    const files = fs.readdirSync(uploadsDir);
    const now = Date.now();
    let deletedCount = 0;

    for (const file of files) {
      const filePath = path.join(uploadsDir, file);
      const stats = fs.statSync(filePath);
      
      if (now - stats.mtime.getTime() > maxAge) {
        try {
          fs.unlinkSync(filePath);
          deletedCount++;
        } catch (deleteError) {
          console.error(`Failed to delete old file ${file}:`, deleteError);
        }
      }
    }

    if (deletedCount > 0) {
      console.log(`Cleaned up ${deletedCount} old temporary files`);
    }
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
};

/**
 * Schedule automatic cleanup to run periodically
 */
export const scheduleCleanup = (intervalHours = 6) => {
  const intervalMs = intervalHours * 60 * 60 * 1000;
  
  setInterval(() => {
    cleanupOldFiles();
  }, intervalMs);
  
  console.log(`Scheduled automatic cleanup every ${intervalHours} hours`);
};
