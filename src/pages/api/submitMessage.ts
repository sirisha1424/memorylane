import { NextApiRequest, NextApiResponse } from 'next';
import Redis from 'ioredis';
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

// Create a new Redis client
const redis = new Redis(process.env.REDIS_URL); // Use the REDIS_URL environment variable for connection

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Extract data from the request body
    const { name, email, message } = req.body;

    // Check if all required fields are present
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Please fill out all fields.' });
    }

    try {
      // Generate a unique key for the message
      const messageKey = `message:${Date.now()}`;

      // Store the message in Redis
      await redis.hmset(messageKey, { name, email, message });

      // Respond with success
      res.status(200).json({ message: 'Message stored successfully!' });
    } catch (error) {
      console.error('Redis error:', error);

      // Respond with error
      res.status(500).json({ message: 'Error storing the message.' });
    }
  } else {
    // If the method is not POST, return a 405 error
    res.status(405).json({ message: 'Method not allowed.' });
  }
}
