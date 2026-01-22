'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateForm = () => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!password) {
      setError('Password is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      // TODO: Implement actual login API call
      console.log('Login attempt:', { email, password, rememberMe });
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1a1f35] to-[#111827] relative overflow-hidden">
      {/* Background gradient elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#0ea5e9]/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#ff6b6b]/10 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Phone Frame */}
      <div className="flex items-center justify-center min-h-screen px-4 py-8 relative z-10">
        <div className="w-full max-w-sm mx-auto bg-gradient-to-br from-[#111827] to-[#0f172a] rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10">
          {/* Status Bar */}
          <div className="h-6 bg-gradient-to-r from-[#0f172a] to-[#1a1f35] px-6 flex items-center justify-between text-xs text-white">
            <span>9:41</span>
            <div className="flex gap-1">
              <span>📶</span>
              <span>📡</span>
              <span>🔋</span>
            </div>
          </div>

          {/* Notch */}
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-40 h-7 bg-[#0f172a] rounded-b-3xl z-10" />

          {/* Content Area */}
          <div className="pt-12 pb-6 px-6 max-h-[768px] overflow-y-auto scrollbar-hide">
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#0ea5e9] via-[#06b6d4] to-[#0ea5e9] bg-clip-text text-transparent mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-400 text-sm">Sign in to your SAGIP account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Alert */}
              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm flex items-start gap-3">
                  <span className="text-lg">⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-400 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 bg-white/5 border border-white/10 rounded checked:bg-[#0ea5e9] checked:border-[#0ea5e9] cursor-pointer"
                  />
                  <span className="text-gray-400 group-hover:text-gray-300 transition-colors">Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-[#0ea5e9] hover:text-[#06b6d4] font-semibold transition-colors">
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#0ea5e9]/50 disabled:opacity-70 disabled:cursor-not-allowed transition-all mt-6"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>

              {/* Signup Link */}
              <p className="text-center text-sm text-gray-400">
                Don't have an account?{' '}
                <Link href="/signup" className="text-[#0ea5e9] hover:text-[#06b6d4] font-semibold transition-colors">
                  Create one
                </Link>
              </p>
            </form>

            {/* Demo Credentials */}
            <div className="mt-8 p-3 bg-white/5 border border-white/10 rounded-xl">
              <p className="text-xs text-gray-500 mb-2">Demo Credentials:</p>
              <p className="text-xs text-gray-400">Email: demo@sagip.ph</p>
              <p className="text-xs text-gray-400">Password: Demo@123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
