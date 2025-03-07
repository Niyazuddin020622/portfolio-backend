import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "express";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: ["http://localhost:5173", "https://personal-portfolio06.netlify.app"] }));
app.use(bodyParser.json());

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// API Route Test
app.get("/api", (req, res) => {
  res.json({ message: "✅ API is working!" });
});

// Contact Form Route
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "❌ All fields are required" });
  }

  try {
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: `New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    });

    res.status(200).json({ message: "✅ Message sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "❌ Failed to send email" });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
