import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { fetchExcelData, saveExcelDataLocal, getDirectImageUrl } from './excelUtils';

// ---------------------------------------------------------
// Validation & Sanitization Helpers
// ---------------------------------------------------------

export const isValidUUID = (id) => {
  return typeof id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
};

export const sanitizeDate = (val) => {
  if (val === undefined || val === null || val === '') return null;
  // Handle Excel date serial numbers
  if (typeof val === 'number') {
    const date = new Date(Math.round((val - 25569) * 86400 * 1000));
    return isNaN(date.getTime()) ? null : date.toISOString().split('T')[0];
  }
  const str = String(val).trim();
  if (!str || str.toLowerCase() === 'n/a' || str.toLowerCase() === 'ongoing' || str.toLowerCase() === 'null') {
    return null;
  }
  // Try YYYY-MM-DD directly
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    return str;
  }
  // Try DD/MM/YYYY or DD-MM-YYYY
  const dmyMatch = str.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (dmyMatch) {
    const day = dmyMatch[1].padStart(2, '0');
    const month = dmyMatch[2].padStart(2, '0');
    const year = dmyMatch[3];
    return `${year}-${month}-${day}`;
  }
  const parsed = new Date(str);
  return isNaN(parsed.getTime()) ? null : parsed.toISOString().split('T')[0];
};

export const sanitizeInt = (val, defaultVal = null) => {
  if (val === undefined || val === null || val === '') return defaultVal;
  const num = parseInt(val, 10);
  return isNaN(num) ? defaultVal : num;
};

export const sanitizeFloat = (val, defaultVal = null) => {
  if (val === undefined || val === null || val === '') return defaultVal;
  const num = parseFloat(val);
  return isNaN(num) ? defaultVal : num;
};

