-- Create enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_type TEXT NOT NULL CHECK (course_type IN ('regular', 'intensivo')),
  unit TEXT NOT NULL,
  main_class TEXT,
  enrollment_type TEXT NOT NULL CHECK (enrollment_type IN ('individual', 'dupla')),
  is_university_student BOOLEAN NOT NULL DEFAULT false,
  wants_second_class BOOLEAN NOT NULL DEFAULT false,
  second_class TEXT,
  student_name TEXT,
  pair_name TEXT,
  phone TEXT,
  total_value DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow anonymous inserts (since it's a public form)
CREATE POLICY "Allow public inserts on enrollments"
  ON enrollments FOR INSERT
  TO public
  WITH CHECK (true);

-- Only authenticated users (admins) can view/update/delete
CREATE POLICY "Allow authenticated read access on enrollments"
  ON enrollments FOR SELECT
  TO authenticated
  USING (true);
