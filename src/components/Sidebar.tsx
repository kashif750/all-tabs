import { useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import logo from "../assets/logo.svg";
import toast from "react-hot-toast";

interface Category {
    value: number;
    name: string;
}

interface SidebarProps {
    categories: Category[];
    selectedCategoryId: number;
    onSelectCategory: (id: number) => void;
    onAddCategory: (name: string) => void;
    onDeleteCategory: (id: number) => void;
}

const Sidebar = ({ categories, selectedCategoryId, onSelectCategory, onAddCategory, onDeleteCategory }: SidebarProps) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const categoriesLength = categories?.length || 0;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // debugger;
        if (newCategoryName.trim()) {
            onAddCategory(newCategoryName?.trim());
            setNewCategoryName("");
            setIsAdding(false);
        }else{
            // console.log("else ------------")
            toast.error('Category Name is required');
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
                {/* <div
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
                </div> */}

                <div className="px-3 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Categories
                </div>

                {categories.map((category) => (
                    <div
                        key={category.value}
                        className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${selectedCategoryId === category.value
                            ? "bg-primary text-primary-content shadow-sm"
                            : "text-slate-600 hover:bg-slate-50"
                            }`}
                        onClick={() => onSelectCategory(category.value)}
                    >
                        <div className="flex items-center gap-3 truncate">
                            {/* <span className={`text-sm ${selectedCategoryId === category.value ? "opacity-100" : "opacity-50"}`}>
                                {category.bookmarks.length}
                            </span> */}
                            <span className="font-medium truncate">{category.name}</span>
                        </div>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeleteCategory(category.value);
                            }}
                            className={`p-1.5 rounded-full hover:bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:cursor-not-allowed ${selectedCategoryId === category.value ? "text-primary-content" : "text-slate-400 hover:text-red-500"
                                }`}
                            title={categoriesLength===1 ? "Not Allowed" : "Delete Category"}
                            disabled={categoriesLength===1 || selectedCategoryId===category.value}
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
                            maxLength={50}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            // onBlur={() => !newCategoryName && setIsAdding(false)}
                        />
                        <div className="flex gap-2">
                            <button type="submit" className="flex-1 bg-primary text-primary-content text-xs py-1.5 rounded font-medium hover:cursor-pointer hover:text-primary-content/80">Add</button>
                            <button type="button" onClick={() => setIsAdding(false)} className="flex-1 bg-slate-100 text-slate-500 text-xs py-1.5 rounded font-medium hover:text-slate-800 hover:cursor-pointer">Cancel</button>
                        </div>
                    </form>
                ) : (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-slate-300 rounded-lg text-slate-500 hover:text-slate-800 hover:border-slate-800 hover:bg-primary transition-all text-sm font-medium hover:cursor-pointer"
                    >
                        <FaPlus size={12} /> New Category
                    </button>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
