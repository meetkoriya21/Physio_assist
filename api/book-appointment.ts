import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { fullName, email, phone, service, preferredDate, preferredTime, message } = req.body;

  // 1. Explicit SMTP configuration (Better for Vercel)
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'meetkoriya254@.com', // Replace with your receiving email
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
        <p><strong>Message:</strong></p>
        <p>${message || 'No additional message provided.'}</p>
      </div>
    `,
  };

  try {
    // 2. Wrap in a Promise to prevent Vercel timeout closures
    await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error('SendMail Error:', err);
          reject(err);
        } else {
          resolve(info);
        }
      });
    });

    res.status(200).json({ success: true, message: 'Email sent successfully.' });
  } catch (error) {
    console.error('Detailed API Error:', error);
    res.status(500).json({ success: false, message: 'Failed to send request.', error: error.message });
  }
}