import fs from 'fs';
import * as XLSX from 'xlsx';

const projects = [
  { Title: "Shahji Shipping LLC", Category: "Enterprise", Description: "Logistics and shipping management system.", "Full Case Study Description": "Built a highly scalable internal logistics management system to handle global shipping operations, tracking, and fleet management.", "Client Name": "Shahji Shipping LLC", Location: "Dubai", Image: "", "Website URL": "https://shahjishippingllc.com/", "Technology Used": "React, Node.js, PostgreSQL", Industry: "Logistics", "Completion Date": "2024-01-15", Challenges: "Handling massive amounts of real-time geospatial data.", "Solution Provided": "Implemented a scalable Node.js backend with PostgreSQL and real-time WebSockets.", "Business Outcome": "Reduced operational delays by 35% and increased tracking accuracy.", "Testimonial": "TechInnoSphere transformed our logistics operations.", "Client Designation": "Operations Head", "Client Rating": 5, "Featured Project Toggle": true },
  { Title: "Ace Consultants", Category: "Consulting", Description: "Immigration and visa consulting platform.", "Full Case Study Description": "Developed a full-stack platform for visa processing, document management, and client communication.", "Client Name": "Ace Consultants", Location: "Canada", Image: "", "Website URL": "https://aceconsultants.ca/", "Technology Used": "Next.js, Tailwind, MongoDB", Industry: "Consulting", "Completion Date": "2023-11-20", Challenges: "Secure document handling and status tracking.", "Solution Provided": "End-to-end encrypted document portal with role-based access.", "Business Outcome": "Increased client handling capacity by 50%.", "Testimonial": "Fast, modern, and highly secure.", "Client Designation": "Director", "Client Rating": 5, "Featured Project Toggle": true },
  { Title: "Kira Ledgers", Category: "Finance", Description: "Accounting and financial reporting software.", "Full Case Study Description": "Automated financial ledger system using AI-powered OCR for invoice processing.", "Client Name": "Kira Ledgers", Location: "Mumbai", Image: "", "Website URL": "", "Technology Used": "React, Python, AWS", Industry: "Finance", "Completion Date": "2024-05-10", Challenges: "High accuracy required for OCR on diverse invoice formats.", "Solution Provided": "Custom ML model trained on diverse financial documents.", "Business Outcome": "Reduced manual entry time by 80%.", "Testimonial": "", "Client Designation": "", "Client Rating": 4, "Featured Project Toggle": false },
  { Title: "Sweezen Foundation", Category: "Non-Profit", Description: "NGO management and donation portal.", "Full Case Study Description": "Donation and volunteer management platform for global NGO operations.", "Client Name": "Sweezen Foundation", Location: "Mumbai", Image: "", "Website URL": "", "Technology Used": "React, Express, Stripe", Industry: "Non-Profit", "Completion Date": "2023-08-05", Challenges: "Secure payment gateway integration for global donors.", "Solution Provided": "Stripe integration with multi-currency support.", "Business Outcome": "Increased online donations by 120%.", "Testimonial": "", "Client Designation": "", "Client Rating": 5, "Featured Project Toggle": false },
  { Title: "Chanakya The Global School", Category: "Education", Description: "School management and e-learning system.", "Full Case Study Description": "Comprehensive LMS and ERP for school administration, grading, and online classes.", "Client Name": "Chanakya School", Location: "Palghar", Image: "", "Website URL": "https://www.chanakyatheglobalschool.com/", "Technology Used": "React, PHP, MySQL", Industry: "Education", "Completion Date": "2024-02-28", Challenges: "Managing thousands of concurrent users during exams.", "Solution Provided": "Auto-scaling infrastructure on AWS.", "Business Outcome": "Zero downtime during mid-term online assessments.", "Testimonial": "", "Client Designation": "", "Client Rating": 4, "Featured Project Toggle": false },
  { Title: "PMK Iron & Steel", Category: "Enterprise", Description: "Inventory and supply chain management.", "Full Case Study Description": "Heavy industry ERP for managing raw material inventory, production cycles, and dispatch.", "Client Name": "PMK Iron & Steel", Location: "Punjab", Image: "", "Website URL": "", "Technology Used": "Angular, Spring Boot", Industry: "Manufacturing", "Completion Date": "2023-10-12", Challenges: "Integration with legacy weighing bridge systems.", "Solution Provided": "Custom IoT middleware to capture weights automatically.", "Business Outcome": "Eliminated manual entry errors entirely.", "Testimonial": "", "Client Designation": "", "Client Rating": 5, "Featured Project Toggle": false },
  { Title: "News AI Videos", Category: "AI", Description: "Automated AI news video generator.", "Full Case Study Description": "AI pipeline that converts text articles into fully rendered video news segments using virtual avatars.", "Client Name": "News AI Videos", Location: "Austria", Image: "", "Website URL": "", "Technology Used": "React, Python, FFmpeg", Industry: "Media", "Completion Date": "2024-04-18", Challenges: "Fast rendering times required for breaking news.", "Solution Provided": "Distributed rendering pipeline using GPU clusters.", "Business Outcome": "Reduced video production time from hours to minutes.", "Testimonial": "", "Client Designation": "", "Client Rating": 5, "Featured Project Toggle": true }
];

