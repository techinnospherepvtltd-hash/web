import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { fetchExcelData, saveExcelDataLocal, getDirectImageUrl } from './excelUtils';

// Helper to handle boolean string or raw boolean
const parseBool = (val, defaultVal = true) => {
  if (val === undefined || val === null || val === '') return defaultVal;
  if (typeof val === 'boolean') return val;
  const str = String(val).trim().toLowerCase();
  return str === 'true' || str === 'yes' || str === 'y' || str === '1';
};

// ---------------------------------------------------------
// Transformation functions: DB snake_case -> App Casing
// ---------------------------------------------------------
export const mapClientFromDB = (row) => ({
  id: row.id,
  'Client Name': row.client_name || '',
  Country: row.country || '',
  City: row.city || '',
  Industry: row.industry || '',
  Logo: getDirectImageUrl(row.logo || ''),
  'Project Delivered': row.project_delivered || '',
  Latitude: row.latitude !== null ? Number(row.latitude) : null,
  Longitude: row.longitude !== null ? Number(row.longitude) : null,
  'Project Count': row.project_count !== null ? Number(row.project_count) : 1
});

export const mapClientToDB = (item) => ({
  client_name: item['Client Name'] || item.client_name || '',
  country: item.Country || item.country || '',
  city: item.City || item.city || '',
  industry: item.Industry || item.industry || '',
  logo: item.Logo || item.logo || '',
  project_delivered: item['Project Delivered'] || item.project_delivered || '',
  latitude: item.Latitude !== undefined && item.Latitude !== '' ? Number(item.Latitude) : null,
  longitude: item.Longitude !== undefined && item.Longitude !== '' ? Number(item.Longitude) : null,
  project_count: item['Project Count'] !== undefined && item['Project Count'] !== '' ? Number(item['Project Count']) : 1
});

export const mapConfigFromDB = (rows) => {
  const cfg = {};
  if (Array.isArray(rows)) {
    rows.forEach(r => {
      if (r.key) {
        cfg[r.key] = getDirectImageUrl(r.value || '');
      }
    });
  }
  return cfg;
};

export const mapConfigToDBList = (cfgObj) => {
  return Object.keys(cfgObj).map(key => ({
    key: key,
    value: cfgObj[key] || ''
  }));
};

export const mapJobFromDB = (row) => ({
  id: row.id,
  'Job Title': row.job_title || '',
  Department: row.department || '',
  Location: row.location || '',
  'Employment Type': row.employment_type || '',
  'Experience Required': row.experience_required || '',
  'Job Description': row.job_description || '',
  'Skills Required': row.skills_required || '',
  'Google Form URL': row.google_form_url || '',
  Status: row.status || 'Open'
});

export const mapJobToDB = (item) => ({
  job_title: item['Job Title'] || item.job_title || '',
  department: item.Department || item.department || '',
  location: item.Location || item.location || '',
  employment_type: item['Employment Type'] || item.employment_type || '',
  experience_required: item['Experience Required'] || item.experience_required || '',
  job_description: item['Job Description'] || item.job_description || '',
  skills_required: item['Skills Required'] || item.skills_required || '',
  google_form_url: item['Google Form URL'] || item.google_form_url || '',
  status: item.Status || item.status || 'Open'
});

export const mapNewsFromDB = (row) => ({
  id: row.id,
  Title: row.title || '',
  Description: row.description || '',
  Content: row.content || '',
  Image: getDirectImageUrl(row.image || ''),
  'Publish Date': row.publish_date || '',
  Category: row.category || '',
  'Read Time': row.read_time || '',
  Author: row.author || '',
  Enabled: row.enabled ? 'Yes' : 'No'
});

export const mapNewsToDB = (item) => ({
  title: item.Title || item.title || '',
  description: item.Description || item.description || '',
  content: item.Content || item.content || '',
  image: item.Image || item.image || '',
  publish_date: item['Publish Date'] || item.publish_date || null,
  category: item.Category || item.category || '',
  read_time: item['Read Time'] || item.read_time || '',
  author: item.Author || item.author || '',
  enabled: parseBool(item.Enabled, true)
});

export const mapProjectFromDB = (row) => ({
  id: row.id,
  Title: row.title || '',
  Category: row.category || '',
  Description: row.description || '',
  'Short Description': row.short_description || '',
  'Full Case Study Description': row.full_case_study_description || '',
  'Client Name': row.client_name || '',
  Role: row.role || '',
  Location: row.location || '',
  Image: getDirectImageUrl(row.image || ''),
  'Website URL': row.website_url || '',
  URL: row.website_url || '',
  'Technology Used': row.technology_used || '',
  Industry: row.industry || '',
  'Completion Date': row.completion_date || '',
  Challenges: row.challenges || '',
  'Solution Provided': row.solution_provided || '',
  'Business Outcome': row.business_outcome || '',
  Testimonial: row.testimonial || '',
  'Client Designation': row.client_designation || '',
  'Client Rating': row.client_rating !== null ? Number(row.client_rating) : 5,
  'Featured Project Toggle': row.featured ? true : false,
  Featured: row.featured ? 'Yes' : 'No',
  Enabled: row.enabled ? 'Yes' : 'No'
});

