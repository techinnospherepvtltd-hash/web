import { useState, useEffect } from 'react';
import { fetchExcelData, saveExcelDataLocal, downloadExcel } from '../utils/excelUtils';
import * as XLSX from 'xlsx';
import { LogOut, Download, Upload, Plus, Trash2, LayoutDashboard, Database, Activity, Settings, Edit, Save, XCircle, AlertTriangle, Check } from 'lucide-react';
import { useConfig } from '../context/ConfigContext';

const tabs = [
  { id: 'dashboard', name: 'Analytics', icon: LayoutDashboard },
  { id: 'projects.xlsx', name: 'Projects', icon: Database },
  { id: 'services.xlsx', name: 'Services', icon: Database },
  { id: 'config.xlsx', name: 'Site Settings', icon: Settings },
  { id: 'news.xlsx', name: 'News', icon: Database },
  { id: 'jobs.xlsx', name: 'Careers', icon: Database },
  { id: 'clients.xlsx', name: 'Clients', icon: Database },
  { id: 'testimonials.xlsx', name: 'Testimonials', icon: Database }
];

const EXPECTED_COLUMNS = {
  'services.xlsx': ['Service Name', 'Short Description', 'Detailed Description', 'Icon', 'Banner Image', 'Category', 'Features List', 'Technologies Used', 'CTA Text', 'CTA Link', 'Enabled'],
  'projects.xlsx': ['Title', 'Category', 'Description', 'Short Description', 'Image', 'Featured Project Toggle', 'Client Name', 'Role', 'URL', 'Enabled'],
  'news.xlsx': ['Title', 'Date', 'Category', 'Summary', 'Content', 'Image', 'Read Time', 'Author', 'Enabled'],
  'jobs.xlsx': ['Job Title', 'Department', 'Location', 'Employment Type', 'Experience Required', 'Job Description', 'Skills Required', 'Google Form URL', 'Status'],
  'clients.xlsx': ['Client Name', 'Country', 'Industry', 'Logo', 'Project Delivered', 'Latitude', 'Longitude'],
  'testimonials.xlsx': ['Client Name', 'Company', 'Role', 'Comment', 'Rating', 'Avatar'],
  'config.xlsx': ['HeroHeading', 'HeroSubheading', 'HeroButtonPrimaryText', 'HeroButtonPrimaryLink', 'HeroButtonSecondaryText', 'HeroButtonSecondaryLink', 'CompanyLogo', 'Favicon', 'ContactEmail', 'ContactPhone', 'ContactAddress', 'MapLatitude', 'MapLongitude']
};

const normalizeImportedData = (fileName, importedRows) => {
  const expected = EXPECTED_COLUMNS[fileName];
  if (!expected || !importedRows || importedRows.length === 0) {
    return importedRows;
  }

  const normalizeKey = (key) => String(key).toLowerCase().replace(/[\s_-]/g, '');

  return importedRows.map(row => {
    const normalizedRow = {};
    const rowKeys = Object.keys(row);

    expected.forEach(expectedKey => {
      const match = rowKeys.find(rk => normalizeKey(rk) === normalizeKey(expectedKey));
      if (match !== undefined) {
        normalizedRow[expectedKey] = row[match];
      } else {
        if (expectedKey === 'Enabled') {
          normalizedRow[expectedKey] = 'true';
        } else if (expectedKey === 'Status') {
          normalizedRow[expectedKey] = 'Open';
        } else {
          normalizedRow[expectedKey] = '';
        }
      }
    });

    return normalizedRow;
  });
};

const Dashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState({});
  const config = useConfig();

  // CRUD State
  const [editingRowIndex, setEditingRowIndex] = useState(null);
  const [editingRowData, setEditingRowData] = useState({});
  const [isAdding, setIsAdding] = useState(false);
  const [newRowData, setNewRowData] = useState({});
  const [deleteConfirmIndex, setDeleteConfirmIndex] = useState(null);

  useEffect(() => {
    // Reset CRUD states when shifting tabs
    setEditingRowIndex(null);
    setEditingRowData({});
    setIsAdding(false);
    setNewRowData({});
    setDeleteConfirmIndex(null);

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
      
      // Normalize column keys to ensure they match expected casing/spacing
      const normalizedResult = normalizeImportedData(activeTab, result);
      
      setData(normalizedResult);
      saveExcelDataLocal(activeTab, normalizedResult);
      
      // Always reload the page to refresh all active contexts and components
      window.location.reload();
    };
    reader.readAsBinaryString(file);
    e.target.value = null; // reset input
  };

  // Row Editing Actions
  const handleStartEdit = (index, row) => {
    setEditingRowIndex(index);
    setEditingRowData({ ...row });
  };

  const handleEditCellChange = (key, value) => {
    setEditingRowData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveEdit = (index) => {
    const newData = [...data];
    newData[index] = { ...editingRowData };
    setData(newData);
    saveExcelDataLocal(activeTab, newData);
    setEditingRowIndex(null);
    setEditingRowData({});
    if (activeTab === 'config.xlsx') {
      window.location.reload(); // Reload immediately for config changes
    }
  };

  const handleCancelEdit = () => {
    setEditingRowIndex(null);
    setEditingRowData({});
  };

  // Add Record Actions
  const handleStartAdd = () => {
    const template = {};
    if (data.length > 0) {
      Object.keys(data[0]).forEach(key => template[key] = '');
    } else {
      template['Key'] = '';
      template['Value'] = '';
    }
    // Set default Enabled/featured value if it exists in columns
    if ('Enabled' in template) {
      template['Enabled'] = 'true';
    }
    if ('Status' in template) {
      template['Status'] = 'Open';
    }
    setNewRowData(template);
    setIsAdding(true);
  };

  const handleNewRowCellChange = (key, value) => {
    setNewRowData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleConfirmAdd = () => {
    const newData = [...data];
    newData.push({ ...newRowData });
    setData(newData);
    saveExcelDataLocal(activeTab, newData);
    setIsAdding(false);
    setNewRowData({});
    if (activeTab === 'config.xlsx') {
      window.location.reload();
    }
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewRowData({});
  };

  // Delete Actions
  const handleStartDelete = (index) => {
    setDeleteConfirmIndex(index);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmIndex !== null) {
      const index = deleteConfirmIndex;
      const newData = [...data];
      newData.splice(index, 1);
      setData(newData);
      saveExcelDataLocal(activeTab, newData);
      setDeleteConfirmIndex(null);
      
      if (editingRowIndex === index) {
        setEditingRowIndex(null);
        setEditingRowData({});
      } else if (editingRowIndex > index) {
        setEditingRowIndex(editingRowIndex - 1);
      }
      
      if (activeTab === 'config.xlsx') {
        window.location.reload();
      }
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmIndex(null);
  };

  const handleSaveSettings = () => {
    if (activeTab === 'config.xlsx') {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-[#111827] text-white p-6 flex flex-col shadow-2xl z-20">
        <div className="mb-10 flex items-center gap-3">
          {config?.CompanyLogo ? (
            <img src={config.CompanyLogo} alt="Admin Logo" className="h-14 object-contain" />
          ) : (
            <>
              <Activity className="w-8 h-8 text-brand-primary" />
              <h2 className="text-xl font-bold tracking-tight">Admin Portal</h2>
            </>
          )}
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
                {activeTab === 'config.xlsx' && (
                  <button onClick={handleSaveSettings} className="flex items-center gap-2 px-4 py-2 bg-[#111827] text-white rounded-lg hover:bg-brand-primary transition-all font-semibold text-sm shadow-md">
                    <Activity className="w-4 h-4" /> Save & Refresh
                  </button>
                )}
                <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all font-semibold text-sm shadow-sm">
                  <Download className="w-4 h-4" /> Export CSV
                </button>
                <label className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-dark transition-all cursor-pointer font-semibold text-sm shadow-md">
                  <Upload className="w-4 h-4" /> Import Excel
                  <input type="file" accept=".xlsx, .xls" className="hidden" onChange={handleImport} />
                </label>
              </div>
            </div>

            {/* Persistence Explanatory Banner */}
            <div className="mb-6 bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3 text-blue-800 text-sm font-medium">
              <Activity className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold mb-0.5">Real-time local sync active</p>
                <p className="text-blue-600 leading-relaxed text-xs">
                  Your changes are automatically saved to browser memory. To apply them permanently to the production website, click <strong>Export CSV</strong> (or Download Excel) and overwrite the corresponding file in the project's <strong>public/</strong> directory (e.g. <code>public/{activeTab}</code>), then commit and deploy!
                </p>
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
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200 w-28 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {data.map((row, index) => (
                          <tr key={index} className="hover:bg-gray-50/50 transition-colors group">
                            {Object.keys(row).map((key) => (
                              <td key={key} className="px-6 py-2">
                                {index === editingRowIndex ? (
                                  key.toLowerCase().includes('description') || key.toLowerCase().includes('content') || key.toLowerCase().includes('details') ? (
                                    <textarea
                                      value={editingRowData[key] ?? ''}
                                      onChange={(e) => handleEditCellChange(key, e.target.value)}
                                      className="w-full min-w-[250px] h-16 bg-white border border-gray-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary rounded-md px-3 py-2 text-sm text-gray-700 resize-y"
                                    />
                                  ) : (
                                    <input
                                      type="text"
                                      value={editingRowData[key] ?? ''}
                                      onChange={(e) => handleEditCellChange(key, e.target.value)}
                                      className="w-full min-w-[150px] bg-white border border-gray-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary rounded-md px-3 py-2 text-sm text-gray-700 font-semibold"
                                    />
                                  )
                                ) : (
                                  <div className="text-sm text-gray-700 font-semibold max-w-xs truncate" title={String(row[key] ?? '')}>
                                    {String(row[key] ?? '')}
                                  </div>
                                )}
                              </td>
                            ))}
                            <td className="px-6 py-2 text-right">
                              {index === editingRowIndex ? (
                                <div className="flex justify-end gap-1">
                                  <button 
                                    onClick={() => handleSaveEdit(index)} 
                                    className="text-emerald-600 hover:text-emerald-700 p-2 rounded-lg hover:bg-emerald-50 transition-colors"
                                    title="Save Changes"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={handleCancelEdit} 
                                    className="text-red-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                    title="Cancel Edit"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button 
                                    onClick={() => handleStartEdit(index, row)} 
                                    className="text-gray-400 hover:text-brand-primary p-2 rounded-lg hover:bg-brand-lightest/50 transition-colors"
                                    title="Edit Row"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => handleStartDelete(index)} 
                                    className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                    title="Delete Row"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              )}
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
                    <button onClick={handleStartAdd} className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-sm font-semibold shadow-sm">
                      <Plus className="w-4 h-4" /> Add Record
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>

      {/* Add Record Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-brand-primary" /> Add New {activeTab === 'services.xlsx' ? 'Service' : 'Record'}
              </h2>
              <button onClick={handleCancelAdd} className="text-gray-400 hover:text-gray-600 transition-colors">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 flex-grow">
              {Object.keys(newRowData).map((key) => (
                <div key={key} className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">{key}</label>
                  {key.toLowerCase().includes('description') || key.toLowerCase().includes('content') || key.toLowerCase().includes('details') ? (
                    <textarea
                      value={newRowData[key] ?? ''}
                      onChange={(e) => handleNewRowCellChange(key, e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:bg-white transition-all h-24 resize-y font-medium"
                      placeholder={`Enter ${key}...`}
                    />
                  ) : (
                    <input
                      type="text"
                      value={newRowData[key] ?? ''}
                      onChange={(e) => handleNewRowCellChange(key, e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:bg-white transition-all font-semibold"
                      placeholder={`Enter ${key}...`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={handleCancelAdd} 
                className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl text-sm hover:bg-gray-50 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmAdd} 
                className="px-5 py-2.5 bg-brand-primary text-white font-bold rounded-xl text-sm hover:bg-brand-dark transition-colors shadow-md"
              >
                Confirm Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-gray-100 overflow-hidden p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-4 text-red-600 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Delete Record</h3>
                <p className="text-sm text-gray-500 font-medium">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6 font-medium">
              Are you sure you want to delete this {activeTab === 'services.xlsx' ? 'service' : 'record'}?
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={handleCancelDelete} 
                className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl text-sm hover:bg-gray-50 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmDelete} 
                className="px-5 py-2.5 bg-red-500 text-white font-bold rounded-xl text-sm hover:bg-red-600 transition-colors shadow-md"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
