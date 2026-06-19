import * as XLSX from 'xlsx';

export const getDirectImageUrl = (url) => {
  if (!url || typeof url !== 'string') return url;
  
  // Match standard file/d/ID/view pattern
  const fileDMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${fileDMatch[1]}`;
  }
  
  // Match open?id=ID pattern
  const idMatch = url.match(/[\?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${idMatch[1]}`;
  }
  
  return url;
};

const resolveGoogleDriveLinks = (data) => {
  if (!Array.isArray(data)) return data;
  return data.map(row => {
    const newRow = { ...row };
    Object.keys(newRow).forEach(key => {
      if (typeof newRow[key] === 'string' && newRow[key].includes('drive.google.com')) {
        newRow[key] = getDirectImageUrl(newRow[key]);
      }
    });
    return newRow;
  });
};

export const fetchExcelData = async (fileName) => {
  try {
    // Check if data exists in localStorage (uploaded by Admin)
    const localData = localStorage.getItem(`techinnosphere_data_${fileName}`);
    if (localData) {
      return resolveGoogleDriveLinks(JSON.parse(localData));
    }

    const response = await fetch(`${import.meta.env.BASE_URL}${fileName}`);
    if (!response.ok) return [];
    
    const arrayBuffer = await response.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const json = XLSX.utils.sheet_to_json(worksheet);
    return resolveGoogleDriveLinks(json);
  } catch (error) {
    console.error(`Error loading Excel file ${fileName}:`, error);
    return [];
  }
};

export const saveExcelDataLocal = (fileName, jsonData) => {
  localStorage.setItem(`techinnosphere_data_${fileName}`, JSON.stringify(jsonData));
};

export const downloadExcel = (data, fileName) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, fileName);
};
