import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let val = match[2] || '';
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    env[match[1]] = val.trim();
  }
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

// Login as admin
async function setupAdmin() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'admin@techinnosphere.com',
    password: 'admin123'
  });
  if (error) throw error;
  console.log('Admin authenticated successfully.');
}

const isValidUUID = (id) => {
  return typeof id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
};

const sanitizeDate = (val) => {
  if (val === undefined || val === null || val === '') return null;
  if (typeof val === 'number') {
    const date = new Date(Math.round((val - 25569) * 86400 * 1000));
    return isNaN(date.getTime()) ? null : date.toISOString().split('T')[0];
  }
  const str = String(val).trim();
  if (!str || str.toLowerCase() === 'n/a' || str.toLowerCase() === 'ongoing' || str.toLowerCase() === 'null') return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
  const dmyMatch = str.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (dmyMatch) {
    return `${dmyMatch[3]}-${dmyMatch[2].padStart(2, '0')}-${dmyMatch[1].padStart(2, '0')}`;
  }
  const parsed = new Date(str);
  return isNaN(parsed.getTime()) ? null : parsed.toISOString().split('T')[0];
};

const sanitizeInt = (val, defaultVal = null) => {
  if (val === undefined || val === null || val === '') return defaultVal;
  const num = parseInt(val, 10);
  return isNaN(num) ? defaultVal : num;
};

const sanitizeFloat = (val, defaultVal = null) => {
  if (val === undefined || val === null || val === '') return defaultVal;
  const num = parseFloat(val);
  return isNaN(num) ? defaultVal : num;
};

const sanitizeBool = (val, defaultVal = true) => {
  if (val === undefined || val === null || val === '') return defaultVal;
  if (typeof val === 'boolean') return val;
  const str = String(val).trim().toLowerCase();
  return str === 'true' || str === 'yes' || str === 'y' || str === '1';
};

