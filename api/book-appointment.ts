import nodemailer from 'nodemailer';

// ── Handler ───────────────────────────────────────────────────────────────────
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // ── Validate env vars first ──────────────────────────────────────────────
  const EMAIL_USER = process.env.EMAIL_USER;
  const EMAIL_PASS = process.env.EMAIL_PASS;
  // ✅ REPLACE the address below with your real receiving email
  const EMAIL_TO   = process.env.EMAIL_TO || 'meetkoriya254@gmail.com';

  if (!EMAIL_USER || !EMAIL_PASS) {
    console.error('Missing EMAIL_USER or EMAIL_PASS environment variables');
    return res.status(500).json({
      success: false,
      message: 'Email service not configured. Add EMAIL_USER and EMAIL_PASS in Vercel env vars.',
    });
  }

  // ── Parse body ────────────────────────────────────────────────────────────
  const { name, email, phone, service, date, time, message } = req.body;

  if (!name || !email || !phone || !service || !date || !time) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  // ── Nodemailer transporter (Gmail) ────────────────────────────────────────
  const transporter = nodemailer.createTransport({
    host:   'smtp.gmail.com',
    port:   465,
    secure: true,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS, // Use Gmail App Password (not your normal Gmail password)
    },
  });

  // ── Email to clinic (notification) ───────────────────────────────────────
  const clinicMail = {
    from:    `"PhysioLife Booking" <${EMAIL_USER}>`,
    to:      EMAIL_TO,
    subject: `📅 New Appointment Request — ${name}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;padding:24px;background:#f9f9f9;border-radius:8px">
        <h2 style="color:#0F6E56;margin-top:0">New Appointment Request</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <tr><td style="padding:8px 0;color:#555;width:140px"><strong>Patient Name</strong></td><td>${name}</td></tr>
          <tr><td style="padding:8px 0;color:#555"><strong>Email</strong></td><td><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding:8px 0;color:#555"><strong>Phone</strong></td><td>${phone}</td></tr>
          <tr><td style="padding:8px 0;color:#555"><strong>Service</strong></td><td>${service}</td></tr>
          <tr><td style="padding:8px 0;color:#555"><strong>Preferred Date</strong></td><td>${date}</td></tr>
          <tr><td style="padding:8px 0;color:#555"><strong>Preferred Time</strong></td><td>${time}</td></tr>
          <tr><td style="padding:8px 0;color:#555;vertical-align:top"><strong>Message</strong></td><td>${message || '—'}</td></tr>
        </table>
        <p style="margin-top:20px;font-size:12px;color:#999">Sent from PhysioLife Clinic booking form</p>
      </div>
    `,
  };

  // ── Auto-reply to patient ─────────────────────────────────────────────────
  const patientMail = {
    from:    `"PhysioLife Clinic" <${EMAIL_USER}>`,
    to:      email,
    subject: 'We received your booking request — PhysioLife Clinic',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;padding:24px;background:#f9f9f9;border-radius:8px">
        <h2 style="color:#0F6E56;margin-top:0">Booking Request Received</h2>
        <p>Hi ${name},</p>
        <p>Thank you for reaching out to PhysioLife Clinic. We've received your appointment request and will confirm your session within 24 hours by phone or email.</p>
        <div style="background:#E1F5EE;border-left:4px solid #0F6E56;padding:12px 16px;border-radius:4px;margin:16px 0">
          <p style="margin:0;font-size:14px"><strong>Your request summary:</strong></p>
          <p style="margin:6px 0;font-size:14px">Service: <strong>${service}</strong></p>
          <p style="margin:6px 0;font-size:14px">Preferred date: <strong>${date}</strong></p>
          <p style="margin:6px 0;font-size:14px">Preferred time: <strong>${time}</strong></p>
        </div>
        <p>If you have any urgent questions, please call us or message us on WhatsApp.</p>
        <p>Warm regards,<br><strong>PhysioLife Clinic</strong></p>
      </div>
    `,
  };

  try {
    // Send both emails in parallel
    await Promise.all([
      transporter.sendMail(clinicMail),
      transporter.sendMail(patientMail),
    ]);

    return res.status(200).json({ success: true, message: 'Emails sent successfully.' });
  } catch (error: any) {
    console.error('SendMail error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to send email. Check EMAIL_USER and EMAIL_PASS in Vercel env vars.',
      error: error.message,
    });
  }
}
