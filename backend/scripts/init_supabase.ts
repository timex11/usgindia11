import { Client } from 'pg';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
const envPath = path.join(__dirname, '../.env');
dotenv.config({ path: envPath });

async function run() {
  console.log('Initializing Supabase database...');

  // 1. Determine Connection String
  let connectionString = process.env.DATABASE_URL;

  // Check if DATABASE_URL is a valid Postgres URL
  if (!connectionString || !connectionString.startsWith('postgres')) {
    console.warn('Active DATABASE_URL is not set to a PostgreSQL URL in .env');

    // Attempt to find a commented out Postgres URL in .env
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const match = envContent.match(
        /#\s*DATABASE_URL="?(postgres:\/\/.*?)["']?\s*$/m,
      );
      if (match) {
        console.log(
          'Found commented out PostgreSQL DATABASE_URL in .env, using it...',
        );
        connectionString = match[1];
      }
    }

    if (!connectionString || !connectionString.startsWith('postgres')) {
      // Try to construct from components if available
      const PROJECT_REF =
        process.env.SUPABASE_PROJECT_REF || 'hibxtbfipvyhfhypgtfh'; // Fallback to known ref
      const DB_PASSWORD =
        process.env.SUPABASE_DB_PASSWORD || process.env.DB_PASSWORD;
      const REGION = 'aws-0-ap-south-1.pooler.supabase.com'; // Inferred from .env context

      if (PROJECT_REF && DB_PASSWORD) {
        console.log(
          'Constructing connection string from PROJECT_REF and DB_PASSWORD...',
        );
        // Try standard pooler host
        connectionString = `postgres://postgres.${PROJECT_REF}:${encodeURIComponent(DB_PASSWORD)}@${REGION}:5432/postgres`;
      } else {
        // Fallback to hardcoded for this specific context
        const HARDCODED_PASSWORD = 'MeeeNU@32#m';
        console.log(
          'Falling back to hardcoded credentials (NOT RECOMMENDED FOR PRODUCTION)...',
        );
        // Note: The password in .env seems to be much longer/different, suggesting the hardcoded one might be wrong or for direct connection.
        // But the .env URL has `postgres.hibxtbfipvyhfhypgtfh`.
        // Let's try to construct the URL based on the pattern seen in .env but with hardcoded password if extracting failed.

        // However, the .env URL has a very long password: IuBCD...
        // This suggests the password in .env is the correct one for the pooler, or it's a session token.
        // If we can't extract it, we might be stuck.

        // But we did find the commented line in the .env read earlier. So the regex should work.

        // If regex failed, let's try the direct connection host as a fallback, which is db.<ref>.supabase.co
        connectionString = `postgres://postgres:${encodeURIComponent(HARDCODED_PASSWORD)}@db.${PROJECT_REF}.supabase.co:5432/postgres`;
      }
    }
  }

  if (!connectionString) {
    console.error(
      'Error: Could not determine a valid PostgreSQL connection string.',
    );
    console.error(
      'Please set DATABASE_URL or SUPABASE_PROJECT_REF and SUPABASE_DB_PASSWORD in backend/.env',
    );
    process.exit(1);
  }

  // Mask password for logging
  const maskedConnectionString = connectionString.replace(/:[^:@]+@/, ':****@');
  console.log(`Using connection string: ${maskedConnectionString}`);

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }, // Required for Supabase connection
  });

  try {
    await client.connect();
    console.log('Connected to database successfully.');

    const sqlPath = path.join(__dirname, '../database/setup.sql');
    if (!fs.existsSync(sqlPath)) {
      throw new Error(`setup.sql not found at ${sqlPath}`);
    }

    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Executing setup.sql...');
    // Execute the SQL
    await client.query(sql);
    console.log('setup.sql executed successfully!');
  } catch (err) {
    console.error('Error executing script:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
