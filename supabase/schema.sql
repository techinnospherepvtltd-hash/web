-- =========================================================
-- TechInnoSphere Software Solutions Pvt. Ltd.
-- Supabase PostgreSQL Production Schema & Security Policies (RLS)
-- Compatible with Excel -> Supabase Migration & Frontend CRUD
-- =========================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------
-- 1. Helper Function: Automatic updated_at trigger
-- ---------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
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
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------
-- 3. Table: clients
-- onConflict target: client_name (Requires UNIQUE constraint)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT UNIQUE NOT NULL,
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
-- onConflict target: key (Requires UNIQUE constraint)
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
-- onConflict target: job_title (Requires UNIQUE constraint)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_title TEXT UNIQUE NOT NULL,
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
-- onConflict target: title (Requires UNIQUE constraint)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.news (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT UNIQUE NOT NULL,
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
-- onConflict target: title (Requires UNIQUE constraint)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT UNIQUE NOT NULL,
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
    client_rating INT DEFAULT 5,
    featured BOOLEAN DEFAULT false,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------
-- 8. Table: services
-- onConflict target: service_name (Requires UNIQUE constraint)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_name TEXT UNIQUE NOT NULL,
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
-- onConflict target: company (Requires UNIQUE constraint)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT NOT NULL,
    designation TEXT,
    company TEXT UNIQUE NOT NULL,
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
-- 10. Idempotent UNIQUE Constraint Enforcement
-- (Ensures constraints exist even if tables were already created previously)
-- ---------------------------------------------------------
DO $$
BEGIN
    -- clients(client_name)
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'clients_client_name_key'
    ) THEN
        ALTER TABLE public.clients ADD CONSTRAINT clients_client_name_key UNIQUE (client_name);
    END IF;

    -- config(key)
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'config_key_key'
    ) THEN
        ALTER TABLE public.config ADD CONSTRAINT config_key_key UNIQUE (key);
    END IF;

    -- jobs(job_title)
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'jobs_job_title_key'
    ) THEN
        ALTER TABLE public.jobs ADD CONSTRAINT jobs_job_title_key UNIQUE (job_title);
    END IF;

    -- news(title)
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'news_title_key'
    ) THEN
        ALTER TABLE public.news ADD CONSTRAINT news_title_key UNIQUE (title);
    END IF;

    -- projects(title)
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'projects_title_key'
    ) THEN
        ALTER TABLE public.projects ADD CONSTRAINT projects_title_key UNIQUE (title);
    END IF;

    -- services(service_name)
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'services_service_name_key'
    ) THEN
        ALTER TABLE public.services ADD CONSTRAINT services_service_name_key UNIQUE (service_name);
    END IF;

    -- testimonials(company)
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'testimonials_company_key'
    ) THEN
        ALTER TABLE public.testimonials ADD CONSTRAINT testimonials_company_key UNIQUE (company);
    END IF;
END $$;

-- ---------------------------------------------------------
-- 11. Triggers for updated_at timestamps
-- ---------------------------------------------------------
DROP TRIGGER IF EXISTS set_admin_users_updated_at ON public.admin_users;
CREATE TRIGGER set_admin_users_updated_at BEFORE UPDATE ON public.admin_users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS set_clients_updated_at ON public.clients;
CREATE TRIGGER set_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS set_config_updated_at ON public.config;
CREATE TRIGGER set_config_updated_at BEFORE UPDATE ON public.config FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS set_jobs_updated_at ON public.jobs;
CREATE TRIGGER set_jobs_updated_at BEFORE UPDATE ON public.jobs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS set_news_updated_at ON public.news;
CREATE TRIGGER set_news_updated_at BEFORE UPDATE ON public.news FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS set_projects_updated_at ON public.projects;
CREATE TRIGGER set_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS set_services_updated_at ON public.services;
CREATE TRIGGER set_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS set_testimonials_updated_at ON public.testimonials;
CREATE TRIGGER set_testimonials_updated_at BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------------------------------------------------------
-- 12. Indexes (Filtering, Sorting & Relationships)
-- ---------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON public.admin_users(role);

CREATE INDEX IF NOT EXISTS idx_clients_created_at ON public.clients(created_at);

CREATE INDEX IF NOT EXISTS idx_config_key ON public.config(key);

CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON public.jobs(created_at);

CREATE INDEX IF NOT EXISTS idx_news_enabled ON public.news(enabled);
CREATE INDEX IF NOT EXISTS idx_news_publish_date ON public.news(publish_date DESC);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON public.news(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_projects_enabled_featured ON public.projects(enabled, featured);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at);

CREATE INDEX IF NOT EXISTS idx_services_enabled ON public.services(enabled);
CREATE INDEX IF NOT EXISTS idx_services_created_at ON public.services(created_at);

CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON public.testimonials(featured);
CREATE INDEX IF NOT EXISTS idx_testimonials_created_at ON public.testimonials(created_at);

-- ---------------------------------------------------------
-- 13. Hardened Security Definer Function: is_admin()
-- ---------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
BEGIN
    -- Fast exit for anonymous unauthenticated requests
    IF auth.uid() IS NULL THEN
        RETURN FALSE;
    END IF;

    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$;

