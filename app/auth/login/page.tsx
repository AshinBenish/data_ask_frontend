'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Database, Eye, EyeOff, Loader2, Mail, Lock, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { login } from '@/utils/authApi';
import Cookies from 'js-cookie';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            toast.error('Please fill in all fields');
            return;
        }
        
        const toastId = toast.loading('Authenticating...');
        try {
            setLoading(true);
            console.log("Submitting login form...");
            const response = await login(formData.email, formData.password);
            localStorage.setItem('accessToken', response.data.access);
            Cookies.set('accessToken', response.data.access, { path: '/', expires: 1 });
            router.push('/');
            toast.success('Welcome back!', { id: toastId });
        } catch (error: any) {
            // Handle Axios error properly
            if (error.response) {
                toast.error(error.response.data.detail || 'Login failed', { id: toastId });
            } else if (error.request) {
                toast.error('No response from server', { id: toastId });
            } else {
                toast.error('Something went wrong', { id: toastId });
            }
        } finally {
            setLoading(false);
        }


    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
            {/* Background Animation */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute top-40 left-40 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-1000">
                {/* Logo Section */}
                <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-1000 delay-300">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500 rounded-2xl mb-4 shadow-lg">
                        <Database className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                    <p className="text-gray-600">Sign in to your DataDash account</p>
                </div>

                {/* Login Card */}
                <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
                    <CardHeader className="space-y-1 pb-6">
                        <CardTitle className="text-2xl font-semibold text-center text-gray-900">
                            Sign In
                        </CardTitle>
                        <CardDescription className="text-center text-gray-600">
                            Enter your credentials to access your dashboard
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Email Field */}
                            <div className="space-y-2 animate-in fade-in slide-in-from-left-4 duration-700 delay-700">
                                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                    Email Address
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className="pl-10 h-12 border-gray-200 focus:border-amber-500 focus:ring-amber-500 transition-all duration-200"
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2 animate-in fade-in slide-in-from-right-4 duration-700 delay-900">
                                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        className="pl-10 pr-10 h-12 border-gray-200 focus:border-amber-500 focus:ring-amber-500 transition-all duration-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Forgot Password */}
                            <div className="flex justify-end animate-in fade-in duration-700 delay-1100">
                                <Link
                                    href="/auth/forgot-password"
                                    className="text-sm text-amber-600 hover:text-amber-700 transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-white font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-1300"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Signing In...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight className="h-4 w-4 ml-2" />
                                    </>
                                )}
                            </Button>
                        </form>

                        {/* Divider */}
                        <div className="relative animate-in fade-in duration-700 delay-1500">
                            <Separator />
                            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-gray-500">
                                OR
                            </span>
                        </div>

                        {/* Social Login */}
                        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-1700">
                            <Button
                                variant="outline"
                                className="w-full h-12 border-gray-200 hover:bg-gray-50 transition-all duration-200 transform hover:scale-[1.02]"
                            >
                                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Continue with Google
                            </Button>
                        </div>

                        {/* Sign Up Link */}
                        <div className="text-center animate-in fade-in duration-700 delay-1900">
                            <p className="text-sm text-gray-600">
                                Don't have an account?{' '}
                                <Link
                                    href="/auth/register"
                                    className="text-amber-600 hover:text-amber-700 font-medium transition-colors"
                                >
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer */}
                <div className="text-center mt-8 animate-in fade-in duration-700 delay-2100">
                    <p className="text-xs text-gray-500">
                        By signing in, you agree to our{' '}
                        <Link href="/terms" className="text-amber-600 hover:text-amber-700">Terms of Service</Link>
                        {' '}and{' '}
                        <Link href="/privacy" className="text-amber-600 hover:text-amber-700">Privacy Policy</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}