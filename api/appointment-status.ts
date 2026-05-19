import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const EMAIL_USER = process.env.EMAIL_USER;
  const EMAIL_PASS = process.env.EMAIL_PASS;
  const SITE_URL   = process.env.VITE_SITE_URL || 'https://physio-wellness-portal-main.vercel.app';

  if (!EMAIL_USER || !EMAIL_PASS) {
    return res.status(500).json({ success: false, message: 'Email not configured.' });
  }

  const { name, email, phone, service, date, time, message, action, appointmentId } = req.body;

  if (!name || !email || !service || !date || !time || !action) {
    return res.status(400).json({ success: false, message: 'Missing fields.' });
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', port: 465, secure: true,
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
  });

  // ── Accepted: generate review token + send email ──────────────────────────
  if (action === 'accepted') {
    // Generate unique one-time token
    const token = crypto.randomBytes(32).toString('hex');

    // Save token to reviews table
    await supabase.from('reviews').insert({
      name, token, appointment_id: appointmentId || null,
      rating: 0, text: '', status: 'pending', token_used: false,
    });

    const reviewLink = `${SITE_URL}/review?token=${token}`;

    await transporter.sendMail({
      from: `"PhysioLife Clinic" <${EMAIL_USER}>`,
      to: email,
      subject: '✅ Appointment Confirmed — PhysioLife Clinic',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;padding:24px;background:#f9f9f9;border-radius:8px">
          <h2 style="color:#0F6E56;margin-top:0">Appointment Confirmed! ✅</h2>
          <p>Hi ${name},</p>
          <p>Your appointment has been <strong style="color:#0F6E56">confirmed</strong>. We look forward to seeing you!</p>
          <div style="background:#E1F5EE;border-left:4px solid #0F6E56;padding:12px 16px;border-radius:4px;margin:16px 0">
            <p style="margin:0 0 8px;font-size:14px"><strong>Appointment Details:</strong></p>
            <p style="margin:4px 0;font-size:14px">📋 Service: <strong>${service}</strong></p>
            <p style="margin:4px 0;font-size:14px">📅 Date: <strong>${date}</strong></p>
            <p style="margin:4px 0;font-size:14px">🕐 Time: <strong>${time}</strong></p>
          </div>
          <p>Please arrive <strong>5–10 minutes early</strong>.</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0"/>
          <h3 style="color:#0F6E56">After your visit — share your experience ⭐</h3>
          <p style="font-size:14px">Once you've had your session, we'd love to hear your feedback. Use your personal review link below:</p>
          <a href="${reviewLink}" style="display:inline-block;margin:12px 0;padding:12px 24px;background:#1D9E75;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;font-size:14px">Leave a Review →</a>
          <p style="font-size:12px;color:#9CA3AF">This link is personal to you and can only be used once.</p>
          <p>Warm regards,<br><strong>PhysioLife Clinic</strong></p>
        </div>
      `,
    });

    return res.status(200).json({ success: true, message: 'Accepted email + review link sent.' });
  }

  // ── Rejected: send apology email ──────────────────────────────────────────
  if (action === 'rejected') {
    await transporter.sendMail({
      from: `"PhysioLife Clinic" <${EMAIL_USER}>`,
      to: email,
      subject: 'Update on your appointment — PhysioLife Clinic',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;padding:24px;background:#f9f9f9;border-radius:8px">
          <h2 style="color:#B91C1C;margin-top:0">Appointment Update</h2>
          <p>Hi ${name},</p>
          <p>Unfortunately we are unable to accommodate your request for:</p>
          <div style="background:#FEF2F2;border-left:4px solid #B91C1C;padding:12px 16px;border-radius:4px;margin:16px 0">
            <p style="margin:4px 0;font-size:14px">📋 Service: <strong>${service}</strong></p>
            <p style="margin:4px 0;font-size:14px">📅 Date: <strong>${date}</strong></p>
            <p style="margin:4px 0;font-size:14px">🕐 Time: <strong>${time}</strong></p>
          </div>
          <p>Please <a href="https://physio-wellness-portal-main.vercel.app/appointment" style="color:#0F6E56;font-weight:bold">book a new slot</a> and we'll do our best to accommodate you.</p>
          <p>Warm regards,<br><strong>PhysioLife Clinic</strong></p>
        </div>
      `,
    });

    return res.status(200).json({ success: true, message: 'Rejection email sent.' });
  }

  return res.status(400).json({ success: false, message: 'Invalid action.' });
}
