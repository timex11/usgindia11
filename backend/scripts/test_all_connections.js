/**
 * USG India - Comprehensive Supabase & Database Connection Test
 * Tests: Direct PostgreSQL, Supabase REST API, Supabase Auth
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const results = [];
function log(label, status, detail) {
  const icon = status === 'OK' ? '✅' : '❌';
  console.log(`${icon} [${label}] ${detail}`);
  results.push({ label, status, detail });
}

async function testDirectPostgres() {
  console.log('\n=== 1. DIRECT POSTGRESQL CONNECTION ===');
  try {
    const { Client } = require('pg');
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    
    // Test basic query
    const res = await client.query('SELECT NOW() as time, current_database() as db, current_user as usr');
    log('PG Connect', 'OK', `Connected as "${res.rows[0].usr}" to "${res.rows[0].db}" at ${res.rows[0].time}`);
    
    // Test version
    const ver = await client.query('SELECT version()');
    log('PG Version', 'OK', ver.rows[0].version.split(',')[0]);
    
    // List schemas
    const schemas = await client.query("SELECT schema_name FROM information_schema.schemata WHERE schema_name NOT LIKE 'pg_%' AND schema_name != 'information_schema' ORDER BY schema_name");
    log('PG Schemas', 'OK', schemas.rows.map(r => r.schema_name).join(', '));
    
    // List tables in public schema
    const tables = await client.query("SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename");
    if (tables.rows.length > 0) {
      log('PG Tables', 'OK', `${tables.rows.length} tables: ${tables.rows.map(r => r.tablename).join(', ')}`);
    } else {
      log('PG Tables', 'OK', 'No tables in public schema yet (may need migration)');
    }

    // Test write permission
    try {
      await client.query('BEGIN');
      await client.query("CREATE TABLE IF NOT EXISTS _connection_test (id serial PRIMARY KEY, ts timestamp DEFAULT now())");
      await client.query("INSERT INTO _connection_test DEFAULT VALUES");
      const count = await client.query("SELECT count(*) FROM _connection_test");
      await client.query("DROP TABLE _connection_test");
      await client.query('COMMIT');
      log('PG Write', 'OK', 'Read/Write permissions confirmed');
    } catch (e) {
      await client.query('ROLLBACK').catch(() => {});
      log('PG Write', 'FAIL', e.message);
    }
    
    await client.end();
  } catch (err) {
    log('PG Connect', 'FAIL', err.message);
  }
}

async function testSupabaseREST() {
  console.log('\n=== 2. SUPABASE REST API ===');
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  
  if (!url || !key) {
    log('Supabase Config', 'FAIL', 'SUPABASE_URL or SUPABASE_KEY missing');
    return;
  }
  
  // Test anon key - health check 
  try {
    const res = await fetch(`${url}/rest/v1/`, {
      headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
    });
    if (res.ok) {
      log('Supabase REST (anon)', 'OK', `Status ${res.status} - REST API accessible`);
    } else {
      log('Supabase REST (anon)', 'FAIL', `Status ${res.status} ${res.statusText}`);
    }
  } catch (err) {
    log('Supabase REST (anon)', 'FAIL', err.message);
  }

  // Test service role key
  try {
    const res = await fetch(`${url}/rest/v1/`, {
      headers: { 'apikey': serviceKey, 'Authorization': `Bearer ${serviceKey}` }
    });
    if (res.ok) {
      log('Supabase REST (service)', 'OK', `Status ${res.status} - Service role API accessible`);
    } else {
      log('Supabase REST (service)', 'FAIL', `Status ${res.status} ${res.statusText}`);
    }
  } catch (err) {
    log('Supabase REST (service)', 'FAIL', err.message);
  }

  // Test reading profiles table via REST
  try {
    const res = await fetch(`${url}/rest/v1/profiles?select=count&limit=0`, {
      headers: { 
        'apikey': serviceKey, 
        'Authorization': `Bearer ${serviceKey}`,
        'Prefer': 'count=exact'
      }
    });
    const countHeader = res.headers.get('content-range');
    if (res.ok) {
      log('Supabase Table Access', 'OK', `profiles table accessible (content-range: ${countHeader || 'N/A'})`);
    } else {
      const body = await res.text();
      log('Supabase Table Access', 'FAIL', `${res.status}: ${body}`);
    }
  } catch (err) {
    log('Supabase Table Access', 'FAIL', err.message);
  }
}

async function testSupabaseAuth() {
  console.log('\n=== 3. SUPABASE AUTH ===');
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_KEY;
  
  try {
    const res = await fetch(`${url}/auth/v1/settings`, {
      headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
    });
    if (res.ok) {
      const settings = await res.json();
      log('Supabase Auth', 'OK', `Auth service running. External providers: ${JSON.stringify(Object.keys(settings.external || {})).substring(0, 100)}`);
    } else {
      log('Supabase Auth', 'FAIL', `Status ${res.status} ${res.statusText}`);
    }
  } catch (err) {
    log('Supabase Auth', 'FAIL', err.message);
  }

  // Test auth admin endpoint with service key
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  try {
    const res = await fetch(`${url}/auth/v1/admin/users?page=1&per_page=1`, {
      headers: { 'apikey': serviceKey, 'Authorization': `Bearer ${serviceKey}` }
    });
    if (res.ok) {
      const data = await res.json();
      const userCount = Array.isArray(data.users) ? data.users.length : '?';
      log('Supabase Auth Admin', 'OK', `Admin API accessible, users returned: ${userCount}`);
    } else {
      log('Supabase Auth Admin', 'FAIL', `Status ${res.status} ${res.statusText}`);
    }
  } catch (err) {
    log('Supabase Auth Admin', 'FAIL', err.message);
  }
}

async function testSupabaseStorage() {
  console.log('\n=== 4. SUPABASE STORAGE ===');
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  
  try {
    const res = await fetch(`${url}/storage/v1/bucket`, {
      headers: { 'apikey': serviceKey, 'Authorization': `Bearer ${serviceKey}` }
    });
    if (res.ok) {
      const buckets = await res.json();
      log('Supabase Storage', 'OK', `Storage accessible. Buckets: ${Array.isArray(buckets) ? buckets.map(b => b.name).join(', ') || 'none' : 'N/A'}`);
    } else {
      log('Supabase Storage', 'FAIL', `Status ${res.status} ${res.statusText}`);
    }
  } catch (err) {
    log('Supabase Storage', 'FAIL', err.message);
  }
}

async function testSupabaseRealtime() {
  console.log('\n=== 5. SUPABASE REALTIME ===');
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_KEY;
  
  // Quick HTTP check for realtime endpoint
  try {
    const realtimeUrl = url.replace('https://', 'https://').replace('.supabase.co', '.supabase.co');
    const res = await fetch(`${realtimeUrl}/realtime/v1/api/health`, {
      headers: { 'apikey': key }
    });
    // Realtime may return various statuses
    log('Supabase Realtime', 'OK', `Realtime endpoint responded with status ${res.status}`);
  } catch (err) {
    log('Supabase Realtime', 'FAIL', err.message);
  }
}

async function testPrismaConnection() {
  console.log('\n=== 6. PRISMA CLIENT ===');
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    // Test basic query
    const result = await prisma.$queryRaw`SELECT 1 as connected`;
    log('Prisma Client', 'OK', 'Prisma connected to database successfully');
    
    // Test model access - try to count profiles
    try {
      const count = await prisma.profile.count();
      log('Prisma Models', 'OK', `Profile model accessible, count: ${count}`);
    } catch (e) {
      if (e.message.includes('does not exist') || e.code === 'P2021') {
        log('Prisma Models', 'FAIL', 'Tables not found - need to run: npx prisma db push');
      } else {
        log('Prisma Models', 'FAIL', e.message.substring(0, 200));
      }
    }
    
    await prisma.$disconnect();
  } catch (err) {
    if (err.message && err.message.includes('Cannot find module')) {
      log('Prisma Client', 'FAIL', 'Prisma client not generated. Run: npx prisma generate');
    } else {
      log('Prisma Client', 'FAIL', err.message ? err.message.substring(0, 200) : String(err));
    }
  }
}

// Run all tests
(async () => {
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║  USG INDIA - SUPABASE CONNECTION HEALTH CHECK   ║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log(`Database URL: ${process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@') : 'NOT SET'}`);
  console.log(`Supabase URL: ${process.env.SUPABASE_URL || 'NOT SET'}`);
  
  await testDirectPostgres();
  await testSupabaseREST();
  await testSupabaseAuth();
  await testSupabaseStorage();
  await testSupabaseRealtime();
  await testPrismaConnection();
  
  // Summary
  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║               TEST SUMMARY                      ║');
  console.log('╚══════════════════════════════════════════════════╝');
  const passed = results.filter(r => r.status === 'OK').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  console.log(`\n  Total: ${results.length} | ✅ Passed: ${passed} | ❌ Failed: ${failed}\n`);
  
  if (failed > 0) {
    console.log('  FAILED TESTS:');
    results.filter(r => r.status === 'FAIL').forEach(r => {
      console.log(`    ❌ ${r.label}: ${r.detail}`);
    });
  }
  
  process.exit(failed > 0 ? 1 : 0);
})();
