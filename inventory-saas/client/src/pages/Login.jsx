import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import { fadeIn, slideInLeft, slideInRight } from '../utils/animations';

/**
 * Login Page
 * User authentication page with GSAP animations
 */
const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const leftRef = useRef(null);
  const rightRef = useRef(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Animations on mount
  useEffect(() => {
    if (leftRef.current) slideInLeft(leftRef.current, 0.2);
    if (rightRef.current) slideInRight(rightRef.current, 0.4);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-dark via-dark-light to-dark">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div ref={leftRef} className="hidden lg:block">
          <h1 className="text-5xl font-bold gradient-text mb-4">
            Welcome Back! 👋
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Sign in to manage your inventory and supply chain efficiently.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                📊
              </div>
              <div>
                <h3 className="font-semibold">Real-time Analytics</h3>
                <p className="text-sm text-gray-400">Track your inventory in real-time</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center">
                🏢
              </div>
              <div>
                <h3 className="font-semibold">Multi-Warehouse</h3>
                <p className="text-sm text-gray-400">Manage multiple locations</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                🚚
              </div>
              <div>
                <h3 className="font-semibold">Supply Chain</h3>
                <p className="text-sm text-gray-400">Complete supplier management</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div ref={rightRef} className="glass rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Sign In</h2>
            <p className="text-gray-400">Enter your credentials to continue</p>
          </div>

          {error && (
            <div className="alert alert-error mb-6">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  className="input input-bordered w-full pl-10"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  className="input input-bordered w-full pl-10"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-full btn-glow"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="divider">OR</div>

          <p className="text-center text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary hover:underline font-semibold">
              Sign Up
            </Link>
          </p>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-primary/10 rounded-lg">
            <p className="text-xs text-gray-400 mb-2">Demo Credentials:</p>
            <p className="text-xs">
              <strong>Admin:</strong> admin@demo.com / password
            </p>
            <p className="text-xs">
              <strong>Manager:</strong> manager@demo.com / password
            </p>
            <p className="text-xs">
              <strong>Staff:</strong> staff@demo.com / password
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
