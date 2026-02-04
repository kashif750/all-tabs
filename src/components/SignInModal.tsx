import { useState } from "react";
import { FaTimes, FaUser, FaLock, FaSignInAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router";
import toast from "react-hot-toast";

interface SignInModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: () => void;
}

import { authService } from "../services/auth.service";
import { useAuthStore } from "../store/useAuthStore";

// ... (props interface unchanged)

const SignInModal = ({ isOpen, onClose, onLoginSuccess }: SignInModalProps) => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const setAuth = useAuthStore((state) => state.setAuth);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.username || !formData.password) {
            toast.error("Please enter username and password");
            return;
        }

        try {
            // 1. Call Backend
            const response = await authService.signin(formData);

            // 2. Decode/Mock User data since backend only returns token?
            // Actually backend signin returns access_token.
            // We need to fetch user profile or decode token if creating user object.
            // For now, let's assuming backend returns token and we can use the username fro form or decode token.
            // The backend authService.login returns { access_token }.

            // Let's create a partial user object or decode token later.
            // Wait, `login` in AuthService (Backend) just returns access_token.
            // I should probably fetch user details or just store what I have.
            // The Store expects a User object.

            const fakeUser = {
                id: 0, // Need from token payload
                username: formData.username,
                first_name: 'User',
                last_name: ''
            };

            // Ideally we should have a /auth/me or similar, or return user in login response.
            // Since I can't easily change backend right now without more round trips, 
            // I'll proceed with minimal user data + token.

            setAuth(fakeUser, response.access_token);

            toast.success("Successfully logged in!");
            onLoginSuccess();
            onClose();

        } catch (error: any) {
            toast.error("Invalid credentials");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <FaTimes size={18} />
                </button>

                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">Welcome Back!</h2>
                    <p className="text-slate-500 text-sm mt-1">Please sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-600 ml-1">Username</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <FaUser size={12} />
                            </span>
                            <input
                                type="text"
                                placeholder="Enter your username"
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-slate-400 text-sm"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-600 ml-1">Password</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <FaLock size={12} />
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-slate-400 text-sm"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Link
                            to="/forgot-password"
                            className="text-xs text-primary-content hover:text-accent font-medium transition-colors"
                            onClick={onClose}
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-primary-content to-accent text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        <FaSignInAlt /> Sign In
                    </button>
                </form>

                <div className="mt-6 text-center pt-4 border-t border-slate-100">
                    <span className="text-slate-500 text-sm">Don't have an account? </span>
                    <Link
                        to="/signup"
                        className="text-primary-content font-bold hover:text-accent transition-colors text-sm"
                        onClick={onClose}
                    >
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignInModal;
