import { useState } from "react";
import toast from "react-hot-toast";
import { FaArrowLeft, FaLock, FaUser, FaUserPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import { authService } from "../services/auth.service";

const SignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (!formData.username || !formData.password || !formData.firstName) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            // Mapping frontend keys to backend expectations (snake_case)
            const payload = {
                first_name: formData.firstName,
                last_name: formData.lastName,
                username: formData.username,
                password: formData.password,
            };

            // Assuming authService is imported
            await authService.signup(payload);

            toast.success("Account created successfully!");
            setTimeout(() => {
                navigate("/");
            }, 1500);
        } catch (error: any) {
            const message = error.response?.data?.message || "Registration failed";
            toast.error(typeof message === 'object' ? JSON.stringify(message) : message);
        }
    };

    return (
        <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 animate-in fade-in zoom-in duration-300">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary/20 text-primary-content rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                        <FaUserPlus />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">Create Account</h1>
                    <p className="text-slate-500 text-sm">Join us today! It takes less than a minute.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-600 ml-1">First Name</label>
                            <input
                                type="text"
                                placeholder="John"
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-600 ml-1">Last Name</label>
                            <input
                                type="text"
                                placeholder="Doe"
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600 ml-1">Username</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                <FaUser size={12} />
                            </span>
                            <input
                                type="text"
                                placeholder="johndoe"
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-600 ml-1">Password</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    <FaLock size={12} />
                                </span>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-600 ml-1">Confirm</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    <FaLock size={12} />
                                </span>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-primary-content to-accent text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
                    >
                        Create Account
                    </button>
                </form>

                <div className="text-center">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-sm"
                    >
                        <FaArrowLeft size={10} /> Back to Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
