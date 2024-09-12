// pages/api/submitMessage.js
import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, email, message } = req.body;

    try {
      // Insert data into the Postgres database
      const result = await sql`
        INSERT INTO messages (name, email, message)
        VALUES (${name}, ${email}, ${message})
      `;

      res.status(200).json({ message: "Message successfully sent!" });
    } catch (error) {
      console.error("Error inserting data into PostgreSQL:", error);
      res.status(500).json({ message: "Failed to send message." });
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
}
