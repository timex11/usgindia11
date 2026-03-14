/**
 * Fix: Grant Supabase REST (PostgREST) access to public schema tables
 * This grants the 'anon' and 'authenticated' roles proper schema + table access.
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

(async () => {
  const { Client } = require('pg');
  const client = new Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();
    console.log('Connected to database. Applying permissions...\n');

    const grants = [
      // Grant schema USAGE to PostgREST roles
      `GRANT USAGE ON SCHEMA public TO anon;`,
      `GRANT USAGE ON SCHEMA public TO authenticated;`,
      `GRANT USAGE ON SCHEMA public TO service_role;`,

      // Grant SELECT on all existing tables to anon & authenticated
      `GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;`,
      `GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;`,
      `GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;`,

      // Grant SELECT on all existing sequences
      `GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;`,
      `GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;`,
      `GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;`,

      // Set default privileges for FUTURE tables
      `ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon;`,
      `ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;`,
      `ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO service_role;`,

      // Set default privileges for FUTURE sequences
      `ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE ON SEQUENCES TO anon;`,
      `ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO authenticated;`,
      `ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;`,
    ];

    for (const sql of grants) {
      try {
        await client.query(sql);
        console.log(`✅ ${sql}`);
      } catch (e) {
        console.log(`❌ ${sql}\n   Error: ${e.message}`);
      }
    }

    console.log('\n✅ All permissions applied successfully!');
    console.log('\nNow re-run the connection test to verify: node scripts/test_all_connections.js');

    await client.end();
  } catch (err) {
    console.error('Failed to connect:', err.message);
    process.exit(1);
  }
})();
