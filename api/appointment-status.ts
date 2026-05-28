import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Use service role key for server-side writes — bypasses RLS
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY!
);

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const EMAIL_USER = process.env.EMAIL_USER;
  const EMAIL_PASS = process.env.EMAIL_PASS;
  const SITE_URL   = 'https://physio-wellness-portal-main.vercel.app';

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

  // ── ACCEPTED ──────────────────────────────────────────────────────────────
  if (action === 'accepted') {
    // 1. Generate unique token
    const token = crypto.randomBytes(32).toString('hex');

    // 2. Save token to Supabase reviews table
    const { error: insertError } = await supabase.from('reviews').insert({
      name:           name,
      token:          token,
      appointment_id: appointmentId || null,
      rating:         5,
      text:           '',
      status:         'pending',
      token_used:     false,
    });

    if (insertError) {
      console.error('Failed to save review token:', insertError.message);
      // Still send email even if token save fails
    }

    const reviewLink = `${SITE_URL}/review?token=${token}`;

    // 3. Send confirmation + review link email
    try {
      await transporter.sendMail({
        from:    `"PhysioLife Clinic" <${EMAIL_USER}>`,
        to:      email,
        subject: '✅ Appointment Confirmed — PhysioLife Clinic',
        html: `
          <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#f9f9f9;border-radius:8px">
            <h2 style="color:#0F6E56;margin-top:0">Appointment Confirmed! ✅</h2>
            <p>Hi ${name},</p>
            <p>Your appointment has been <strong style="color:#0F6E56">confirmed</strong>. We look forward to seeing you!</p>
            <div style="background:#E1F5EE;border-left:4px solid #0F6E56;padding:12px 16px;border-radius:4px;margin:16px 0">
              <p style="margin:0 0 8px;font-size:14px"><strong>Appointment Details:</strong></p>
              <p style="margin:4px 0;font-size:14px">📋 Service: <strong>${service}</strong></p>
              <p style="margin:4px 0;font-size:14px">📅 Date: <strong>${date}</strong></p>
              <p style="margin:4px 0;font-size:14px">🕐 Time: <strong>${time}</strong></p>
              ${phone ? `<p style="margin:4px 0;font-size:14px">📞 Phone: <strong>${phone}</strong></p>` : ''}
            </div>
            <p style="font-size:14px">Please arrive <strong>5–10 minutes early</strong> for your session.</p>
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
            <h3 style="color:#0F6E56;margin-bottom:8px">After your visit — share your experience ⭐</h3>
            <p style="font-size:14px;color:#374151">Once you've had your session, we'd love to hear your feedback. Use your personal review link below:</p>
            <div style="text-align:center;margin:20px 0">
              <a href="${reviewLink}"
                style="display:inline-block;padding:14px 28px;background:#1D9E75;color:#fff;border-radius:50px;text-decoration:none;font-weight:bold;font-size:15px">
                ⭐ Leave a Review
              </a>
            </div>
            <p style="font-size:12px;color:#9CA3AF;text-align:center">This link is personal to you and can only be used once.</p>
            <p style="margin-top:24px">Warm regards,<br><strong>PhysioLife Clinic</strong></p>
            <p style="font-size:11px;color:#9CA3AF">PhysioLife Clinic — Expert Physiotherapy Care</p>
          </div>
        `,
      });
    } catch (emailErr: any) {
      console.error('Email send error:', emailErr.message);
      return res.status(500).json({ success: false, message: 'Email failed.', error: emailErr.message });
    }

    return res.status(200).json({ success: true, message: 'Confirmed email + review link sent.', token });
  }

  // ── REJECTED ──────────────────────────────────────────────────────────────
  if (action === 'rejected') {
    try {
      await transporter.sendMail({
        from:    `"PhysioLife Clinic" <${EMAIL_USER}>`,
        to:      email,
        subject: 'Update on your appointment — PhysioLife Clinic',
        html: `
          <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#f9f9f9;border-radius:8px">
            <h2 style="color:#B91C1C;margin-top:0">Appointment Update</h2>
            <p>Hi ${name},</p>
            <p>Unfortunately we are unable to accommodate your appointment request for:</p>
            <div style="background:#FEF2F2;border-left:4px solid #B91C1C;padding:12px 16px;border-radius:4px;margin:16px 0">
              <p style="margin:4px 0;font-size:14px">📋 Service: <strong>${service}</strong></p>
              <p style="margin:4px 0;font-size:14px">📅 Date: <strong>${date}</strong></p>
              <p style="margin:4px 0;font-size:14px">🕐 Time: <strong>${time}</strong></p>
            </div>
            <p style="font-size:14px">We apologise for the inconvenience. Please <a href="https://physio-wellness-portal-main.vercel.app/appointment" style="color:#0F6E56;font-weight:bold">book a new slot</a> and we'll do our best to help.</p>
            <p>Warm regards,<br><strong>PhysioLife Clinic</strong></p>
          </div>
        `,
      });
    } catch (emailErr: any) {
      console.error('Rejection email error:', emailErr.message);
      return res.status(500).json({ success: false, message: 'Email failed.' });
    }

    return res.status(200).json({ success: true, message: 'Rejection email sent.' });
  }

  return res.status(400).json({ success: false, message: 'Invalid action.' });
}
