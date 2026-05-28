import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { name, email, service, date, time } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 7500, // £75.00 in cents
      currency: 'gbp',
      metadata: { name, email, service, date, time },
      description: `PhysioLife Clinic — ${service} on ${date} at ${time}`,
      receipt_email: email,
    });

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error('Stripe error:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
