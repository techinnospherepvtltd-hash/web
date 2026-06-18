import { useState, useEffect } from 'react';
import { fetchExcelData, saveExcelDataLocal, downloadExcel } from '../utils/excelUtils';
import * as XLSX from 'xlsx';
import { LogOut, Download, Upload, Plus, Trash2, LayoutDashboard, Database, Activity } from 'lucide-react';

const tabs = [
  { id: 'dashboard', name: 'Analytics', icon: LayoutDashboard },
  { id: 'projects.xlsx', name: 'Projects', icon: Database },
  { id: 'services.xlsx', name: 'Services', icon: Database },
  { id: 'config.xlsx', name: 'Home CMS Config', icon: Database },
  { id: 'news.xlsx', name: 'News', icon: Database },
  { id: 'jobs.xlsx', name: 'Careers', icon: Database },
  { id: 'clients.xlsx', name: 'Clients', icon: Database },
  { id: 'testimonials.xlsx', name: 'Testimonials', icon: Database }
];

const Dashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState({});

  useEffect(() => {
    if (activeTab === 'dashboard') {
      loadAnalytics();
    } else {
      loadData(activeTab);
    }
  }, [activeTab]);

  const loadAnalytics = async () => {
    setLoading(true);
    const p = await fetchExcelData('projects.xlsx');
    const s = await fetchExcelData('services.xlsx');
    const n = await fetchExcelData('news.xlsx');
    const c = await fetchExcelData('clients.xlsx');
    const t = await fetchExcelData('testimonials.xlsx');
    const j = await fetchExcelData('jobs.xlsx');
    
    setAnalytics({
      projects: p.length,
      services: s.length,
      news: n.length,
      clients: c.length,
      testimonials: t.length,
      careers: j.length
    });
    setLoading(false);
  };

  const loadData = async (fileName) => {
    setLoading(true);
    const result = await fetchExcelData(fileName);
    setData(result);
    setLoading(false);
  };

  const handleExport = () => {
    downloadExcel(data, activeTab);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const result = XLSX.utils.sheet_to_json(ws);
      setData(result);
      saveExcelDataLocal(activeTab, result);
    };
    reader.readAsBinaryString(file);
    e.target.value = null; // reset input
  };

  const handleDelete = (index) => {
    const newData = [...data];
    newData.splice(index, 1);
    setData(newData);
    saveExcelDataLocal(activeTab, newData);
  };

  const handleAddRow = () => {
    const newData = [...data];
    const newRow = {};
    if (data.length > 0) {
      Object.keys(data[0]).forEach(key => newRow[key] = '');
    } else {
      newRow['New_Column'] = '';
    }
    newData.push(newRow);
    setData(newData);
    saveExcelDataLocal(activeTab, newData);
  };

  const handleCellChange = (index, key, value) => {
    const newData = [...data];
    newData[index][key] = value;
    setData(newData);
    saveExcelDataLocal(activeTab, newData);
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-[#111827] text-white p-6 flex flex-col shadow-2xl z-20">
        <div className="mb-10 flex items-center gap-3">
          <Activity className="w-8 h-8 text-brand-primary" />
          <h2 className="text-xl font-bold tracking-tight">Admin Portal</h2>
        </div>
        <nav className="flex-grow space-y-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                  activeTab === tab.id ? 'bg-brand-primary text-white shadow-md' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" /> {tab.name}
              </button>
            )
          })}
        </nav>
        <button 
          onClick={onLogout}
          className="mt-auto flex items-center justify-center gap-2 bg-white/5 hover:bg-red-500 hover:text-white rounded-xl transition-all py-3 font-bold text-sm text-gray-300"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-8 overflow-hidden flex flex-col max-w-[calc(100vw-16rem)]">
        {activeTab === 'dashboard' ? (
          <div className="space-y-8">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Platform Analytics</h1>
            {loading ? <p>Loading analytics...</p> : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { label: 'Total Projects', count: analytics.projects, color: 'text-blue-600', bg: 'bg-blue-50' },
                  { label: 'Total Services', count: analytics.services, color: 'text-purple-600', bg: 'bg-purple-50' },
                  { label: 'Total News', count: analytics.news, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { label: 'Client Locations', count: analytics.clients, color: 'text-amber-600', bg: 'bg-amber-50' },
                  { label: 'Testimonials', count: analytics.testimonials, color: 'text-rose-600', bg: 'bg-rose-50' },
                  { label: 'Careers', count: analytics.careers, color: 'text-indigo-600', bg: 'bg-indigo-50' }
                ].map((stat, i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 font-medium text-sm mb-1">{stat.label}</p>
                      <h3 className="text-3xl font-extrabold text-gray-900">{stat.count}</h3>
                    </div>
                    <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center font-bold text-xl`}>
                      {stat.count}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Manage {tabs.find(t => t.id === activeTab)?.name}
              </h1>
              <div className="flex gap-4">
                <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all font-semibold text-sm shadow-sm">
                  <Download className="w-4 h-4" /> Export CSV
                </button>
                <label className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-dark transition-all cursor-pointer font-semibold text-sm shadow-md">
                  <Upload className="w-4 h-4" /> Import Excel
                  <input type="file" accept=".xlsx, .xls" className="hidden" onChange={handleImport} />
                </label>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex-grow overflow-hidden flex flex-col">
              {loading ? (
                <div className="p-8 text-center text-gray-500 font-medium animate-pulse">Loading dataset...</div>
              ) : (
                <>
                  <div className="overflow-x-auto flex-grow max-h-[70vh]">
                    <table className="w-full text-left border-collapse min-w-max">
                      <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                          {data.length > 0 && Object.keys(data[0]).map((key) => (
                            <th key={key} className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                              {key}
                            </th>
                          ))}
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200 w-20 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {data.map((row, index) => (
                          <tr key={index} className="hover:bg-gray-50/50 transition-colors group">
                            {Object.keys(row).map((key) => (
                              <td key={key} className="px-6 py-2">
                                {key.toLowerCase().includes('description') || key.toLowerCase().includes('content') ? (
                                  <textarea
                                    value={row[key] || ''}
                                    onChange={(e) => handleCellChange(index, key, e.target.value)}
                                    className="w-full min-w-[250px] h-12 bg-transparent border-transparent focus:border-brand-primary focus:ring-1 focus:ring-brand-primary rounded-md px-3 py-2 text-sm text-gray-700 resize-y"
                                  />
                                ) : (
                                  <input
                                    type="text"
                                    value={row[key] || ''}
                                    onChange={(e) => handleCellChange(index, key, e.target.value)}
                                    className="w-full min-w-[150px] bg-transparent border-transparent focus:border-brand-primary focus:ring-1 focus:ring-brand-primary rounded-md px-3 py-2 text-sm text-gray-700 font-medium"
                                  />
                                )}
                              </td>
                            ))}
                            <td className="px-6 py-2 text-right">
                              <button onClick={() => handleDelete(index)} className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50 opacity-0 group-hover:opacity-100">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {data.length === 0 && (
                          <tr>
                            <td colSpan="100%" className="text-center py-16 text-gray-500 font-medium">
                              No records found. Import an Excel file or add a new row.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
                    <button onClick={handleAddRow} className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-sm font-semibold shadow-sm">
                      <Plus className="w-4 h-4" /> Add Record
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
