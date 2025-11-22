import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  FileText, 
  Mail, 
  Calculator, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Plus,
  PlusCircle,
  Download,
  Eye,
  Trash2,
  Edit,
  Users,
  TrendingUp,
  DollarSign,
  Calendar,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { NewEntryPage } from './NewEntryPage'; // Adjust path if needed
import { PortfolioCardUpload } from './PortfolioCardUpload';
import OfferLetterGeneratorExternal from './offer-letter';
import { checkConnection } from '@/api/supabaseClient';

interface DashboardPageProps {
  onLogout: () => void;
}

export function DashboardPage({ onLogout }: DashboardPageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState({ username: '', role: '' });
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/dashboard/new-entry', icon: PlusCircle, label: 'New Entry', featured: true },
    { path: '/dashboard/portfolio-upload', icon: ImageIcon, label: 'Card Upload & Management' },
   // { path: '/dashboard/pdf-generator', icon: FileText, label: 'PDF Generator' },
    { path: '/dashboard/offer-letter', icon: Mail, label: 'Offer Letter Generator' },
   // { path: '/dashboard/quotation', icon: Calculator, label: 'Quotation Generator' },
    { path: '/dashboard/settings', icon: Settings, label: 'Settings' },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // redirect to login
      navigate("/login");
      return;
    }
    fetch("http://localhost:8000/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setUser(data); // { username, role }
      });

    // Check Supabase connection
    const verifyConnection = async () => {
      const connected = await checkConnection();
      if (!connected) {
        console.warn('Supabase is unavailable');
      }
    };
    verifyConnection();
  }, [navigate]);

  const handleLogout = () => {
    toast.success('Logged out successfully!');
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Mak Stark
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Admin Dashboard</p>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <IconComponent size={20} className="mr-3" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-4 left-4 right-4">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Navigation */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden"
                >
                  <Menu size={20} />
                </Button>
                <h1 className="ml-4 text-xl font-semibold text-gray-900 dark:text-white">
                  {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">A</span>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 text-sm">Admin</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/new-entry" element={<NewEntryPage />} />
             <Route path="/portfolio-upload" element={<PortfolioCardUpload />} />
            <Route path="/pdf-generator" element={<PDFGenerator />} />
            <Route path="/offer-letter" element={<OfferLetterGeneratorExternal />} />
            <Route path="/quotation" element={<QuotationGenerator />} />
            <Route path="/settings" element={<SettingsPanel />} />
          </Routes>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

// Dashboard Home Component
function DashboardHome() {
  const stats = [
    { title: 'Total Projects', value: '156', change: '+12%', icon: TrendingUp, color: 'text-green-600' },
    { title: 'Active Clients', value: '89', change: '+5%', icon: Users, color: 'text-blue-600' },
    { title: 'Revenue (Month)', value: '₹8.5L', change: '+18%', icon: DollarSign, color: 'text-purple-600' },
    { title: 'Upcoming Events', value: '23', change: '+3', icon: Calendar, color: 'text-orange-600' },
  ];

  const recentProjects = [
    { id: 1, name: 'Royal Wedding - Priya & Rahul', type: 'Studio', status: 'In Progress', date: '2024-01-15' },
    { id: 2, name: 'Tech Summit 2024', type: 'Production', status: 'Completed', date: '2024-01-10' },
    { id: 3, name: 'Fashion Brand Campaign', type: 'Creative Agency', status: 'Review', date: '2024-01-08' },
    { id: 4, name: 'University Merchandise', type: 'Customs', status: 'In Progress', date: '2024-01-05' },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome Back, Admin!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here's what's happening with your creative agency today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                      <p className={`text-sm ${stat.color}`}>{stat.change} from last month</p>
                    </div>
                    <div className={`p-3 rounded-lg bg-gray-100 dark:bg-gray-700`}>
                      <IconComponent size={24} className={stat.color} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
         {/* Quick Actions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button asChild className="h-20 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
              <Link to="/dashboard/new-entry" className="flex flex-col items-center justify-center">
                <Plus size={24} className="mb-2" />
                <span>Create New Entry</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-20 border-purple-300 text-purple-600 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-400 dark:hover:bg-purple-900/20">
              <Link to="/dashboard/portfolio-upload" className="flex flex-col items-center justify-center">
                <ImageIcon size={24} className="mb-2" />
                <span>Upload Card</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-20">
              <Link to="/dashboard/quotation" className="flex flex-col items-center justify-center">
                <Calculator size={24} className="mb-2" />
                <span>Generate Quote</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-20">
              <Link to="/dashboard/pdf-generator" className="flex flex-col items-center justify-center">
                <FileText size={24} className="mb-2" />
                <span>Generate PDF</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* Recent Projects */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentProjects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{project.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{project.date}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary">{project.type}</Badge>
                  <Badge 
                    variant={project.status === 'Completed' ? 'default' : 'outline'}
                    className={project.status === 'Completed' ? 'bg-green-100 text-green-800' : ''}
                  >
                    {project.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// PDF Generator Component
function PDFGenerator() {
  const [formData, setFormData] = useState({
    documentType: '',
    title: '',
    content: '',
    clientName: '',
    date: ''
  });

  const handleGenerate = () => {
    if (!formData.documentType || !formData.title || !formData.content) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('PDF generated successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>PDF Generator</CardTitle>
          <p className="text-gray-600 dark:text-gray-400">
            Generate professional PDFs for contracts, proposals, and reports.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="documentType">Document Type</Label>
              <Select value={formData.documentType} onValueChange={(value: any) => setFormData(prev => ({ ...prev, documentType: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="proposal">Proposal</SelectItem>
                  <SelectItem value="invoice">Invoice</SelectItem>
                  <SelectItem value="report">Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="clientName">Client Name</Label>
              <Input 
                id="clientName"
                value={formData.clientName}
                onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                placeholder="Enter client name"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="title">Document Title</Label>
            <Input 
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter document title"
            />
          </div>
          
          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea 
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Enter document content..."
              rows={10}
            />
          </div>
          
          <div className="flex space-x-4">
            <Button onClick={handleGenerate} className="bg-blue-600 hover:bg-blue-700">
              <Download size={16} className="mr-2" />
              Generate PDF
            </Button>
            <Button variant="outline">
              <Eye size={16} className="mr-2" />
              Preview
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Offer Letter Generator Component
function OfferLetterGenerator() {
  const [formData, setFormData] = useState({
    candidateName: '',
    position: '',
    salary: '',
    startDate: '',
    department: ''
  });

  const handleGenerate = () => {
    toast.success('Offer letter generated successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Offer Letter Generator</CardTitle>
          <p className="text-gray-600 dark:text-gray-400">
            Create professional offer letters for new team members.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="candidateName">Candidate Name</Label>
              <Input 
                id="candidateName"
                value={formData.candidateName}
                onChange={(e) => setFormData(prev => ({ ...prev, candidateName: e.target.value }))}
                placeholder="Enter candidate name"
              />
            </div>
            <div>
              <Label htmlFor="position">Position</Label>
              <Input 
                id="position"
                value={formData.position}
                onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                placeholder="Enter position"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="salary">Salary</Label>
              <Input 
                id="salary"
                value={formData.salary}
                onChange={(e) => setFormData(prev => ({ ...prev, salary: e.target.value }))}
                placeholder="Enter salary amount"
              />
            </div>
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input 
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="department">Department</Label>
            <Select value={formData.department} onValueChange={(value: any) => setFormData(prev => ({ ...prev, department: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="studio">Studio</SelectItem>
                <SelectItem value="production">Production</SelectItem>
                <SelectItem value="customs">Customs</SelectItem>
                <SelectItem value="creative-agency">Creative Agency</SelectItem>
                <SelectItem value="administration">Administration</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex space-x-4">
            <Button onClick={handleGenerate} className="bg-blue-600 hover:bg-blue-700">
              <Download size={16} className="mr-2" />
              Generate Offer Letter
            </Button>
            <Button variant="outline">
              <Eye size={16} className="mr-2" />
              Preview
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Quotation Generator Component
function QuotationGenerator() {
  const [formData, setFormData] = useState({
    clientName: '',
    projectName: '',
    service: '',
    amount: '',
    description: '',
    validUntil: ''
  });

  const handleGenerate = () => {
    toast.success('Quotation generated successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Quotation Generator</CardTitle>
          <p className="text-gray-600 dark:text-gray-400">
            Create professional quotations for client projects.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="clientName">Client Name</Label>
              <Input 
                id="clientName"
                value={formData.clientName}
                onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                placeholder="Enter client name"
              />
            </div>
            <div>
              <Label htmlFor="projectName">Project Name</Label>
              <Input 
                id="projectName"
                value={formData.projectName}
                onChange={(e) => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
                placeholder="Enter project name"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="service">Service Type</Label>
              <Select value={formData.service} onValueChange={(value: any) => setFormData(prev => ({ ...prev, service: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="studio">Studio (Wedding Photography)</SelectItem>
                  <SelectItem value="production">Production (Video & Events)</SelectItem>
                  <SelectItem value="customs">Customs (Merchandise)</SelectItem>
                  <SelectItem value="creative-agency">Creative Agency</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input 
                id="amount"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="Enter amount"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Project Description</Label>
            <Textarea 
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the project details..."
              rows={5}
            />
          </div>
          
          <div>
            <Label htmlFor="validUntil">Valid Until</Label>
            <Input 
              id="validUntil"
              type="date"
              value={formData.validUntil}
              onChange={(e) => setFormData(prev => ({ ...prev, validUntil: e.target.value }))}
            />
          </div>
          
          <div className="flex space-x-4">
            <Button onClick={handleGenerate} className="bg-blue-600 hover:bg-blue-700">
              <Download size={16} className="mr-2" />
              Generate Quotation
            </Button>
            <Button variant="outline">
              <Eye size={16} className="mr-2" />
              Preview
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Settings Component
function SettingsPanel() {
  const [settings, setSettings] = useState({
    companyName: 'Mak Stark',
    email: 'hello@makstark.com',
    phone: '+91 98765 43210',
    address: 'Haldia, West Bengal, India'
  });

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your dashboard settings and company information.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="companyName">Company Name</Label>
            <Input 
              id="companyName"
              value={settings.companyName}
              onChange={(e) => setSettings(prev => ({ ...prev, companyName: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email"
              type="email"
              value={settings.email}
              onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input 
              id="phone"
              value={settings.phone}
              onChange={(e) => setSettings(prev => ({ ...prev, phone: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea 
              id="address"
              value={settings.address}
              onChange={(e) => setSettings(prev => ({ ...prev, address: e.target.value }))}
              rows={3}
            />
          </div>
          
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}