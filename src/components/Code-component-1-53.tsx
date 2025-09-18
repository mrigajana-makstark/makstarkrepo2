import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, User, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Demo credentials
    if (formData.username === 'admin' && formData.password === 'makstark2024') {
      toast.success('Login successful! Welcome to Mak Stark Dashboard.');
      onLogin();
    } else {
      toast.error('Invalid credentials. Use admin/makstark2024');
    }
    
    setIsLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Ccircle cx=\'7\' cy=\'7\' r=\'1\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] bg-repeat"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Back to Home Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            asChild
            className="text-gray-400 hover:text-white"
          >
            <Link to="/">
              <ArrowLeft size={16} className="mr-2" />
              Back to Home
            </Link>
          </Button>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gray-900/80 backdrop-blur-lg border border-gray-700/50 shadow-2xl">
            <CardHeader className="text-center pb-8">
              {/* Logo */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-6"
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  Mak Stark
                </div>
                <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto mt-2 rounded-full"></div>
              </motion.div>
              
              <CardTitle className="text-2xl text-white mb-2">
                Welcome Back
              </CardTitle>
              <p className="text-gray-400">
                Sign in to access your dashboard
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username Field */}
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-white">
                    Username
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={18} className="text-gray-400" />
                    </div>
                    <Input
                      id="username"
                      type="text"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      placeholder="Enter your username"
                      required
                      className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">
                    Password
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="pl-10 pr-10 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Forgot Password Link */}
                <div className="text-right">
                  <button
                    type="button"
                    className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                    onClick={() => toast.info('Password reset functionality coming soon!')}
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 h-12 text-base font-semibold"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                      Signing In...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              {/* Demo Credentials Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg"
              >
                <p className="text-blue-200 text-sm text-center mb-2">
                  <strong>Demo Credentials:</strong>
                </p>
                <div className="text-center text-sm text-gray-400 space-y-1">
                  <div>Username: <span className="text-blue-400 font-mono">admin</span></div>
                  <div>Password: <span className="text-blue-400 font-mono">makstark2024</span></div>
                </div>
              </motion.div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-900 text-gray-400">Need access?</span>
                </div>
              </div>

              {/* Contact Admin */}
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-4">
                  Don't have an account? Contact the administrator.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    const phoneNumber = '+919876543210';
                    const message = 'Hi! I need access to the Mak Stark dashboard.';
                    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                    window.open(whatsappUrl, '_blank');
                  }}
                  className="border-gray-600 text-gray-300 hover:text-white hover:border-blue-500"
                >
                  Contact Admin
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 text-center text-gray-500 text-sm"
        >
          <p>&copy; 2024 Mak Stark. All rights reserved.</p>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-purple-500/20 rounded-full blur-xl"></div>
    </div>
  );
}