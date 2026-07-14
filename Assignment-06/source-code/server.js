import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("public"));

// MongoDB connection
const client = new MongoClient(process.env.MONGO_URI);
await client.connect();
const appts = client.db("fsdl").collection("appointments");

// Fixed time slots
const slots = [
  "09:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "02:00 PM", "03:00 PM",
  "04:00 PM", "05:00 PM"
];

// Doctors list with specialties
const doctors = [
  { id: "d1", name: "Dr. Aisha Mehta",    specialty: "General Physician",  experience: "12 years" },
  { id: "d2", name: "Dr. Rohan Kapoor",   specialty: "Cardiologist",        experience: "18 years" },
  { id: "d3", name: "Dr. Priya Sharma",   specialty: "Dermatologist",       experience: "9 years"  },
  { id: "d4", name: "Dr. Sameer Joshi",   specialty: "Orthopedic Surgeon",  experience: "15 years" },
  { id: "d5", name: "Dr. Neha Gupta",     specialty: "Pediatrician",        experience: "11 years" },
];

// GET /api/slots — list available time slots
app.get("/api/slots", (req, res) => {
  res.json(slots);
});

// GET /api/doctors — list doctors with specialties
app.get("/api/doctors", (req, res) => {
  res.json(doctors);
});

// POST /api/appointments — create a new appointment
app.post("/api/appointments", async (req, res) => {
  const { name, phone, date, slot, doctorId } = req.body;

  // Validate all fields
  if (!name || !phone || !date || !slot || !doctorId) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // Validate phone (10 digits)
  if (!/^\d{10}$/.test(phone)) {
    return res.status(400).json({ error: "Phone must be a 10-digit number." });
  }

  // Validate date is not in the past
  const today = new Date().toISOString().split("T")[0];
  if (date < today) {
    return res.status(400).json({ error: "Cannot book an appointment in the past." });
  }

  // Validate doctor exists
  const doctor = doctors.find(d => d.id === doctorId);
  if (!doctor) {
    return res.status(400).json({ error: "Invalid doctor selected." });
  }

  // Check for slot clash with same doctor
  const clash = await appts.findOne({ date, slot, doctorId });
  if (clash) {
    return res.status(409).json({ error: "This slot is already booked for the selected doctor." });
  }

  const doc = {
    name,
    phone,
    date,
    slot,
    doctorId,
    doctorName: doctor.name,
    specialty: doctor.specialty,
    createdAt: new Date()
  };

  const out = await appts.insertOne(doc);
  res.json({ ok: true, id: out.insertedId, appointment: doc });
});

// GET /api/appointments — list all appointments (latest 50)
app.get("/api/appointments", async (req, res) => {
  const list = await appts.find().sort({ createdAt: -1 }).limit(50).toArray();
  res.json(list);
});

// DELETE /api/appointments/:id — cancel an appointment
app.delete("/api/appointments/:id", async (req, res) => {
  try {
    await appts.deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ ok: true });
  } catch {
    res.status(400).json({ error: "Invalid appointment ID." });
  }
});

app.listen(3000, () => console.log("Server running → http://localhost:3000"));
