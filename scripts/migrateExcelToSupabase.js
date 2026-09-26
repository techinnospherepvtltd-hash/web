import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load .env or .env.local if present
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-supabase-project')) {
  console.error('Error: Valid VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or SUPABASE_SERVICE_ROLE_KEY) are required in environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const getDirectImageUrl = (url) => {
  if (!url || typeof url !== 'string') return url;
  const fileDMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) return `https://lh3.googleusercontent.com/d/${fileDMatch[1]}`;
  const idMatch = url.match(/[\?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) return `https://lh3.googleusercontent.com/d/${idMatch[1]}`;
  return url;
};

const parseBoolean = (val, defaultVal = true) => {
  if (val === undefined || val === null || val === '') return defaultVal;
  if (typeof val === 'boolean') return val;
  const str = String(val).trim().toLowerCase();
  return str === 'true' || str === 'yes' || str === 'y' || str === '1';
};

const parseDate = (val) => {
  if (!val) return null;
  const parsed = new Date(val);
  return isNaN(parsed.getTime()) ? null : parsed.toISOString().split('T')[0];
};

const cleanString = (val) => {
  if (val === undefined || val === null) return '';
  const str = getDirectImageUrl(String(val).trim());
  return str;
};

async function migrate() {
  console.log('🚀 Starting Excel -> Supabase PostgreSQL Data Migration...');
  console.log(`Connecting to Supabase at: ${supabaseUrl}`);

  const publicDir = path.join(process.cwd(), 'public');

  // 1. Config
  try {
    const filePath = path.join(publicDir, 'config.xlsx');
    if (fs.existsSync(filePath)) {
      const wb = XLSX.readFile(filePath);
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      const records = rows.filter(r => r.Key).map(r => ({
        key: String(r.Key).trim(),
        value: cleanString(r.Value)
      }));
      const { data, error } = await supabase.from('config').upsert(records, { onConflict: 'key' });
      if (error) console.error('❌ Error migrating config:', error.message);
      else console.log(`✅ Config: ${records.length} records migrated.`);
    }
  } catch (err) {
    console.error('❌ Failed config migration:', err.message);
  }

  // 2. Clients
  try {
    const filePath = path.join(publicDir, 'clients.xlsx');
    if (fs.existsSync(filePath)) {
      const wb = XLSX.readFile(filePath);
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      const records = rows.map(r => ({
        client_name: cleanString(r['Client Name'] || r.City || 'Client'),
        country: cleanString(r.Country),
        city: cleanString(r.City),
        industry: cleanString(r.Industry),
        logo: cleanString(r.Logo),
        project_delivered: cleanString(r['Project Delivered']),
        latitude: r.Latitude ? parseFloat(r.Latitude) : null,
        longitude: r.Longitude ? parseFloat(r.Longitude) : null,
        project_count: r['Project Count'] ? parseInt(r['Project Count']) : 1
      }));
      const { error } = await supabase.from('clients').upsert(records, { onConflict: 'client_name' });
      if (error) console.error('❌ Error migrating clients:', error.message);
      else console.log(`✅ Clients: ${records.length} records migrated.`);
    }
  } catch (err) {
    console.error('❌ Failed clients migration:', err.message);
  }

  // 3. Jobs
  try {
    const filePath = path.join(publicDir, 'jobs.xlsx');
    if (fs.existsSync(filePath)) {
      const wb = XLSX.readFile(filePath);
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      const records = rows.map(r => ({
        job_title: cleanString(r['Job Title']),
        department: cleanString(r.Department),
        location: cleanString(r.Location),
        employment_type: cleanString(r['Employment Type']),
        experience_required: cleanString(r['Experience Required']),
        job_description: cleanString(r['Job Description']),
        skills_required: cleanString(r['Skills Required']),
        google_form_url: cleanString(r['Google Form URL']),
        status: cleanString(r.Status) || 'Open'
      }));
      const { error } = await supabase.from('jobs').upsert(records, { onConflict: 'job_title' });
      if (error) console.error('❌ Error migrating jobs:', error.message);
      else console.log(`✅ Jobs: ${records.length} records migrated.`);
    }
  } catch (err) {
    console.error('❌ Failed jobs migration:', err.message);
  }

  // 4. News
  try {
    const filePath = path.join(publicDir, 'news.xlsx');
    if (fs.existsSync(filePath)) {
      const wb = XLSX.readFile(filePath);
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      const records = rows.map(r => ({
        title: cleanString(r.Title),
        description: cleanString(r.Description || r.Summary),
        content: cleanString(r.Content),
        image: cleanString(r.Image),
        publish_date: parseDate(r['Publish Date'] || r.Date),
        category: cleanString(r.Category),
        read_time: cleanString(r['Read Time']),
        author: cleanString(r.Author),
        enabled: parseBoolean(r.Enabled || r.Published, true)
      }));
      const { error } = await supabase.from('news').upsert(records, { onConflict: 'title' });
      if (error) console.error('❌ Error migrating news:', error.message);
      else console.log(`✅ News: ${records.length} records migrated.`);
    }
  } catch (err) {
    console.error('❌ Failed news migration:', err.message);
  }

  // 5. Projects
  try {
    const filePath = path.join(publicDir, 'projects.xlsx');
    if (fs.existsSync(filePath)) {
      const wb = XLSX.readFile(filePath);
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      const records = rows.map(r => ({
        title: cleanString(r.Title),
        category: cleanString(r.Category),
        description: cleanString(r.Description),
        short_description: cleanString(r['Short Description']),
        full_case_study_description: cleanString(r['Full Case Study Description']),
        client_name: cleanString(r['Client Name']),
        role: cleanString(r.Role),
        location: cleanString(r.Location),
        image: cleanString(r.Image),
        website_url: cleanString(r['Website URL'] || r.URL),
        technology_used: cleanString(r['Technology Used']),
        industry: cleanString(r.Industry),
        completion_date: parseDate(r['Completion Date']),
        challenges: cleanString(r.Challenges),
        solution_provided: cleanString(r['Solution Provided']),
        business_outcome: cleanString(r['Business Outcome']),
        testimonial: cleanString(r.Testimonial),
        client_designation: cleanString(r['Client Designation']),
        client_rating: r['Client Rating'] ? parseInt(r['Client Rating']) : 5,
        featured: parseBoolean(r['Featured Project Toggle'] || r.Featured, false),
        enabled: parseBoolean(r.Enabled, true)
      }));
      const { error } = await supabase.from('projects').upsert(records, { onConflict: 'title' });
      if (error) console.error('❌ Error migrating projects:', error.message);
      else console.log(`✅ Projects: ${records.length} records migrated.`);
    }
  } catch (err) {
    console.error('❌ Failed projects migration:', err.message);
  }

  // 6. Services
  try {
    const filePath = path.join(publicDir, 'services.xlsx');
    if (fs.existsSync(filePath)) {
      const wb = XLSX.readFile(filePath);
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      const records = rows.map(r => ({
        service_name: cleanString(r['Service Name']),
        short_description: cleanString(r['Short Description']),
        detailed_description: cleanString(r['Detailed Description']),
        icon: cleanString(r.Icon),
        banner_image: cleanString(r['Banner Image']),
        category: cleanString(r.Category),
        features_list: cleanString(r['Features List']),
        technologies_used: cleanString(r['Technologies Used']),
        cta_text: cleanString(r['CTA Text']),
        cta_link: cleanString(r['CTA Link']),
        enabled: parseBoolean(r.Enabled, true)
      }));
      const { error } = await supabase.from('services').upsert(records, { onConflict: 'service_name' });
      if (error) console.error('❌ Error migrating services:', error.message);
      else console.log(`✅ Services: ${records.length} records migrated.`);
    }
  } catch (err) {
    console.error('❌ Failed services migration:', err.message);
  }

  // 7. Testimonials
  try {
    const filePath = path.join(publicDir, 'testimonials.xlsx');
    if (fs.existsSync(filePath)) {
      const wb = XLSX.readFile(filePath);
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      const records = rows.map(r => ({
        client_name: cleanString(r['Client Name']),
        designation: cleanString(r.Designation),
        company: cleanString(r.Company),
        location: cleanString(r.Location),
        feedback: cleanString(r.Feedback),
        rating: r.Rating ? parseInt(r.Rating) : 5,
        client_photo: cleanString(r['Client Photo']),
        related_project: cleanString(r['Related Project']),
        featured: parseBoolean(r.Featured, false)
      }));
      const { error } = await supabase.from('testimonials').upsert(records, { onConflict: 'company' });
      if (error) console.error('❌ Error migrating testimonials:', error.message);
      else console.log(`✅ Testimonials: ${records.length} records migrated.`);
    }
  } catch (err) {
    console.error('❌ Failed testimonials migration:', err.message);
  }

  console.log('\n🎉 Migration execution completed.');
}

migrate();