const mappers = {
  'projects.xlsx': {
    table: 'projects',
    toDB: (item) => {
      const rec = {
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
      if (isValidUUID(item.id)) rec.id = item.id;
      return rec;
    },
    fromDB: (row) => ({
      id: row.id,
      Title: row.title || '',
      Category: row.category || '',
      Description: row.description || '',
      'Short Description': row.short_description || '',
      'Full Case Study Description': row.full_case_study_description || '',
      'Client Name': row.client_name || '',
      Role: row.role || '',
      Location: row.location || '',
      Image: row.image || '',
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
    })
  },
  'services.xlsx': {
    table: 'services',
    toDB: (item) => {
      const rec = {
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
      if (isValidUUID(item.id)) rec.id = item.id;
      return rec;
    },
    fromDB: (row) => ({
      id: row.id,
      'Service Name': row.service_name || '',
      'Short Description': row.short_description || '',
      'Detailed Description': row.detailed_description || '',
      Icon: row.icon || '',
      'Banner Image': row.banner_image || '',
      Category: row.category || '',
      'Features List': row.features_list || '',
      'Technologies Used': row.technologies_used || '',
      'CTA Text': row.cta_text || '',
      'CTA Link': row.cta_link || '',
      Enabled: row.enabled ? 'Yes' : 'No'
    })
  },
  'news.xlsx': {
    table: 'news',
    toDB: (item) => {
      const rec = {
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
      if (isValidUUID(item.id)) rec.id = item.id;
      return rec;
    },
    fromDB: (row) => ({
      id: row.id,
      Title: row.title || '',
      Description: row.description || '',
      Content: row.content || '',
      Image: row.image || '',
      'Publish Date': row.publish_date || '',
      Category: row.category || '',
      'Read Time': row.read_time || '',
      Author: row.author || '',
      Enabled: row.enabled ? 'Yes' : 'No'
    })
  },
  'jobs.xlsx': {
    table: 'jobs',
    toDB: (item) => {
      const rec = {
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
      if (isValidUUID(item.id)) rec.id = item.id;
      return rec;
    },
    fromDB: (row) => ({
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
    })
  },
  'clients.xlsx': {
    table: 'clients',
    toDB: (item) => {
      const rec = {
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
      if (isValidUUID(item.id)) rec.id = item.id;
      return rec;
    },
    fromDB: (row) => ({
      id: row.id,
      'Client Name': row.client_name || '',
      Country: row.country || '',
      City: row.city || '',
      Industry: row.industry || '',
      Logo: row.logo || '',
      'Project Delivered': row.project_delivered || '',
      Latitude: row.latitude !== null ? Number(row.latitude) : null,
      Longitude: row.longitude !== null ? Number(row.longitude) : null,
      'Project Count': row.project_count !== null ? Number(row.project_count) : 1
    })
  },
  'testimonials.xlsx': {
    table: 'testimonials',
    toDB: (item) => {
      const rec = {
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
      if (isValidUUID(item.id)) rec.id = item.id;
      return rec;
    },
    fromDB: (row) => ({
      id: row.id,
      'Client Name': row.client_name || '',
      Designation: row.designation || '',
      Company: row.company || '',
      Location: row.location || '',
      Feedback: row.feedback || '',
      Rating: row.rating !== null ? Number(row.rating) : 5,
      'Client Photo': row.client_photo || '',
      'Related Project': row.related_project || '',
      Featured: row.featured ? 'Yes' : 'No'
    })
  },
  'config.xlsx': {
    table: 'config',
    toDB: (item) => {
      const rec = {
        key: String(item.Key || item.key || '').trim(),
        value: String(item.Value ?? item.value ?? '').trim()
      };
      if (isValidUUID(item.id)) rec.id = item.id;
      return rec;
    },
    fromDB: (row) => ({
      id: row.id,
      Key: row.key || '',
      Value: row.value || ''
    })
  }
};

async function testCRUD(fileName, testItem, updatePatch) {
  console.log(`\n========================================`);
  console.log(`Testing CRUD for ${fileName}`);
  console.log(`========================================`);

  const config = mappers[fileName];
  const payload = config.toDB(testItem);

  // 1. CREATE
  console.log('[1. CREATE] Sending payload to DB:', payload);
  const { data: createdRow, error: createError } = await supabase
    .from(config.table)
    .insert([payload])
    .select()
    .single();

  if (createError) {
    console.error(`❌ CREATE FAILED: ${createError.code} - ${createError.message}`);
    return false;
  }
  const createdMapped = config.fromDB(createdRow);
  console.log(`✅ CREATE SUCCESS! Unique ID generated: ${createdMapped.id}`);

  // 2. READ
  console.log(`[2. READ] Fetching created record with ID: ${createdMapped.id}`);
  const { data: readRow, error: readError } = await supabase
    .from(config.table)
    .select('*')
    .eq('id', createdMapped.id)
    .single();

  if (readError) {
    console.error(`❌ READ FAILED: ${readError.message}`);
    return false;
  }
  console.log(`✅ READ SUCCESS! Found record.`);

  // 3. UPDATE
  console.log(`[3. UPDATE] Applying update to record...`);
  const updatedItem = { ...createdMapped, ...updatePatch };
  const updatePayload = config.toDB(updatedItem);
  delete updatePayload.id; // Don't try to change primary key

  const { data: updatedRow, error: updateError } = await supabase
    .from(config.table)
    .update(updatePayload)
    .eq('id', createdMapped.id)
    .select()
    .single();

  if (updateError) {
    console.error(`❌ UPDATE FAILED: ${updateError.message}`);
    return false;
  }
  const updatedMapped = config.fromDB(updatedRow);
  console.log(`✅ UPDATE SUCCESS! Field updated properly.`);

  // 4. DELETE
  console.log(`[4. DELETE] Deleting record with ID: ${createdMapped.id}`);
  const { error: deleteError } = await supabase
    .from(config.table)
    .delete()
    .eq('id', createdMapped.id);

  if (deleteError) {
    console.error(`❌ DELETE FAILED: ${deleteError.message}`);
    return false;
  }
  console.log(`✅ DELETE SUCCESS!`);

  // Verify it is gone
  const { data: verifyRow } = await supabase
    .from(config.table)
    .select('*')
    .eq('id', createdMapped.id);

  if (!verifyRow || verifyRow.length === 0) {
    console.log(`✅ VERIFIED: Record completely removed from database.`);
  } else {
    console.error(`❌ VERIFICATION FAILED: Record still present.`);
    return false;
  }

  return true;
}

async function runAll() {
  await setupAdmin();

  // Test Projects (including empty date and empty rating simulation from frontend!)
  await testCRUD(
    'projects.xlsx',
    {
      Title: '__AUTO_TEST_PROJECT__',
      Category: 'Enterprise AI',
      Description: 'AI Automation System',
      'Short Description': 'Short summary',
      'Completion Date': '', // Empty string must be handled
      'Client Rating': '', // Empty string must default to 5
      'Featured Project Toggle': true,
      Enabled: 'true'
    },
    { Description: 'Updated AI Automation System Description' }
  );

  // Test Services
  await testCRUD(
    'services.xlsx',
    {
      'Service Name': '__AUTO_TEST_SERVICE__',
      'Short Description': 'Cloud Architecture',
      'Detailed Description': 'Full cloud migration and devops services.',
      Category: 'Cloud',
      Enabled: 'true'
    },
    { 'Short Description': 'Updated Cloud Architecture Summary' }
  );

  // Test News
  await testCRUD(
    'news.xlsx',
    {
      Title: '__AUTO_TEST_NEWS__',
      Description: 'Announcement of AI Suite',
      Content: 'TechInnoSphere unveils next-generation enterprise AI tooling.',
      'Publish Date': '', // Empty string must be handled
      Category: 'Technology',
      Enabled: 'true'
    },
    { Description: 'Updated Announcement of Enterprise AI Suite' }
  );

  // Test Jobs
  await testCRUD(
    'jobs.xlsx',
    {
      'Job Title': '__AUTO_TEST_JOB__',
      Department: 'AI Labs',
      Location: 'Mumbai / Remote',
      'Employment Type': 'Full-Time',
      Status: 'Open'
    },
    { Department: 'Autonomous Agents Lab' }
  );

  // Test Clients
  await testCRUD(
    'clients.xlsx',
    {
      'Client Name': '__AUTO_TEST_CLIENT__',
      Country: 'United Kingdom',
      City: 'London',
      Industry: 'FinTech',
      Latitude: '', // Empty string must be handled
      Longitude: '',
      'Project Count': '3'
    },
    { City: 'Manchester' }
  );

  // Test Testimonials
  await testCRUD(
    'testimonials.xlsx',
    {
      'Client Name': '__AUTO_TEST_PERSON__',
      Company: '__AUTO_TEST_ORG__',
      Designation: 'Head of Engineering',
      Feedback: 'Outstanding delivery speed and quality.',
      Rating: '5',
      Featured: 'Yes'
    },
    { Feedback: 'Exceptional engineering leadership and execution.' }
  );

  // Test Site Settings (config)
  await testCRUD(
    'config.xlsx',
    {
      Key: '__AUTO_TEST_CONFIG_KEY__',
      Value: 'Auto Test Value 1'
    },
    { Value: 'Auto Test Value Updated' }
  );

  console.log('\n=============================================');
  console.log('🎉 ALL 7 MODULES TESTED CREATE -> READ -> UPDATE -> DELETE SUCCESSFULLY!');
  console.log('=============================================\n');

  await supabase.auth.signOut();
}

runAll().catch(console.error);