export const sanitizeBool = (val, defaultVal = true) => {
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

export const mapClientToDB = (item) => {
  const dbRecord = {
    client_name: String(item['Client Name'] || item.client_name || '').trim(),
    country: String(item.Country || item.country || '').trim(),
    city: String(item.City || item.city || '').trim(),
    industry: String(item.Industry || item.industry || '').trim(),
    logo: String(item.Logo || item.logo || '').trim(),
    project_delivered: String(item['Project Delivered'] || item.project_delivered || '').trim(),
    latitude: sanitizeFloat(item.Latitude ?? item.latitude, null),
    longitude: sanitizeFloat(item.Longitude ?? item.longitude, null),
    project_count: sanitizeInt(item['Project Count'] ?? item.project_count, 1)
  };
  if (isValidUUID(item.id)) {
    dbRecord.id = item.id;
  }
  return dbRecord;
};

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

export const mapConfigListFromDB = (rows) => {
  if (!Array.isArray(rows)) return [];
  return rows.map(r => ({
    id: r.id,
    Key: r.key || '',
    Value: r.value || ''
  }));
};

export const mapConfigToDB = (item) => {
  const dbRecord = {
    key: String(item.Key || item.key || '').trim(),
    value: String(item.Value ?? item.value ?? '').trim()
  };
  if (isValidUUID(item.id)) {
    dbRecord.id = item.id;
  }
  return dbRecord;
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

export const mapJobToDB = (item) => {
  const dbRecord = {
    job_title: String(item['Job Title'] || item.job_title || '').trim(),
    department: String(item.Department || item.department || '').trim(),
    location: String(item.Location || item.location || '').trim(),
    employment_type: String(item['Employment Type'] || item.employment_type || '').trim(),
    experience_required: String(item['Experience Required'] || item.experience_required || '').trim(),
    job_description: String(item['Job Description'] || item.job_description || '').trim(),
    skills_required: String(item['Skills Required'] || item.skills_required || '').trim(),
    google_form_url: String(item['Google Form URL'] || item.google_form_url || '').trim(),
    status: String(item.Status || item.status || 'Open').trim()
  };
  if (isValidUUID(item.id)) {
    dbRecord.id = item.id;
  }
  return dbRecord;
};

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

export const mapNewsToDB = (item) => {
  const dbRecord = {
    title: String(item.Title || item.title || '').trim(),
    description: String(item.Description || item.description || item.Summary || '').trim(),
    content: String(item.Content || item.content || '').trim(),
    image: String(item.Image || item.image || '').trim(),
    publish_date: sanitizeDate(item['Publish Date'] ?? item.publish_date ?? item.Date),
    category: String(item.Category || item.category || '').trim(),
    read_time: String(item['Read Time'] || item.read_time || '').trim(),
    author: String(item.Author || item.author || '').trim(),
    enabled: sanitizeBool(item.Enabled ?? item.enabled, true)
  };
  if (isValidUUID(item.id)) {
    dbRecord.id = item.id;
  }
  return dbRecord;
};

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

export const mapProjectToDB = (item) => {
  const dbRecord = {
    title: String(item.Title || item.title || '').trim(),
    category: String(item.Category || item.category || '').trim(),
    description: String(item.Description || item.description || '').trim(),
    short_description: String(item['Short Description'] || item.short_description || '').trim(),
    full_case_study_description: String(item['Full Case Study Description'] || item.full_case_study_description || '').trim(),
    client_name: String(item['Client Name'] || item.client_name || '').trim(),
    role: String(item.Role || item.role || '').trim(),
    location: String(item.Location || item.location || '').trim(),
    image: String(item.Image || item.image || '').trim(),
    website_url: String(item['Website URL'] || item.URL || item.website_url || '').trim(),
    technology_used: String(item['Technology Used'] || item.technology_used || '').trim(),
    industry: String(item.Industry || item.industry || '').trim(),
    completion_date: sanitizeDate(item['Completion Date'] ?? item.completion_date),
    challenges: String(item.Challenges || item.challenges || '').trim(),
    solution_provided: String(item['Solution Provided'] || item.solution_provided || '').trim(),
    business_outcome: String(item['Business Outcome'] || item.business_outcome || '').trim(),
    testimonial: String(item.Testimonial || item.testimonial || '').trim(),
    client_designation: String(item['Client Designation'] || item.client_designation || '').trim(),
    client_rating: sanitizeInt(item['Client Rating'] ?? item.client_rating, 5),
    featured: sanitizeBool(item['Featured Project Toggle'] ?? item.Featured ?? item.featured, false),
    enabled: sanitizeBool(item.Enabled ?? item.enabled, true)
  };
  if (isValidUUID(item.id)) {
    dbRecord.id = item.id;
  }
  return dbRecord;
};

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

export const mapServiceToDB = (item) => {
  const dbRecord = {
    service_name: String(item['Service Name'] || item.service_name || '').trim(),
    short_description: String(item['Short Description'] || item.short_description || '').trim(),
    detailed_description: String(item['Detailed Description'] || item.detailed_description || '').trim(),
    icon: String(item.Icon || item.icon || '').trim(),
    banner_image: String(item['Banner Image'] || item.banner_image || '').trim(),
    category: String(item.Category || item.category || '').trim(),
    features_list: String(item['Features List'] || item.features_list || '').trim(),
    technologies_used: String(item['Technologies Used'] || item.technologies_used || '').trim(),
    cta_text: String(item['CTA Text'] || item.cta_text || '').trim(),
    cta_link: String(item['CTA Link'] || item.cta_link || '').trim(),
    enabled: sanitizeBool(item.Enabled ?? item.enabled, true)
  };
  if (isValidUUID(item.id)) {
    dbRecord.id = item.id;
  }
  return dbRecord;
};

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

export const mapTestimonialToDB = (item) => {
  const dbRecord = {
    client_name: String(item['Client Name'] || item.client_name || '').trim(),
    designation: String(item.Designation || item.designation || '').trim(),
    company: String(item.Company || item.company || '').trim(),
    location: String(item.Location || item.location || '').trim(),
    feedback: String(item.Feedback || item.feedback || '').trim(),
    rating: sanitizeInt(item.Rating ?? item.rating, 5),
    client_photo: String(item['Client Photo'] || item.client_photo || '').trim(),
    related_project: String(item['Related Project'] || item.related_project || '').trim(),
    featured: sanitizeBool(item.Featured ?? item.featured, false)
  };
  if (isValidUUID(item.id)) {
    dbRecord.id = item.id;
  }
  return dbRecord;
};

// Table configuration mappings
export const getTableConfig = (fileName) => {
  switch (fileName) {
    case 'clients.xlsx':
      return {
        table: 'clients',
        toDB: mapClientToDB,
        fromDB: mapClientFromDB,
        uniqueField: 'client_name',
        appUniqueField: 'Client Name',
        orderBy: 'created_at',
        ascending: true
      };
    case 'config.xlsx':
      return {
        table: 'config',
        toDB: mapConfigToDB,
        fromDB: (r) => ({ id: r.id, Key: r.key || '', Value: r.value || '' }),
        uniqueField: 'key',
        appUniqueField: 'Key',
        orderBy: 'key',
        ascending: true
      };
    case 'jobs.xlsx':
      return {
        table: 'jobs',
        toDB: mapJobToDB,
        fromDB: mapJobFromDB,
        uniqueField: 'job_title',
        appUniqueField: 'Job Title',
        orderBy: 'created_at',
        ascending: true
      };
    case 'news.xlsx':
      return {
        table: 'news',
        toDB: mapNewsToDB,
        fromDB: mapNewsFromDB,
        uniqueField: 'title',
        appUniqueField: 'Title',
        orderBy: 'created_at',
        ascending: false
      };
    case 'projects.xlsx':
      return {
        table: 'projects',
        toDB: mapProjectToDB,
        fromDB: mapProjectFromDB,
        uniqueField: 'title',
        appUniqueField: 'Title',
        orderBy: 'created_at',
        ascending: true
      };
    case 'services.xlsx':
      return {
        table: 'services',
        toDB: mapServiceToDB,
        fromDB: mapServiceFromDB,
        uniqueField: 'service_name',
        appUniqueField: 'Service Name',
        orderBy: 'created_at',
        ascending: true
      };
    case 'testimonials.xlsx':
      return {
        table: 'testimonials',
        toDB: mapTestimonialToDB,
        fromDB: mapTestimonialFromDB,
        uniqueField: 'client_name',
        appUniqueField: 'Client Name',
        orderBy: 'created_at',
        ascending: true
      };
    default:
      return null;
  }
};

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

export const getConfigList = async () => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('config').select('*').order('key', { ascending: true });
      if (!error && data && data.length > 0) {
        return mapConfigListFromDB(data);
      }
    } catch (e) {
      console.warn('Supabase config list fetch failed, using local fallback:', e);
    }
  }
  const excelData = await fetchExcelData('config.xlsx');
  return excelData.map(item => ({
    id: item.id || '',
    Key: item.Key || item.key || '',
    Value: item.Value || item.value || ''
  }));
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
    case 'config.xlsx':
      return await getConfigList();
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
// Single-Record CRUD Operations (Auto-ID, Update, Delete)
// ---------------------------------------------------------

