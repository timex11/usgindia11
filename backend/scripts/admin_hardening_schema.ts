import { Client } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL;

async function run() {
  if (!connectionString) {
    console.error('DATABASE_URL not found in environment');
    process.exit(1);
  }

  console.log('Connecting to database...');
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to database.');

    const sql = `
      -- Add is_banned to profiles
      ALTER TABLE public.profiles 
      ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT FALSE;

      -- Create system_settings table
      CREATE TABLE IF NOT EXISTS public.system_settings (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        key TEXT UNIQUE NOT NULL,
        value JSONB NOT NULL,
        description TEXT,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Add some initial AI settings if they don't exist
      INSERT INTO public.system_settings (key, value, description)
      VALUES 
        ('ai_model_toggles', '{"openai": true, "anthropic": true, "gemini": false}', 'Toggle different AI models')
      ON CONFLICT (key) DO NOTHING;

      INSERT INTO public.system_settings (key, value, description)
      VALUES 
        ('ai_rate_limits', '{"requests_per_minute": 60, "tokens_per_month": 1000000}', 'Rate limits for AI usage')
      ON CONFLICT (key) DO NOTHING;
    `;

    console.log('Executing updates...');
    await client.query(sql);
    console.log('Updates executed successfully!');
    
  } catch (err) {
    console.error('Error executing script:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
