-- =========================================================
-- TechInnoSphere Software Solutions Pvt. Ltd.
-- Supabase PostgreSQL Schema & Security Policies (RLS)
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------------------------------------------------------
-- 1. Helper Function: Automatic updated_at trigger
-- ---------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------
-- 2. Table: admin_users (Admin authorization registry)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------
-- 3. Table: clients
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT NOT NULL,
    country TEXT,
    city TEXT,
    industry TEXT,
    logo TEXT,
    project_delivered TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    project_count INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------
-- 4. Table: config
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------
-- 5. Table: jobs
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_title TEXT NOT NULL,
    department TEXT,
    location TEXT,
    employment_type TEXT,
    experience_required TEXT,
    job_description TEXT,
    skills_required TEXT,
    google_form_url TEXT,
    status TEXT DEFAULT 'Open',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------
-- 6. Table: news
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.news (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    content TEXT,
    image TEXT,
    publish_date DATE,
    category TEXT,
    read_time TEXT,
    author TEXT,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------
-- 7. Table: projects
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT,
    description TEXT,
    short_description TEXT,
    full_case_study_description TEXT,
    client_name TEXT,
    role TEXT,
    location TEXT,
    image TEXT,
    website_url TEXT,
    technology_used TEXT,
    industry TEXT,
    completion_date DATE,
    challenges TEXT,
    solution_provided TEXT,
    business_outcome TEXT,
    testimonial TEXT,
    client_designation TEXT,
    client_rating INT,
    featured BOOLEAN DEFAULT false,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------
-- 8. Table: services
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_name TEXT NOT NULL,
    short_description TEXT,
    detailed_description TEXT,
    icon TEXT,
    banner_image TEXT,
    category TEXT,
    features_list TEXT,
    technologies_used TEXT,
    cta_text TEXT,
    cta_link TEXT,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------
-- 9. Table: testimonials
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT NOT NULL,
    designation TEXT,
    company TEXT,
    location TEXT,
    feedback TEXT,
    rating INT DEFAULT 5,
    client_photo TEXT,
    related_project TEXT,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------
-- Triggers for updated_at timestamps
-- ---------------------------------------------------------
DROP TRIGGER IF EXISTS set_clients_updated_at ON public.clients;
CREATE TRIGGER set_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_config_updated_at ON public.config;
CREATE TRIGGER set_config_updated_at BEFORE UPDATE ON public.config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_jobs_updated_at ON public.jobs;
CREATE TRIGGER set_jobs_updated_at BEFORE UPDATE ON public.jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_news_updated_at ON public.news;
CREATE TRIGGER set_news_updated_at BEFORE UPDATE ON public.news FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_projects_updated_at ON public.projects;
CREATE TRIGGER set_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_services_updated_at ON public.services;
CREATE TRIGGER set_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_testimonials_updated_at ON public.testimonials;
CREATE TRIGGER set_testimonials_updated_at BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ---------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);
CREATE INDEX IF NOT EXISTS idx_news_enabled ON public.news(enabled);
CREATE INDEX IF NOT EXISTS idx_projects_enabled_featured ON public.projects(enabled, featured);
CREATE INDEX IF NOT EXISTS idx_services_enabled ON public.services(enabled);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON public.testimonials(featured);
CREATE INDEX IF NOT EXISTS idx_config_key ON public.config(key);

-- ---------------------------------------------------------
-- Row Level Security (RLS) Policies
-- ---------------------------------------------------------
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current authenticated user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1) Admin Users Policies
DROP POLICY IF EXISTS "Admins can view admin_users" ON public.admin_users;
CREATE POLICY "Admins can view admin_users" ON public.admin_users FOR SELECT USING (id = auth.uid() OR is_admin());

-- 2) Clients Policies
DROP POLICY IF EXISTS "Public clients viewable" ON public.clients;
CREATE POLICY "Public clients viewable" ON public.clients FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage clients" ON public.clients;
CREATE POLICY "Admins manage clients" ON public.clients FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- 3) Config Policies
DROP POLICY IF EXISTS "Public config viewable" ON public.config;
CREATE POLICY "Public config viewable" ON public.config FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage config" ON public.config;
CREATE POLICY "Admins manage config" ON public.config FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- 4) Jobs Policies
DROP POLICY IF EXISTS "Public jobs viewable" ON public.jobs;
CREATE POLICY "Public jobs viewable" ON public.jobs FOR SELECT USING (status = 'Open' OR status = 'open' OR is_admin());

DROP POLICY IF EXISTS "Admins manage jobs" ON public.jobs;
CREATE POLICY "Admins manage jobs" ON public.jobs FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- 5) News Policies
DROP POLICY IF EXISTS "Public news viewable" ON public.news;
CREATE POLICY "Public news viewable" ON public.news FOR SELECT USING (enabled = true OR is_admin());

DROP POLICY IF EXISTS "Admins manage news" ON public.news;
CREATE POLICY "Admins manage news" ON public.news FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- 6) Projects Policies
DROP POLICY IF EXISTS "Public projects viewable" ON public.projects;
CREATE POLICY "Public projects viewable" ON public.projects FOR SELECT USING (enabled = true OR is_admin());

DROP POLICY IF EXISTS "Admins manage projects" ON public.projects;
CREATE POLICY "Admins manage projects" ON public.projects FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- 7) Services Policies
DROP POLICY IF EXISTS "Public services viewable" ON public.services;
CREATE POLICY "Public services viewable" ON public.services FOR SELECT USING (enabled = true OR is_admin());

DROP POLICY IF EXISTS "Admins manage services" ON public.services;
CREATE POLICY "Admins manage services" ON public.services FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- 8) Testimonials Policies
DROP POLICY IF EXISTS "Public testimonials viewable" ON public.testimonials;
CREATE POLICY "Public testimonials viewable" ON public.testimonials FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage testimonials" ON public.testimonials;
CREATE POLICY "Admins manage testimonials" ON public.testimonials FOR ALL USING (is_admin()) WITH CHECK (is_admin());
