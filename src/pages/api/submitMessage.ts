import { NextApiRequest, NextApiResponse } from 'next';
import { Client } from 'pg';
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Extract data from the request body
    const { name, email, message } = req.body;

    // Check if all required fields are present
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Please fill out all fields.' });
    }

    // Check if POSTGRES_URL environment variable is set
    const connectionString = process.env.POSTGRES_URL;
    if (!connectionString) {
      return res.status(500).json({ message: 'Database connection string is not configured.' });
    }

    // Create a new PostgreSQL client
    const client = new Client({
      connectionString, // Use the POSTGRES_URL environment variable for connection
    });

    try {
      // Connect to the database
      await client.connect();

      // Insert the form data into the 'names' table
      const query = 'INSERT INTO names (name, email, message) VALUES ($1, $2, $3) RETURNING *';
      const values = [name, email, message];
      const result = await client.query(query, values);

      // Close the database connection
      await client.end();

      // Respond with success
      res.status(200).json({ message: 'Message stored successfully!', data: result.rows[0] });
    } catch (error) {
      console.error('Database error:', error);

      // Respond with error
      res.status(500).json({ message: 'Error storing the message.' });
    }
  } else {
    // If the method is not POST, return a 405 error
    res.status(405).json({ message: 'Method not allowed.' });
  }
}
