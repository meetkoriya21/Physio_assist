import nodemailer from 'nodemailer';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const EMAIL_USER = process.env.EMAIL_USER;
  const EMAIL_PASS = process.env.EMAIL_PASS;

  if (!EMAIL_USER || !EMAIL_PASS) {
    console.error('Missing EMAIL_USER or EMAIL_PASS');
    return res.status(500).json({
      success: false,
      message: 'Email service not configured.',
    });
  }

  const { name, email, phone, service, date, time, message, action } = req.body;

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

  const acceptedMail = {
    from:    `"PhysioLife Clinic" <${EMAIL_USER}>`,
    to:      email,
    subject: '✅ Your appointment is confirmed — PhysioLife Clinic',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;padding:24px;background:#f9f9f9;border-radius:8px">
        <h2 style="color:#0F6E56;margin-top:0">Appointment Confirmed! ✅</h2>
        <p>Hi ${name},</p>
        <p>Great news! Your appointment has been <strong style="color:#0F6E56">confirmed</strong>. We look forward to seeing you.</p>
        <div style="background:#E1F5EE;border-left:4px solid #0F6E56;padding:12px 16px;border-radius:4px;margin:16px 0">
          <p style="margin:0 0 8px;font-size:14px"><strong>Appointment Details:</strong></p>
          <p style="margin:4px 0;font-size:14px">📋 Service: <strong>${service}</strong></p>
          <p style="margin:4px 0;font-size:14px">📅 Date: <strong>${date}</strong></p>
          <p style="margin:4px 0;font-size:14px">🕐 Time: <strong>${time}</strong></p>
          ${phone ? `<p style="margin:4px 0;font-size:14px">📞 Phone: <strong>${phone}</strong></p>` : ''}
        </div>
        <p>Please arrive <strong>5–10 minutes early</strong>. If you need to reschedule, please contact us as soon as possible.</p>
        <p>Warm regards,<br><strong>PhysioLife Clinic</strong></p>
        <p style="font-size:12px;color:#999;margin-top:20px">PhysioLife Clinic — Expert Physiotherapy Care</p>
      </div>
    `,
  };

  const rejectedMail = {
    from:    `"PhysioLife Clinic" <${EMAIL_USER}>`,
    to:      email,
    subject: 'Update on your appointment request — PhysioLife Clinic',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;padding:24px;background:#f9f9f9;border-radius:8px">
        <h2 style="color:#B91C1C;margin-top:0">Appointment Update</h2>
        <p>Hi ${name},</p>
        <p>Unfortunately we are unable to accommodate your appointment for the requested slot:</p>
        <div style="background:#FEF2F2;border-left:4px solid #B91C1C;padding:12px 16px;border-radius:4px;margin:16px 0">
          <p style="margin:0 0 8px;font-size:14px"><strong>Requested Slot:</strong></p>
          <p style="margin:4px 0;font-size:14px">📋 Service: <strong>${service}</strong></p>
          <p style="margin:4px 0;font-size:14px">📅 Date: <strong>${date}</strong></p>
          <p style="margin:4px 0;font-size:14px">🕐 Time: <strong>${time}</strong></p>
        </div>
        <p>We apologise for the inconvenience. Please <a href="https://physio-wellness-portal-main.vercel.app/appointment" style="color:#0F6E56;font-weight:bold">book a new appointment</a> with a different date or time.</p>
        <p>Warm regards,<br><strong>PhysioLife Clinic</strong></p>
        <p style="font-size:12px;color:#999;margin-top:20px">PhysioLife Clinic — Expert Physiotherapy Care</p>
      </div>
    `,
  };

  try {
    const mailToSend = action === 'accepted' ? acceptedMail : rejectedMail;
    await transporter.sendMail(mailToSend);
    return res.status(200).json({ success: true, message: `Email sent to ${email}` });
  } catch (error: any) {
    console.error('SendMail error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to send email.',
      error: error.message,
    });
  }
}