const services = [
  { "Service Name": "Web Development", "Short Description": "Modern web applications.", "Detailed Description": "We build modern, high-performance web applications using React, Next.js, and scalable cloud architectures.", Icon: "Monitor", "Banner Image": "", Category: "Development", "Features List": "React, Next.js, High Performance, SEO Optimized", "Technologies Used": "React, Next.js, Tailwind", "CTA Text": "Start Building", "CTA Link": "/contact", Enabled: true },
  { "Service Name": "AI Solutions", "Short Description": "Intelligent systems and automation.", "Detailed Description": "Custom AI models for automation, predictive analytics, and natural language processing.", Icon: "Cpu", "Banner Image": "", Category: "Artificial Intelligence", "Features List": "Machine Learning, NLP, Computer Vision, Predictive Analytics", "Technologies Used": "Python, TensorFlow, PyTorch", "CTA Text": "Explore AI", "CTA Link": "/contact", Enabled: true },
  { "Service Name": "Security Testing", "Short Description": "Comprehensive VAPT.", "Detailed Description": "Vulnerability Assessment and Penetration Testing (VAPT) and source code reviews to secure your infrastructure.", Icon: "ShieldCheck", "Banner Image": "", Category: "Security", "Features List": "VAPT, Source Code Review, API Security", "Technologies Used": "Burp Suite, OWASP, Metasploit", "CTA Text": "Secure Your App", "CTA Link": "/contact", Enabled: true },
  { "Service Name": "Enterprise Solutions", "Short Description": "Custom ERP systems.", "Detailed Description": "Custom ERP and tailored enterprise software solutions designed for massive scale.", Icon: "Database", "Banner Image": "", Category: "Enterprise", "Features List": "Custom ERP, CRM, Workflow Automation", "Technologies Used": "Java, Spring Boot, PostgreSQL", "CTA Text": "Scale Up", "CTA Link": "/contact", Enabled: true }
];

const config = [
  { Key: "CompanyName", Value: "TechInnoSphere" },
  { Key: "CompanyLogo", Value: "logo.png" },
  { Key: "Favicon", Value: "logo.png" },
  { Key: "WhatsAppNumber", Value: "+917710031550" },
  { Key: "InstagramURL", Value: "https://www.instagram.com/techinnosphere/" },
  { Key: "FacebookURL", Value: "https://www.facebook.com/profile.php?id=61584937588072" },
  { Key: "CompanyAddress", Value: "Mumbai, Maharashtra, India" },
  { Key: "ContactEmail", Value: "careers@techinnosphere.com" },
  { Key: "FooterContent", Value: "© TechInnoSphere. All Rights Reserved." },
  { Key: "HeroHeading", Value: "Engineering Scalable Digital Systems" },
  { Key: "HeroSubheading", Value: "From Vision to Software we Build it All!!!" },
  { Key: "HeroButtonPrimaryText", Value: "Start Your Project" },
  { Key: "HeroButtonPrimaryLink", Value: "/contact" },
  { Key: "HeroButtonSecondaryText", Value: "View Our Work" },
  { Key: "HeroButtonSecondaryLink", Value: "/work" },
  { Key: "CompanyTagline", Value: "From Vision To Software We Build It All." }
];

