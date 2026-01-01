'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/Card';
import { Input } from '@/components/Input';
import { useAuth } from '@/lib/AuthContext';
import { Phone, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');
  const { signIn, profile } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }

    try {
      await signIn(formData.email, formData.password);
      
      // Redirect based on user role
      // Wait a bit for profile to load
      setTimeout(() => {
        if (profile?.role === 'provider') {
          router.push('/dashboard/provider');
        } else {
          router.push('/dashboard/customer');
        }
      }, 500);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-md">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Sign In</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Success Message */}
              {registered && (
                <div className="mb-4 rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-800">
                  Registration successful! Please sign in to continue.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  icon={<Phone className="h-5 w-5" />}
                  required
                />

                {/* Password */}
                <Input
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  icon={<Lock className="h-5 w-5" />}
                  required
                />

                {/* Forgot Password */}
                <div className="flex justify-end">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  isLoading={loading}
                  icon={<ArrowRight className="h-5 w-5" />}
                >
                  Sign In
                </Button>

                {/* Sign Up Links */}
                <div className="space-y-2 border-t border-gray-200 pt-4">
                  <p className="text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link href="/register/customer" className="font-medium text-primary-600 hover:text-primary-700">
                      Sign up as Customer
                    </Link>
                  </p>
                  <p className="text-center text-sm text-gray-600">
                    Or{' '}
                    <Link href="/register/provider" className="font-medium text-primary-600 hover:text-primary-700">
                      Register as Provider
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="mx-auto max-w-md">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">Loading...</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}

