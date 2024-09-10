import type { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, email, message } = req.body;

    try {
      // Insert form data into the PostgreSQL table
      await sql`
        INSERT INTO messages (name, email, message)
        VALUES (${name}, ${email}, ${message})
        ON CONFLICT (email) DO NOTHING;
      `;
      res.status(200).json({ message: 'Message successfully sent!' });
    } catch (error) {
      console.error('Error inserting data:', error);
      res.status(500).json({ message: 'Failed to send message.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
