import nodemailer from 'nodemailer';

// ── Handler ───────────────────────────────────────────────────────────────────
// Called from admin when accepting or rejecting an appointment
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const EMAIL_USER = process.env.EMAIL_USER;
  const EMAIL_PASS = process.env.EMAIL_PASS;

  if (!EMAIL_USER || !EMAIL_PASS) {
    return res.status(500).json({
      success: false,
      message: 'Email service not configured.',
    });
  }

  const { name, email, phone, service, date, time, message, action } = req.body;
  // action = "accepted" | "rejected"

  if (!name || !email || !service || !date || !time || !action) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  const transporter = nodemailer.createTransport({
    host:   'smtp.gmail.com',
    port:   465,
    secure: true,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  // ── Accepted email ────────────────────────────────────────────────────────
  const acceptedMail = {
    from:    `"PhysioLife Clinic" <${EMAIL_USER}>`,
    to:      email,
    subject: '✅ Your appointment is confirmed — PhysioLife Clinic',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;padding:24px;background:#f9f9f9;border-radius:8px">
        <h2 style="color:#0F6E56;margin-top:0">Appointment Confirmed! ✅</h2>
        <p>Hi ${name},</p>
        <p>Great news! Your appointment request has been <strong style="color:#0F6E56">accepted</strong>. We look forward to seeing you.</p>
        <div style="background:#E1F5EE;border-left:4px solid #0F6E56;padding:12px 16px;border-radius:4px;margin:16px 0">
          <p style="margin:0;font-size:14px"><strong>Your appointment details:</strong></p>
          <p style="margin:6px 0;font-size:14px">Service: <strong>${service}</strong></p>
          <p style="margin:6px 0;font-size:14px">Date: <strong>${date}</strong></p>
          <p style="margin:6px 0;font-size:14px">Time: <strong>${time}</strong></p>
          ${phone ? `<p style="margin:6px 0;font-size:14px">Phone: <strong>${phone}</strong></p>` : ''}
        </div>
        <p>Please arrive <strong>5–10 minutes early</strong> for your session. If you need to reschedule or cancel, please contact us as soon as possible.</p>
        <p>If you have any questions, reply to this email or call us directly.</p>
        <p>Warm regards,<br><strong>PhysioLife Clinic</strong></p>
        <p style="font-size:12px;color:#999;margin-top:20px">PhysioLife Clinic — Expert Physiotherapy Care</p>
      </div>
    `,
  };

  // ── Rejected email ────────────────────────────────────────────────────────
  const rejectedMail = {
    from:    `"PhysioLife Clinic" <${EMAIL_USER}>`,
    to:      email,
    subject: 'Update on your appointment request — PhysioLife Clinic',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;padding:24px;background:#f9f9f9;border-radius:8px">
        <h2 style="color:#B91C1C;margin-top:0">Appointment Update</h2>
        <p>Hi ${name},</p>
        <p>Thank you for reaching out to PhysioLife Clinic. Unfortunately, we are unable to accommodate your appointment request for the following slot:</p>
        <div style="background:#FEF2F2;border-left:4px solid #B91C1C;padding:12px 16px;border-radius:4px;margin:16px 0">
          <p style="margin:0;font-size:14px"><strong>Requested slot:</strong></p>
          <p style="margin:6px 0;font-size:14px">Service: <strong>${service}</strong></p>
          <p style="margin:6px 0;font-size:14px">Date: <strong>${date}</strong></p>
          <p style="margin:6px 0;font-size:14px">Time: <strong>${time}</strong></p>
        </div>
        <p>We apologise for the inconvenience. Please <a href="${process.env.VITE_SITE_URL || 'https://physio-wellness-portal-main.vercel.app'}/appointment" style="color:#0F6E56">book a new appointment</a> with a different date or time, and we'll do our best to accommodate you.</p>
        <p>If you have any questions, please don't hesitate to contact us.</p>
        <p>Warm regards,<br><strong>PhysioLife Clinic</strong></p>
        <p style="font-size:12px;color:#999;margin-top:20px">PhysioLife Clinic — Expert Physiotherapy Care</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(action === 'accepted' ? acceptedMail : rejectedMail);
    return res.status(200).json({ success: true, message: `${action} email sent to ${email}` });
  } catch (error: any) {
    console.error('SendMail error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to send email.',
      error: error.message,
    });
  }
}