-- ---------------------------------------------------------
-- 14. Helper Function: Register/Promote Admin by Email
-- (Call in Supabase SQL editor: SELECT public.add_admin_by_email('your@email.com');)
-- ---------------------------------------------------------
CREATE OR REPLACE FUNCTION public.add_admin_by_email(target_email TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    target_user_id UUID;
BEGIN
    SELECT id INTO target_user_id FROM auth.users WHERE lower(email) = lower(trim(target_email));
    IF target_user_id IS NULL THEN
        RAISE EXCEPTION 'User "%" not found in auth.users. Please invite or create the user in Supabase Authentication first.', target_email;
    END IF;

    INSERT INTO public.admin_users (id, email, role)
    VALUES (target_user_id, lower(trim(target_email)), 'admin')
    ON CONFLICT (id) DO UPDATE 
    SET role = 'admin', email = lower(trim(target_email)), updated_at = now();
END;
$$;

-- ---------------------------------------------------------
-- 15. Enable Row Level Security (RLS) on all tables
-- ---------------------------------------------------------
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------
-- 16. Row Level Security (RLS) Policies
-- ---------------------------------------------------------

-- 1) Admin Users Policies
DROP POLICY IF EXISTS "Admins can view admin_users" ON public.admin_users;
CREATE POLICY "Admins can view admin_users" 
    ON public.admin_users FOR SELECT 
    USING (id = auth.uid() OR is_admin());

DROP POLICY IF EXISTS "Admins can manage admin_users" ON public.admin_users;
CREATE POLICY "Admins can manage admin_users" 
    ON public.admin_users FOR ALL 
    USING (is_admin()) 
    WITH CHECK (is_admin());

-- 2) Clients Policies (Public Read, Admin Full CRUD)
DROP POLICY IF EXISTS "Public clients viewable" ON public.clients;
CREATE POLICY "Public clients viewable" 
    ON public.clients FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "Admins manage clients" ON public.clients;
CREATE POLICY "Admins manage clients" 
    ON public.clients FOR ALL 
    USING (is_admin()) 
    WITH CHECK (is_admin());

-- 3) Config Policies (Public Read, Admin Full CRUD)
DROP POLICY IF EXISTS "Public config viewable" ON public.config;
CREATE POLICY "Public config viewable" 
    ON public.config FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "Admins manage config" ON public.config;
CREATE POLICY "Admins manage config" 
    ON public.config FOR ALL 
    USING (is_admin()) 
    WITH CHECK (is_admin());

-- 4) Jobs Policies (Public view Open jobs, Admin Full CRUD)
DROP POLICY IF EXISTS "Public jobs viewable" ON public.jobs;
CREATE POLICY "Public jobs viewable" 
    ON public.jobs FOR SELECT 
    USING (lower(status) = 'open' OR is_admin());

DROP POLICY IF EXISTS "Admins manage jobs" ON public.jobs;
CREATE POLICY "Admins manage jobs" 
    ON public.jobs FOR ALL 
    USING (is_admin()) 
    WITH CHECK (is_admin());

-- 5) News Policies (Public view enabled, Admin Full CRUD)
DROP POLICY IF EXISTS "Public news viewable" ON public.news;
CREATE POLICY "Public news viewable" 
    ON public.news FOR SELECT 
    USING (enabled = true OR is_admin());

DROP POLICY IF EXISTS "Admins manage news" ON public.news;
CREATE POLICY "Admins manage news" 
    ON public.news FOR ALL 
    USING (is_admin()) 
    WITH CHECK (is_admin());

-- 6) Projects Policies (Public view enabled, Admin Full CRUD)
DROP POLICY IF EXISTS "Public projects viewable" ON public.projects;
CREATE POLICY "Public projects viewable" 
    ON public.projects FOR SELECT 
    USING (enabled = true OR is_admin());

DROP POLICY IF EXISTS "Admins manage projects" ON public.projects;
CREATE POLICY "Admins manage projects" 
    ON public.projects FOR ALL 
    USING (is_admin()) 
    WITH CHECK (is_admin());

-- 7) Services Policies (Public view enabled, Admin Full CRUD)
DROP POLICY IF EXISTS "Public services viewable" ON public.services;
CREATE POLICY "Public services viewable" 
    ON public.services FOR SELECT 
    USING (enabled = true OR is_admin());

DROP POLICY IF EXISTS "Admins manage services" ON public.services;
CREATE POLICY "Admins manage services" 
    ON public.services FOR ALL 
    USING (is_admin()) 
    WITH CHECK (is_admin());

-- 8) Testimonials Policies (Public Read, Admin Full CRUD)
DROP POLICY IF EXISTS "Public testimonials viewable" ON public.testimonials;
CREATE POLICY "Public testimonials viewable" 
    ON public.testimonials FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "Admins manage testimonials" ON public.testimonials;
CREATE POLICY "Admins manage testimonials" 
    ON public.testimonials FOR ALL 
    USING (is_admin()) 
    WITH CHECK (is_admin());
