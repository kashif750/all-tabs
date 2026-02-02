import { useState } from "react";
import { FaFolder, FaPlus, FaTrash, FaThLarge } from "react-icons/fa";
import logo from "../assets/logo.svg";

interface Category {
    id: string;
    name: string;
    bookmarks: any[];
}

interface SidebarProps {
    categories: Category[];
    selectedCategoryId: string;
    onSelectCategory: (id: string) => void;
    onAddCategory: (name: string) => void;
    onDeleteCategory: (id: string) => void;
}

const Sidebar = ({ categories, selectedCategoryId, onSelectCategory, onAddCategory, onDeleteCategory }: SidebarProps) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newCategoryName.trim()) {
            onAddCategory(newCategoryName);
            setNewCategoryName("");
            setIsAdding(false);
        }
    };

    return (
        <aside className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col shrink-0">
            <div className="p-6">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <img src={logo} alt="Logo" className="w-8 h-8" /> All Tabs
                </h2>
            </div>

            <div className="flex-1 overflow-y-auto px-4 space-y-1">
                {/* Dashboard Static Item */}
                <div
                    className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all mb-4 ${selectedCategoryId === 'dashboard'
                        ? "bg-primary text-primary-content shadow-sm"
                        : "text-slate-600 hover:bg-slate-50"
                        }`}
                    onClick={() => onSelectCategory('dashboard')}
                >
                    <div className="flex items-center gap-3 truncate">
                        <FaThLarge size={14} className={selectedCategoryId === 'dashboard' ? 'opacity-100' : 'opacity-70'} />
                        <span className="font-medium truncate">Dashboard</span>
                    </div>
                </div>

                <div className="px-3 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Categories
                </div>

                {categories.map((category) => (
                    <div
                        key={category.id}
                        className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${selectedCategoryId === category.id
                            ? "bg-primary text-primary-content shadow-sm"
                            : "text-slate-600 hover:bg-slate-50"
                            }`}
                        onClick={() => onSelectCategory(category.id)}
                    >
                        <div className="flex items-center gap-3 truncate">
                            <span className={`text-sm ${selectedCategoryId === category.id ? "opacity-100" : "opacity-50"}`}>
                                {category.bookmarks.length}
                            </span>
                            <span className="font-medium truncate">{category.name}</span>
                        </div>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeleteCategory(category.id);
                            }}
                            className={`p-1.5 rounded-full hover:bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer ${selectedCategoryId === category.id ? "text-primary-content" : "text-slate-400 hover:text-red-500"
                                }`}
                            title="Delete Category"
                        >
                            <FaTrash size={12} />
                        </button>
                    </div>
                ))}
            </div>

            <div className="p-4 border-t border-slate-100">
                {isAdding ? (
                    <form onSubmit={handleSubmit} className="space-y-2">
                        <input
                            autoFocus
                            type="text"
                            placeholder="Category Name"
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-primary"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            onBlur={() => !newCategoryName && setIsAdding(false)}
                        />
                        <div className="flex gap-2">
                            <button type="submit" className="flex-1 bg-primary text-primary-content text-xs py-1.5 rounded font-medium">Add</button>
                            <button type="button" onClick={() => setIsAdding(false)} className="flex-1 bg-slate-100 text-slate-500 text-xs py-1.5 rounded font-medium">Cancel</button>
                        </div>
                    </form>
                ) : (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-slate-300 rounded-lg text-slate-500 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all text-sm font-medium"
                    >
                        <FaPlus size={12} /> New Category
                    </button>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
