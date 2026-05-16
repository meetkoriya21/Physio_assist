import mongoose from 'mongoose';

// ── Schema ────────────────────────────────────────────────────────────────────
const AppointmentSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  email:     { type: String, required: true },
  phone:     { type: String, required: true },
  service:   { type: String, required: true },
  date:      { type: String, required: true },
  time:      { type: String, required: true },
  message:   { type: String, default: '' },
  status:    { type: String, default: 'Pending', enum: ['Pending', 'Confirmed', 'Completed'] },
  createdAt: { type: Date,   default: Date.now },
});

// Avoid Vercel "OverwriteModelError"
const Appointment =
  mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema);

// ── DB connection (cached across Vercel warm invocations) ─────────────────────
async function connectDB() {
  if (mongoose.connection.readyState === 1) return; // already connected

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    // ❌ This is why you get 500 — the env var is missing on Vercel.
    // Fix: add MONGODB_URI in Vercel → Project Settings → Environment Variables
    throw new Error(
      'MONGODB_URI environment variable is not set. ' +
      'Go to Vercel → your project → Settings → Environment Variables and add it.'
    );
  }

  await mongoose.connect(uri, {
    // Recommended options for Vercel serverless
    bufferCommands: false,
    serverSelectionTimeoutMS: 5000,
  });
}

// ── Handler ───────────────────────────────────────────────────────────────────
export default async function handler(req: any, res: any) {
  try {
    await connectDB();
  } catch (error: any) {
    console.error('DB connection error:', error.message);
    return res.status(500).json({
      error: 'Database connection failed',
      detail: error.message,
    });
  }

  // POST — save a new appointment
  if (req.method === 'POST') {
    try {
      const { name, email, phone, service, date, time, message } = req.body;

      // Basic validation
      if (!name || !email || !phone || !service || !date || !time) {
        return res.status(400).json({ success: false, error: 'Missing required fields' });
      }

      const appointment = new Appointment({ name, email, phone, service, date, time, message });
      await appointment.save();

      return res.status(201).json({ success: true, message: 'Appointment saved!' });
    } catch (error: any) {
      console.error('Save error:', error.message);
      return res.status(400).json({ success: false, error: 'Failed to save appointment' });
    }
  }

  // GET — fetch all appointments (for doctor dashboard)
  if (req.method === 'GET') {
    try {
      const appointments = await Appointment.find().sort({ date: 1, time: 1 });
      return res.status(200).json(appointments);
    } catch (error: any) {
      console.error('Fetch error:', error.message);
      return res.status(400).json({ success: false, error: 'Failed to fetch appointments' });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