/**
 * Creates a single record in Supabase (or local fallback).
 * Automatically generates a unique UUID primary ID if not present.
 */
export const createRecord = async (fileName, itemData) => {
  const config = getTableConfig(fileName);
  if (!config) {
    return { success: false, error: `Unknown dataset file: ${fileName}` };
  }

  // Pre-validate required identifier
  const mainVal = itemData[config.appUniqueField] || itemData[config.uniqueField];
  if (!mainVal || String(mainVal).trim() === '') {
    return { success: false, error: `${config.appUniqueField} is required to create a record.` };
  }

  const payload = config.toDB(itemData);
  // Ensure no empty string or invalid id is passed to Supabase
  if (!isValidUUID(payload.id)) {
    delete payload.id;
  }

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from(config.table)
        .insert([payload])
        .select()
        .single();

      if (error) {
        console.error(`Supabase create error on ${config.table}:`, error);
        return { success: false, error: error.message || 'Database insert failed' };
      }

      const created = config.fromDB(data);
      return { success: true, data: created };
    } catch (err) {
      console.error(`Exception creating record in ${config.table}:`, err);
      return { success: false, error: err.message || 'Network error' };
    }
  }

  // Offline / Local Fallback
  const newId = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : 'local-' + Date.now();
  const createdLocal = { ...itemData, id: newId };
  return { success: true, data: createdLocal, localOnly: true };
};

/**
 * Updates an existing record in Supabase by primary ID (or unique field).
 */
