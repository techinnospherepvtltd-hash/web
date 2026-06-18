import { fetchExcelData } from './excelUtils';

export const fetchConfig = async () => {
  const data = await fetchExcelData('config.xlsx');
  const config = {};
  data.forEach(item => {
    if (item.Key && item.Value) {
      config[item.Key] = item.Value;
    }
  });
  return config;
};
