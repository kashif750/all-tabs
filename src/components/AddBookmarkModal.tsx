import { useState, useEffect } from "react";
import { FaTimes, FaGlobe, FaLock, FaUser } from "react-icons/fa";

interface AddBookmarkModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any, categoryId: string) => void;
    categories: { id: string; name: string }[];
    initialCategoryId: string;
    initialData?: any; // For editing
}

const AddBookmarkModal = ({ isOpen, onClose, onSave, categories, initialCategoryId, initialData }: AddBookmarkModalProps) => {
    const [formData, setFormData] = useState({
        label: "",
        url: "",
        username: "",
        password: "",
    });
    const [selectedCategoryId, setSelectedCategoryId] = useState(initialCategoryId);

    const isEditMode = !!initialData;

    // Reset form when modal opens or initialData changes
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    label: initialData.label || "",
                    url: initialData.url || "",
                    username: initialData.username || "",
                    password: initialData.password || "",
                });
                // If editing, we might want to set category to item's current location? 
                // The parent passes initialCategoryId which should probably be the item's category or current view.
                // If item has _categoryId, we could use that if passed. But let's rely on parent passing correct initialCategoryId.
                setSelectedCategoryId(initialCategoryId);
            } else {
                // Add Mode
                setFormData({ label: "", url: "", username: "", password: "" });
                setSelectedCategoryId(initialCategoryId);
            }
        }
    }, [isOpen, initialData, initialCategoryId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData, selectedCategoryId);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <FaTimes size={20} />
                </button>

                <h2 className="text-2xl font-bold mb-6 text-slate-800">
                    {isEditMode ? "Edit Portal" : "Add New Portal"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Category Select - Disable in Edit Mode? Or allow moving? 
              User request didn't specify. Moving via edit is nice. 
              Let's allow it.
          */}
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-600 ml-1">Category</label>
                        <select
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-slate-700 appearance-none cursor-pointer"
                            value={selectedCategoryId}
                            onChange={(e) => setSelectedCategoryId(e.target.value)}
                        >
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-600 ml-1">Label</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <FaGlobe />
                            </span>
                            <input
                                type="text"
                                placeholder="e.g. Workflow Portal"
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-slate-400"
                                value={formData.label}
                                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-600 ml-1">URL</label>
                        <div className="relative">
                            <span className="absolute left-4 top-3.5 text-slate-400 font-mono text-xs">
                                https://
                            </span>
                            <input
                                type="text"
                                placeholder="example.com"
                                className="w-full pl-16 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-slate-400"
                                value={formData.url}
                                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-slate-600 ml-1">Username</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <FaUser size={12} />
                                </span>
                                <input
                                    type="text"
                                    placeholder="Optional"
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
                                    type="text"
                                    placeholder="Optional"
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-slate-400 text-sm"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-primary-content to-accent text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all mt-6"
                    >
                        {isEditMode ? "Save Changes" : "Add Portal"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddBookmarkModal;
