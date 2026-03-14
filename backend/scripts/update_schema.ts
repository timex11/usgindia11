import { Client } from 'pg';

// Supabase Project Configuration
const PROJECT_REF = 'hibxtbfipvyhfhypgtfh';
const DB_PASSWORD = 'MeeeNU@32#m';

const connectionString = `postgres://postgres:${DB_PASSWORD}@db.${PROJECT_REF}.supabase.co:5432/postgres`;

async function run() {
  console.log('Connecting to Supabase...');
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to database.');

    const sql = `
      -- Enums
      DO $$
      BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'membership_status') THEN
              CREATE TYPE public.membership_status AS ENUM ('pending', 'active', 'expired');
          END IF;
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'resource_type') THEN
              CREATE TYPE public.resource_type AS ENUM ('notes', 'guess_paper', 'syllabus');
          END IF;
      END $$;

      -- Update profiles
      ALTER TABLE public.profiles
      ADD COLUMN IF NOT EXISTS full_name TEXT,
      ADD COLUMN IF NOT EXISTS avatar_url TEXT,
      ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student',
      ADD COLUMN IF NOT EXISTS aadhaar_number TEXT,
      ADD COLUMN IF NOT EXISTS university_id UUID,
      ADD COLUMN IF NOT EXISTS college_id UUID,
      ADD COLUMN IF NOT EXISTS membership_status public.membership_status DEFAULT 'pending',
      ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT FALSE;

      -- Institutional Mapping
      CREATE TABLE IF NOT EXISTS public.universities (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name TEXT NOT NULL,
        location TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS public.colleges (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        university_id UUID REFERENCES public.universities(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        location TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Resource Library
      CREATE TABLE IF NOT EXISTS public.resources (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        title TEXT NOT NULL,
        type TEXT NOT NULL,
        university_id UUID REFERENCES public.universities(id) ON DELETE SET NULL,
        subject TEXT,
        file_url TEXT NOT NULL,
        uploader_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Opportunities
      CREATE TABLE IF NOT EXISTS public.scholarships (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        amount TEXT,
        deadline TIMESTAMPTZ,
        eligibility TEXT,
        category TEXT,
        link TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS public.scholarship_applications (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        scholarship_id UUID REFERENCES public.scholarships(id) ON DELETE CASCADE,
        user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
        status TEXT DEFAULT 'pending',
        applied_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(scholarship_id, user_id)
      );

      CREATE TABLE IF NOT EXISTS public.jobs (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        title TEXT NOT NULL,
        company TEXT NOT NULL,
        location TEXT,
        type TEXT DEFAULT 'full_time',
        description TEXT,
        salary_range TEXT,
        link TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- System & CMS
      CREATE TABLE IF NOT EXISTS public.otp_verifications (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        email TEXT,
        phone TEXT,
        code TEXT NOT NULL,
        type TEXT NOT NULL,
        expires_at TIMESTAMPTZ NOT NULL,
        verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS public.team_members (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        avatar_url TEXT,
        bio TEXT,
        linkedin TEXT,
        twitter TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS public.contact_submissions (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        status TEXT DEFAULT 'new',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Exams
      CREATE TABLE IF NOT EXISTS public.exams (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        duration_minutes INTEGER DEFAULT 60,
        total_marks INTEGER,
        passing_marks INTEGER,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS public.exam_questions (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE,
        text TEXT NOT NULL,
        type TEXT DEFAULT 'multiple_choice',
        points INTEGER DEFAULT 1,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Enable RLS
      ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

      -- Policies (using DO block to avoid errors if policies already exist)
      DO $$
      BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Universities are viewable by everyone.') THEN
              CREATE POLICY "Universities are viewable by everyone." ON public.universities FOR SELECT USING (true);
          END IF;
          IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Colleges are viewable by everyone.') THEN
              CREATE POLICY "Colleges are viewable by everyone." ON public.colleges FOR SELECT USING (true);
          END IF;
          IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Resources are viewable by everyone.') THEN
              CREATE POLICY "Resources are viewable by everyone." ON public.resources FOR SELECT USING (true);
          END IF;
          IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can upload resources.') THEN
              CREATE POLICY "Authenticated users can upload resources." ON public.resources FOR INSERT WITH CHECK (auth.role() = 'authenticated');
          END IF;
          IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own resources.') THEN
              CREATE POLICY "Users can update their own resources." ON public.resources FOR UPDATE USING (auth.uid() = uploader_id);
          END IF;
      END $$;

      -- Sample Data
      INSERT INTO public.universities (name, location) 
      SELECT 'University of Delhi', 'New Delhi'
      WHERE NOT EXISTS (SELECT 1 FROM public.universities WHERE name = 'University of Delhi');

      INSERT INTO public.universities (name, location) 
      SELECT 'Jawaharlal Nehru University', 'New Delhi'
      WHERE NOT EXISTS (SELECT 1 FROM public.universities WHERE name = 'Jawaharlal Nehru University');

      INSERT INTO public.universities (name, location) 
      SELECT 'Mumbai University', 'Mumbai'
      WHERE NOT EXISTS (SELECT 1 FROM public.universities WHERE name = 'Mumbai University');

      DO $$
      DECLARE
          du_id UUID;
      BEGIN
          SELECT id INTO du_id FROM public.universities WHERE name = 'University of Delhi';
          IF du_id IS NOT NULL THEN
              INSERT INTO public.colleges (university_id, name, location)
              SELECT du_id, 'St. Stephen''s College', 'New Delhi'
              WHERE NOT EXISTS (SELECT 1 FROM public.colleges WHERE name = 'St. Stephen''s College');

              INSERT INTO public.colleges (university_id, name, location)
              SELECT du_id, 'Hindu College', 'New Delhi'
              WHERE NOT EXISTS (SELECT 1 FROM public.colleges WHERE name = 'Hindu College');

              INSERT INTO public.colleges (university_id, name, location)
              SELECT du_id, 'Miranda House', 'New Delhi'
              WHERE NOT EXISTS (SELECT 1 FROM public.colleges WHERE name = 'Miranda House');
          END IF;
      END $$;
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
