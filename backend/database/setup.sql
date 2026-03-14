-- Create custom types
CREATE TYPE public.user_role AS ENUM ('admin', 'teacher', 'student', 'college');
CREATE TYPE public.membership_status AS ENUM ('pending', 'active', 'expired');
CREATE TYPE public.resource_type AS ENUM ('notes', 'guess_paper', 'syllabus');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role public.user_role DEFAULT 'student'::public.user_role,
  aadhaar_number TEXT,
  aadhaar_url TEXT,
  university_id UUID,
  college_id UUID,
  membership_status public.membership_status DEFAULT 'pending',
  student_id_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile."
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Colleges can verify their own students."
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'college' AND p.college_id = profiles.college_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'college' AND p.college_id = profiles.college_id
    )
  );

-- Create exams table (inferred from sidebar)
CREATE TABLE public.exams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER DEFAULT 60,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create exam_questions table
CREATE TABLE public.exam_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL, -- Array of options
  correct_option_index INTEGER NOT NULL,
  points INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create exam_attempts table
CREATE TABLE public.exam_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  score INTEGER DEFAULT 0,
  status TEXT DEFAULT 'in_progress', -- in_progress, completed, expired
  answers JSONB, -- Map of question_id to selected_option_index
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create proctoring_logs table
CREATE TABLE public.proctoring_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  attempt_id UUID REFERENCES public.exam_attempts(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- tab_switch, mouse_leave, etc.
  event_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for exams and related tables
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proctoring_logs ENABLE ROW LEVEL SECURITY;

-- Policies for exams
CREATE POLICY "Exams are viewable by authenticated users."
  ON public.exams FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policies for exam_questions
CREATE POLICY "Exam questions are viewable by authenticated users."
  ON public.exam_questions FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policies for exam_attempts
CREATE POLICY "Users can manage their own exam attempts."
  ON public.exam_attempts FOR ALL
  USING (auth.uid() = user_id);

-- Policies for proctoring_logs
CREATE POLICY "Users can log their own proctoring events."
  ON public.proctoring_logs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.exam_attempts
      WHERE id = attempt_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all proctoring logs."
  ON public.proctoring_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Teachers and Admins can create exams."
  ON public.exams FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('teacher', 'admin')
    )
  );

CREATE POLICY "Teachers and Admins can update exams."
  ON public.exams FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('teacher', 'admin')
    )
  );

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to sync role to auth.users metadata
-- This is required for your NestJS RolesGuard to work without querying the DB
CREATE OR REPLACE FUNCTION public.sync_role_to_metadata()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE auth.users
  SET raw_app_meta_data = 
    COALESCE(raw_app_meta_data, '{}'::jsonb) || 
    jsonb_build_object('role', new.role)
  WHERE id = new.id;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for role sync
CREATE TRIGGER on_profile_role_updated
  AFTER UPDATE OF role ON public.profiles
  FOR EACH ROW
  WHEN (old.role IS DISTINCT FROM new.role)
  EXECUTE PROCEDURE public.sync_role_to_metadata();

-- Trigger for role sync on insert
CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE PROCEDURE public.sync_role_to_metadata();

-- Storage Setup (if using Supabase Storage)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Avatar images are publicly accessible."
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'avatars' );

CREATE POLICY "Anyone can upload an avatar."
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'avatars' );

-- Create scholarships table
CREATE TABLE IF NOT EXISTS public.scholarships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  amount TEXT,
  deadline DATE,
  eligibility TEXT,
  category TEXT, -- State, Central, Private, etc.
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.scholarships ENABLE ROW LEVEL SECURITY;

-- Policy for reading scholarships
CREATE POLICY "Scholarships are viewable by everyone."
  ON public.scholarships FOR SELECT
  USING (true);

-- Policy for admins to manage scholarships
CREATE POLICY "Admins can manage scholarships."
  ON public.scholarships FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Insert some sample data
INSERT INTO public.scholarships (title, description, amount, deadline, eligibility, category, link)
VALUES
('National Scholarship Portal (NSP)', 'Central Sector Scheme of Scholarship for College and University Students.', '₹10,000 - ₹20,000 per annum', '2026-12-31', 'Students who are above 80th percentile of successful candidates in the relevant stream.', 'Government', 'https://scholarships.gov.in/'),
('PMSS Scholarship', 'Prime Minister''s Scholarship Scheme for Central Armed Police Forces & Assam Rifles.', '₹2,500 - ₹3,000 per month', '2026-11-30', 'Wards/Widows of deceased CAPFs & AR personnel.', 'Government', 'https://scholarships.gov.in/'),
('Reliance Foundation Scholarship', 'Supporting meritorious students from all over India for undergraduate studies.', 'Up to ₹2,00,000', '2026-10-15', 'First-year UG students with annual household income < ₹15 Lakhs.', 'Private', 'https://www.reliancefoundation.org/'),
('Tata Trust Scholarship', 'Scholarship for Medical and Healthcare students in India.', 'Variable', '2026-09-30', 'Students pursuing MBBS, BDS, or other healthcare degrees.', 'Merit Based', 'https://www.tatatrusts.org/'),
('IIT Bombay Heritage Foundation Scholarship', 'Support for deserving students at Indian Institute of Technology Bombay.', 'Full Tuition Waiver', '2026-08-15', 'Current undergraduate students at IIT Bombay based on merit-cum-means.', 'Institutional', 'https://www.iitbhf.org/');

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
  type public.resource_type NOT NULL,
  university_id UUID REFERENCES public.universities(id) ON DELETE SET NULL,
  subject TEXT,
  file_url TEXT NOT NULL,
  uploader_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Universities are viewable by everyone." ON public.universities FOR SELECT USING (true);
CREATE POLICY "Colleges are viewable by everyone." ON public.colleges FOR SELECT USING (true);
CREATE POLICY "Resources are viewable by everyone." ON public.resources FOR SELECT USING (true);
CREATE POLICY "Authenticated users can upload resources." ON public.resources FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update their own resources." ON public.resources FOR UPDATE USING (auth.uid() = uploader_id);

-- Sample Data for Institutional Mapping
INSERT INTO public.universities (name, location) VALUES
('University of Delhi', 'New Delhi'),
('Jawaharlal Nehru University', 'New Delhi'),
('Mumbai University', 'Mumbai');

-- Insert colleges for DU
DO $$
DECLARE
    du_id UUID;
BEGIN
    SELECT id INTO du_id FROM public.universities WHERE name = 'University of Delhi';
    INSERT INTO public.colleges (university_id, name, location) VALUES
    (du_id, 'St. Stephen''s College', 'New Delhi'),
    (du_id, 'Hindu College', 'New Delhi'),
    (du_id, 'Miranda House', 'New Delhi');
END $$;

-- CMS Site Blocks
CREATE TABLE IF NOT EXISTS public.site_blocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL, -- hero, stats_counter, news_feed, etc.
  content JSONB NOT NULL,
  page_path TEXT NOT NULL DEFAULT '/',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.site_blocks ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Site blocks are viewable by everyone." ON public.site_blocks FOR SELECT USING (true);
CREATE POLICY "Admins can manage site blocks." ON public.site_blocks FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
