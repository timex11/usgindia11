import { Client } from 'pg';
import * as fs from 'fs';

const connectionString = 'postgres://postgres:MeeeNU@32#m@db.hibxtbfipvyhfhypgtfh.supabase.co:5432/postgres';

async function test() {
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('Connected successfully!');
        fs.writeFileSync('db_result.txt', 'Success');
    } catch (err: any) {
        console.error('Connection failed:', err);
        fs.writeFileSync('db_result.txt', 'Error: ' + err.message);
    } finally {
        await client.end();
    }
}

test();