export const mapProjectToDB = (item) => ({
  title: item.Title || item.title || '',
  category: item.Category || item.category || '',
  description: item.Description || item.description || '',
  short_description: item['Short Description'] || item.short_description || '',
  full_case_study_description: item['Full Case Study Description'] || item.full_case_study_description || '',
  client_name: item['Client Name'] || item.client_name || '',
  role: item.Role || item.role || '',
  location: item.Location || item.location || '',
  image: item.Image || item.image || '',
  website_url: item['Website URL'] || item.URL || item.website_url || '',
  technology_used: item['Technology Used'] || item.technology_used || '',
  industry: item.Industry || item.industry || '',
  completion_date: item['Completion Date'] || item.completion_date || null,
  challenges: item.Challenges || item.challenges || '',
  solution_provided: item['Solution Provided'] || item.solution_provided || '',
  business_outcome: item['Business Outcome'] || item.business_outcome || '',
  testimonial: item.Testimonial || item.testimonial || '',
  client_designation: item['Client Designation'] || item.client_designation || '',
  client_rating: item['Client Rating'] !== undefined && item['Client Rating'] !== '' ? Number(item['Client Rating']) : 5,
  featured: parseBool(item['Featured Project Toggle'] ?? item.Featured, false),
  enabled: parseBool(item.Enabled, true)
});

export const mapServiceFromDB = (row) => ({
  id: row.id,
  'Service Name': row.service_name || '',
  'Short Description': row.short_description || '',
  'Detailed Description': row.detailed_description || '',
  Icon: row.icon || '',
  'Banner Image': getDirectImageUrl(row.banner_image || ''),
  Category: row.category || '',
  'Features List': row.features_list || '',
  'Technologies Used': row.technologies_used || '',
  'CTA Text': row.cta_text || '',
  'CTA Link': row.cta_link || '',
  Enabled: row.enabled ? 'Yes' : 'No'
});

export const mapServiceToDB = (item) => ({
  service_name: item['Service Name'] || item.service_name || '',
  short_description: item['Short Description'] || item.short_description || '',
  detailed_description: item['Detailed Description'] || item.detailed_description || '',
  icon: item.Icon || item.icon || '',
  banner_image: item['Banner Image'] || item.banner_image || '',
  category: item.Category || item.category || '',
  features_list: item['Features List'] || item.features_list || '',
  technologies_used: item['Technologies Used'] || item.technologies_used || '',
  cta_text: item['CTA Text'] || item.cta_text || '',
  cta_link: item['CTA Link'] || item.cta_link || '',
  enabled: parseBool(item.Enabled, true)
});

export const mapTestimonialFromDB = (row) => ({
  id: row.id,
  'Client Name': row.client_name || '',
  Designation: row.designation || '',
  Company: row.company || '',
  Location: row.location || '',
  Feedback: row.feedback || '',
  Rating: row.rating !== null ? Number(row.rating) : 5,
  'Client Photo': getDirectImageUrl(row.client_photo || ''),
  'Related Project': row.related_project || '',
  Featured: row.featured ? 'Yes' : 'No'
});

export const mapTestimonialToDB = (item) => ({
  client_name: item['Client Name'] || item.client_name || '',
  designation: item.Designation || item.designation || '',
  company: item.Company || item.company || '',
  location: item.Location || item.location || '',
  feedback: item.Feedback || item.feedback || '',
  rating: item.Rating !== undefined && item.Rating !== '' ? Number(item.Rating) : 5,
  client_photo: item['Client Photo'] || item.client_photo || '',
  related_project: item['Related Project'] || item.related_project || '',
  featured: parseBool(item.Featured, false)
});

// ---------------------------------------------------------
// Primary Fetchers with Graceful Fallback
// ---------------------------------------------------------
export const getClients = async () => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map(mapClientFromDB);
      }
    } catch (e) {
      console.warn('Supabase clients fetch failed, using local fallback:', e);
    }
  }
  return await fetchExcelData('clients.xlsx');
};

export const getConfig = async () => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('config').select('*');
      if (!error && data && data.length > 0) {
        return mapConfigFromDB(data);
      }
    } catch (e) {
      console.warn('Supabase config fetch failed, using local fallback:', e);
    }
  }
  const excelData = await fetchExcelData('config.xlsx');
  const cfg = {};
  excelData.forEach(item => {
    if (item.Key && item.Value) {
      cfg[item.Key] = item.Value;
    }
  });
  return cfg;
};

export const getJobs = async () => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('jobs').select('*').order('created_at', { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map(mapJobFromDB);
      }
    } catch (e) {
      console.warn('Supabase jobs fetch failed, using local fallback:', e);
    }
  }
  return await fetchExcelData('jobs.xlsx');
};

export const getNews = async () => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('news').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map(mapNewsFromDB);
      }
    } catch (e) {
      console.warn('Supabase news fetch failed, using local fallback:', e);
    }
  }
  return await fetchExcelData('news.xlsx');
};

