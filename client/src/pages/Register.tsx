import { useState } from 'react';
import { api } from '../lib/api';
// We don't need useAuth here because we'll redirect to login after success

export default function Register() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        if (password !== confirmPassword) {
            setError("Passwords don't match");
            setLoading(false);
            return;
        }

        try {
            const { data } = await api.api.auth.register.post({
                email,
                password
            });

            if (data && data.success) {
                setSuccess(true);
            } else {
                setError(data?.error || 'Registration failed');
            }
        } catch (err) {
            setError('Connection failed');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-xl text-center">
                    <div className="text-green-500 text-5xl mb-4">🎉</div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Account Created!</h2>
                    <p className="text-slate-600 mb-6">You can now sign in with your new account.</p>
                    <a href="/login" className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition">
                        Go to Login
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-xl border border-slate-100">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">Create Account</h1>
                    <p className="text-slate-500 mt-2">Join Smart Analyst today</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                        <input name="email" type="email" required 
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                        <input name="password" type="password" required 
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
                        <input name="confirmPassword" type="password" required 
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                        />
                    </div>

                    <button type="submit" disabled={loading}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition disabled:opacity-50">
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                    
                    <p className="text-center text-sm text-slate-500">
                        Already have an account? <a href="/login" className="text-indigo-600 hover:underline">Sign in</a>
                    </p>
                </form>
            </div>
        </div>
    );
}