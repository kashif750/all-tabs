import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { FaArrowLeft, FaKey, FaEnvelope } from "react-icons/fa";
import toast from "react-hot-toast";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast.error("Please enter your email address");
            return;
        }

        // Mock logic
        console.log("Reset requested for:", email);
        toast.success("Temporary password sent! Valid for 5 minutes.");

        // Redirect to Sign In (Home) after short delay
        setTimeout(() => {
            navigate("/");
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 bg-primary/20 text-primary-content rounded-full flex items-center justify-center text-2xl mx-auto mb-6">
                    <FaKey />
                </div>

                <h1 className="text-2xl font-bold text-slate-800 mb-2">Forgot Password?</h1>
                <p className="text-slate-500 text-sm mb-8">
                    Enter your email address to receive a temporary password.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                    <div className="relative text-left">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                            <FaEnvelope size={12} />
                        </span>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-slate-400 text-sm"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-primary text-primary-content font-semibold rounded-lg shadow hover:shadow-lg transition-all"
                    >
                        Send Reset Link
                    </button>
                </form>

                <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors text-sm"
                >
                    <FaArrowLeft size={12} /> Back to Sign In
                </Link>
            </div>
        </div>
    );
};

export default ForgotPassword;