const news = [
  { Title: "TechInnoSphere Expands to Dubai", Description: "We are thrilled to announce our new office in Dubai.", Content: "TechInnoSphere is expanding its global footprint by opening a new state-of-the-art facility in Dubai.", Image: "", "Publish Date": "2024-05-20" },
  { Title: "AI in Healthcare Solutions", Description: "New AI product suite launched for hospitals.", Content: "Our latest AI solutions help healthcare providers streamline operations.", Image: "", "Publish Date": "2024-04-10" }
];

const jobs = [
  {
    "Job Title": "Senior React Developer",
    Department: "Engineering",
    Location: "Mumbai (Hybrid)",
    "Employment Type": "Full-Time",
    "Experience Required": "3-5 Years",
    "Job Description": "We are looking for an experienced Senior React Developer to lead our enterprise web application development. You will be responsible for architecting scalable frontend solutions, mentoring junior developers, and collaborating closely with design and backend teams.",
    "Skills Required": "React, Next.js, TypeScript, Tailwind CSS, State Management (Redux/Zustand), Framer Motion",
    "Google Form URL": "https://forms.google.com/example-react-job",
    Status: "Open"
  },
  {
    "Job Title": "AI/ML Engineer",
    Department: "Data Science",
    Location: "Remote",
    "Employment Type": "Full-Time",
    "Experience Required": "2+ Years",
    "Job Description": "Join our AI team to build and deploy custom machine learning models for healthcare and enterprise clients. You will work on NLP, predictive analytics, and computer vision projects.",
    "Skills Required": "Python, TensorFlow, PyTorch, Scikit-Learn, Docker, FastApi",
    "Google Form URL": "https://forms.google.com/example-ai-job",
    Status: "Open"
  },
  {
    "Job Title": "Cybersecurity Analyst",
    Department: "Security",
    Location: "Dubai",
    "Employment Type": "Contract",
    "Experience Required": "4+ Years",
    "Job Description": "Conduct extensive VAPT and source code reviews for enterprise applications to ensure maximum security compliance.",
    "Skills Required": "VAPT, OWASP, Burp Suite, Network Security, Python",
    "Google Form URL": "https://forms.google.com/example-security-job",
    Status: "Closed"
  }
];

const clients = [
  { "Client Name": "News AI", Country: "Austria", City: "Vienna", Latitude: 48.2082, Longitude: 16.3738, "Project Count": 1 },
  { "Client Name": "Ace Consultants", Country: "Canada", City: "Toronto", Latitude: 43.65107, Longitude: -79.347015, "Project Count": 1 },
  { "Client Name": "Shahji Shipping", Country: "UAE", City: "Dubai", Latitude: 25.2048, Longitude: 55.2708, "Project Count": 1 },
  { "Client Name": "Kira Ledgers", Country: "India", City: "Mumbai", Latitude: 19.0760, Longitude: 72.8777, "Project Count": 2 },
  { "Client Name": "Chanakya School", Country: "India", City: "Palghar", Latitude: 19.6967, Longitude: 72.7699, "Project Count": 1 },
  { "Client Name": "PMK Steel", Country: "India", City: "Punjab", Latitude: 31.1471, Longitude: 75.3412, "Project Count": 1 }
];

const testimonials = [
  { "Client Name": "Rahul Sharma", Designation: "Operations Head", Company: "Shahji Shipping LLC", Location: "Dubai", Feedback: "TechInnoSphere transformed our logistics operations with their enterprise software.", Rating: 5, "Client Photo": "", "Related Project": "Shahji Shipping LLC" },
  { "Client Name": "Sarah Jenkins", Designation: "Director", Company: "Ace Consultants", Location: "Canada", Feedback: "The web platform they built for us is fast, modern, and has significantly improved our client acquisition.", Rating: 5, "Client Photo": "", "Related Project": "Ace Consultants" }
];

function createExcel(filename, data) {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, `public/${filename}`);
}

createExcel('projects.xlsx', projects);
createExcel('services.xlsx', services);
createExcel('config.xlsx', config);
createExcel('news.xlsx', news);
createExcel('jobs.xlsx', jobs);
createExcel('clients.xlsx', clients);
createExcel('testimonials.xlsx', testimonials);

console.log("Updated Excel files generated successfully.");
