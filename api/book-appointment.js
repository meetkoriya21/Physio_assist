// api/book-appointment.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { fullName, email, phone, service, preferredDate, preferredTime, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS  
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'doctor@yourclinic.com', // Replace with the actual doctor's email
    subject: `New Appointment Request from ${fullName}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>New Appointment Booking Request</h2>
        <p><strong>Patient Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Service Requested:</strong> ${service}</p>
        <p><strong>Preferred Date:</strong> ${preferredDate}</p>
        <p><strong>Preferred Time:</strong> ${preferredTime}</p>
        <p><strong>Medical History/Message:</strong></p>
        <p>${message || 'No additional message provided.'}</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email sent successfully.' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ success: false, message: 'Failed to send request.' });
  }
}