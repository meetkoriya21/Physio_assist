import mongoose from 'mongoose';

// 1. Define what an Appointment looks like in the database
const AppointmentSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  service: String,
  date: String,
  time: String,
  message: String,
  status: { type: String, default: 'Pending' }, // 'Pending', 'Confirmed', or 'Completed'
  createdAt: { type: Date, default: Date.now }
});

// Avoid Vercel "OverwriteModelError" by checking if it already exists
const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema);

export default async function handler(req, res) {
  // Connect to the database using your secure string
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI);
    }
  } catch (error) {
    console.error("Database connection failed:", error);
    return res.status(500).json({ error: "Database connection failed" });
  }

  // POST Request: Save a new appointment (from the patient booking form)
  if (req.method === 'POST') {
    try {
      const newAppointment = new Appointment(req.body);
      await newAppointment.save();
      return res.status(201).json({ success: true, message: "Appointment saved to database!" });
    } catch (error) {
      return res.status(400).json({ success: false, error: "Failed to save appointment" });
    }
  }

  // GET Request: Fetch all appointments (for your Doctor Dashboard)
  if (req.method === 'GET') {
    try {
      // Fetch all, sort by closest date first
      const appointments = await Appointment.find().sort({ date: 1, time: 1 });
      return res.status(200).json(appointments);
    } catch (error) {
      return res.status(400).json({ success: false, error: "Failed to fetch appointments" });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}