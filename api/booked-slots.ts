import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY!
);

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ error: 'Date is required' });
  }

  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('time')
      .eq('date', date)
      .neq('status', 'rejected'); // rejected slots are free again

    if (error) throw error;

    const bookedSlots = (data || []).map((row: any) => row.time);
    return res.status(200).json({ bookedSlots });
  } catch (error: any) {
    console.error('Slots error:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