export const updateRecord = async (fileName, id, itemData) => {
  const config = getTableConfig(fileName);
  if (!config) {
    return { success: false, error: `Unknown dataset file: ${fileName}` };
  }

  const payload = config.toDB(itemData);
  delete payload.id; // Do not overwrite primary key

  if (isSupabaseConfigured()) {
    try {
      let query = supabase.from(config.table).update(payload);
      if (isValidUUID(id)) {
        query = query.eq('id', id);
      } else if (config.table === 'config') {
        query = query.eq('key', itemData.Key || itemData.key);
      } else {
        const uniqueVal = itemData[config.appUniqueField] || itemData[config.uniqueField];
        if (uniqueVal) {
          query = query.eq(config.uniqueField, uniqueVal);
        } else {
          return { success: false, error: 'Cannot update: record lacks primary ID and unique key.' };
        }
      }

      const { data, error } = await query.select().single();
      if (error) {
        console.error(`Supabase update error on ${config.table}:`, error);
        return { success: false, error: error.message || 'Database update failed' };
      }

      const updated = config.fromDB(data);
      return { success: true, data: updated };
    } catch (err) {
      console.error(`Exception updating record in ${config.table}:`, err);
      return { success: false, error: err.message || 'Network error' };
    }
  }

  return { success: true, data: { ...itemData, id }, localOnly: true };
};

/**
 * Deletes a record from Supabase by primary ID (or unique field).
 */
export const deleteRecord = async (fileName, id, itemData) => {
  const config = getTableConfig(fileName);
  if (!config) {
    return { success: false, error: `Unknown dataset file: ${fileName}` };
  }

  if (isSupabaseConfigured()) {
    try {
      let query = supabase.from(config.table).delete();
      if (isValidUUID(id)) {
        query = query.eq('id', id);
      } else if (config.table === 'config') {
        query = query.eq('key', itemData?.Key || itemData?.key);
      } else {
        const uniqueVal = itemData ? (itemData[config.appUniqueField] || itemData[config.uniqueField]) : null;
        if (uniqueVal) {
          query = query.eq(config.uniqueField, uniqueVal);
        } else {
          return { success: false, error: 'Cannot delete: record has no valid primary ID or unique identifier.' };
        }
      }

      const { error } = await query;
      if (error) {
        console.error(`Supabase delete error on ${config.table}:`, error);
        return { success: false, error: error.message || 'Database delete failed' };
      }

      return { success: true };
    } catch (err) {
      console.error(`Exception deleting record from ${config.table}:`, err);
      return { success: false, error: err.message || 'Network error' };
    }
  }

  return { success: true, localOnly: true };
};

// ---------------------------------------------------------
// Bulk Dataset Save (for Excel Import & Full Table Overwrites)
// ---------------------------------------------------------
export const saveDatasetByFileName = async (fileName, datasetArray) => {
  const config = getTableConfig(fileName);
  if (!isSupabaseConfigured() || !config) {
    saveExcelDataLocal(fileName, datasetArray);
    return { success: true, localOnly: true };
  }

  try {
    const payload = datasetArray.map(item => {
      const dbRow = config.toDB(item);
      if (!isValidUUID(dbRow.id)) {
        delete dbRow.id;
      }
      return dbRow;
    });

    const conflictTarget = config.uniqueField;
    const { error } = await supabase.from(config.table).upsert(payload, { onConflict: conflictTarget });
    if (error) throw error;

    saveExcelDataLocal(fileName, datasetArray);
    return { success: true };
  } catch (error) {
    console.error(`Error saving ${fileName} to Supabase:`, error);
    saveExcelDataLocal(fileName, datasetArray);
    return { success: false, error: error.message };
  }
};

// ---------------------------------------------------------
// Auth Functions
// ---------------------------------------------------------
export const loginAdmin = async (emailOrUsername, password) => {
  if (isSupabaseConfigured()) {
    const email = emailOrUsername.includes('@') ? emailOrUsername.trim() : `${emailOrUsername.trim()}@techinnosphere.com`;
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (!error && data?.user) {
        localStorage.setItem('techinnosphere_auth', 'true');
        localStorage.setItem('techinnosphere_user', JSON.stringify(data.user));
        return { success: true, user: data.user };
      }
      if (error) {
        // If wrong credentials or invalid grant
        return { success: false, error: error.message || 'Invalid credentials' };
      }
    } catch (e) {
      console.warn('Supabase auth sign-in error:', e);
    }
  }

  // Local Admin Fallback
  if (emailOrUsername === 'admin' && password === 'admin123') {
    localStorage.setItem('techinnosphere_auth', 'true');
    return { success: true, localOnly: true };
  }

  return { success: false, error: 'Invalid login credentials' };
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