export const getProjects = async () => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map(mapProjectFromDB);
      }
    } catch (e) {
      console.warn('Supabase projects fetch failed, using local fallback:', e);
    }
  }
  return await fetchExcelData('projects.xlsx');
};

export const getServices = async () => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('services').select('*').order('created_at', { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map(mapServiceFromDB);
      }
    } catch (e) {
      console.warn('Supabase services fetch failed, using local fallback:', e);
    }
  }
  return await fetchExcelData('services.xlsx');
};

export const getTestimonials = async () => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map(mapTestimonialFromDB);
      }
    } catch (e) {
      console.warn('Supabase testimonials fetch failed, using local fallback:', e);
    }
  }
  return await fetchExcelData('testimonials.xlsx');
};

// Unified reader by fileName
export const getDatasetByFileName = async (fileName) => {
  switch (fileName) {
    case 'clients.xlsx':
      return await getClients();
    case 'config.xlsx': {
      const cfgObj = await getConfig();
      return Object.keys(cfgObj).map(k => ({ Key: k, Value: cfgObj[k] }));
    }
    case 'jobs.xlsx':
      return await getJobs();
    case 'news.xlsx':
      return await getNews();
    case 'projects.xlsx':
      return await getProjects();
    case 'services.xlsx':
      return await getServices();
    case 'testimonials.xlsx':
      return await getTestimonials();
    default:
      return await fetchExcelData(fileName);
  }
};

// ---------------------------------------------------------
// CRUD Functions
// ---------------------------------------------------------
export const saveDatasetByFileName = async (fileName, datasetArray) => {
  if (!isSupabaseConfigured()) {
    saveExcelDataLocal(fileName, datasetArray);
    return { success: true, localOnly: true };
  }

  try {
    switch (fileName) {
      case 'clients.xlsx': {
        const payload = datasetArray.map(mapClientToDB);
        const { error } = await supabase.from('clients').upsert(payload, { onConflict: 'client_name' });
        if (error) throw error;
        break;
      }
      case 'config.xlsx': {
        const payload = datasetArray.map(item => ({
          key: item.Key || item.key,
          value: item.Value || item.value || ''
        })).filter(r => r.key);
        const { error } = await supabase.from('config').upsert(payload, { onConflict: 'key' });
        if (error) throw error;
        break;
      }
      case 'jobs.xlsx': {
        const payload = datasetArray.map(mapJobToDB);
        const { error } = await supabase.from('jobs').upsert(payload, { onConflict: 'job_title' });
        if (error) throw error;
        break;
      }
      case 'news.xlsx': {
        const payload = datasetArray.map(mapNewsToDB);
        const { error } = await supabase.from('news').upsert(payload, { onConflict: 'title' });
        if (error) throw error;
        break;
      }
      case 'projects.xlsx': {
        const payload = datasetArray.map(mapProjectToDB);
        const { error } = await supabase.from('projects').upsert(payload, { onConflict: 'title' });
        if (error) throw error;
        break;
      }
      case 'services.xlsx': {
        const payload = datasetArray.map(mapServiceToDB);
        const { error } = await supabase.from('services').upsert(payload, { onConflict: 'service_name' });
        if (error) throw error;
        break;
      }
      case 'testimonials.xlsx': {
        const payload = datasetArray.map(mapTestimonialToDB);
        const { error } = await supabase.from('testimonials').upsert(payload, { onConflict: 'company' });
        if (error) throw error;
        break;
      }
      default:
        saveExcelDataLocal(fileName, datasetArray);
        return { success: true, localOnly: true };
    }

    // Save locally as cache
    saveExcelDataLocal(fileName, datasetArray);
    return { success: true };
  } catch (error) {
    console.error(`Error saving ${fileName} to Supabase:`, error);
    // Fallback to local storage if DB fails
    saveExcelDataLocal(fileName, datasetArray);
    return { success: false, error: error.message };
  }
};

// ---------------------------------------------------------
// Auth Functions
// ---------------------------------------------------------
export const loginAdmin = async (emailOrUsername, password) => {
  if (isSupabaseConfigured()) {
    const email = emailOrUsername.includes('@') ? emailOrUsername : `${emailOrUsername}@techinnosphere.com`;
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (!error && data.user) {
      localStorage.setItem('techinnosphere_auth', 'true');
      localStorage.setItem('techinnosphere_user', JSON.stringify(data.user));
      return { success: true, user: data.user };
    }
  }

  // Local Admin Fallback
  if (emailOrUsername === 'admin' && password === 'admin123') {
    localStorage.setItem('techinnosphere_auth', 'true');
    return { success: true, localOnly: true };
  }

  return { success: false, error: 'Invalid credentials' };
};

export const logoutAdmin = async () => {
  if (isSupabaseConfigured()) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Signout error:', e);
    }
  }
  localStorage.removeItem('techinnosphere_auth');
  localStorage.removeItem('techinnosphere_user');
};
