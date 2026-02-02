import { useState } from "react";
import { FaTimes, FaUser, FaSave, FaLock } from "react-icons/fa";
import toast from "react-hot-toast";

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user?: any;
    onLogout: () => void;
}

const ProfileModal = ({ isOpen, onClose, user, onLogout }: ProfileModalProps) => {
    const [formData, setFormData] = useState({
        firstName: "John",
        lastName: "Doe",
        username: "johndoe",
        password: "password123",
        confirmPassword: "password123",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        console.log("Profile Update:", formData);
        toast.success("Profile updated successfully!");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6 relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <FaTimes size={18} />
                </button>

                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-primary text-primary-content rounded-full flex items-center justify-center text-2xl mx-auto mb-3 font-bold">
                        {formData.firstName[0]}{formData.lastName[0]}
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">Your Profile</h2>
                    <p className="text-slate-500 text-sm">Manage your account settings</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-600 ml-1">First Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-600 ml-1">Last Name</label>
                            <input
                                type="text"
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
                                readOnly
                                className="w-full pl-9 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed text-sm"
                                value={formData.username}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-600 ml-1">New Password</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    <FaLock size={12} />
                                </span>
                                <input
                                    type="password"
                                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-600 ml-1">Confirm Password</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    <FaLock size={12} />
                                </span>
                                <input
                                    type="password"
                                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between gap-4">
                        <button
                            type="button"
                            onClick={() => { onLogout(); onClose(); }}
                            className="px-4 py-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors text-sm font-semibold"
                        >
                            Sign Out
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-2 bg-primary text-primary-content font-semibold rounded-lg shadow hover:shadow-lg hover:bg-primary-focus transition-all flex items-center justify-center gap-2"
                        >
                            <FaSave /> Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileModal;
