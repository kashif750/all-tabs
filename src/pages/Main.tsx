import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaBars, FaPlus, FaUser } from "react-icons/fa";
import AddBookmarkModal from "../components/AddBookmarkModal";
import BookmarkCard from "../components/BookmarkCard";
import ConfirmModal from "../components/ConfirmModal";
import ProfileModal from "../components/ProfileModal";
import Sidebar from "../components/Sidebar";
import SignInModal from "../components/SignInModal";
import { dataService } from "../services/data.service";
import { useAuthStore } from "../store/useAuthStore";

const Main = () => {
    console.log("------------- Main ---------------------");
    const { token, user: authUser, logout } = useAuthStore();
    const isLoggedIn = !!token;
    console.log("isLoggedIn:: ", isLoggedIn);

    const [categories, setCategories] = useState<any[]>([]);
    const [data, setData]=useState<any>({});

    const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
    const [isBookmarkModalOpened, setIsBookmarkModalOpened] = useState(false);
    const [isSignInOpen, setIsSignInOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [bookmarkToDelete, setBookmarkToDelete] = useState<number>(0);
    const [categoryToDelete, setCategoryToDelete] = useState<number>(0);
    const [editingBookmark, setEditingBookmark] = useState<any | null>(null);
    console.log("editingBookmark:: ", editingBookmark);

    const handleEditBookmark = (data: any) => {
        setEditingBookmark(data);
        setIsBookmarkModalOpened(true);
    };

    const handleAddClick = () => {
        setEditingBookmark(null); // Clear edit mode
        setIsBookmarkModalOpened(true);
    }

    const handleDeleteRequest = (id: number) => {
        setBookmarkToDelete(id);
    };

    const handleAddCategory = async (name: string) => {
        try {
            const newCat = await dataService.createCategory(name);
            console.log("handleAddCategory:: ", newCat);
            toast.success("Category created");
            const _newCategory={
                name: newCat.category_name,
                value: newCat.id,
            }
            setCategories((prev)=>([...prev, _newCategory]));
        } catch (e) {
            toast.error("Failed to create category");
        }
    };

    const handleDeleteCategory = async (id: number) => {
        try {
            await dataService.deleteCategory(id);
            toast.success("Category deleted");
            setCategories((prev)=>prev?.filter((itm)=>itm.value!==id));
        } catch (e) {
            toast.error("Failed to delete category");
        }
    };
    const getCategoryDropdowns = async () => {
        try {
            const response = await dataService.getCategoryDropdowns();
            console.log("getCategoryDropdowns:: ", response);
            setCategories(response || []);
            setSelectedCategoryId(response?.[0]?.value || 0);
        } catch (e) {
            toast.error("Failed to get CategoryDropdowns");
        }
    };
    const getUserBookmarks = async () => {
        try {
            const response = await dataService.getData();
            console.log("getUserBookmarks:: ", response);
            setData(response || {});
        } catch (e) {
            toast.error("Failed to get CategoryDropdowns");
        }
    };

    const handleSaveBookmark = async (data: any, targetCategoryId: number) => {
        if (!isLoggedIn) {
            toast.error("Please login to save bookmarks");
            return;
        }
        try {
            const createPayload = {
                label: data.label,
                url: data.url,
                username: data.username || null,
                password: data.password || null,
                category_id: targetCategoryId
            };
            if(editingBookmark){
                await dataService.updateBookmark(editingBookmark.id, createPayload);
            }else{
                await dataService.createBookmark(createPayload);
            }
            getUserBookmarks();
            toast.success("Bookmark created");
            setIsBookmarkModalOpened(false); 
            setEditingBookmark(null);
        } catch (error) {
            console.error(error);
            toast.error("Failed to save bookmark");
        }
    };
    
    const confirmDeleteAction = async () => {
        if (!bookmarkToDelete){
            return;
        }
        try {
            await dataService.deleteBookmark(bookmarkToDelete);
            toast.success("Bookmark deleted");
            getUserBookmarks();
        } catch (e) {
            toast.error("Failed to delete");
        }
    };
    
    useEffect(() => {
        if(isLoggedIn){
            getCategoryDropdowns();
            getUserBookmarks();
        }
    }, [isLoggedIn]);
    return (
        <div className="flex h-screen bg-secondary font-sans overflow-hidden relative">
            {isSidebarOpen && (
                <div
                    className="absolute inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <div className={`
                absolute md:static inset-y-0 left-0 z-30 
                transform transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                h-full shadow-xl bg-white
            `}>
                <Sidebar
                    categories={categories}
                    selectedCategoryId={selectedCategoryId}
                    onSelectCategory={(id:number) => {
                        setSelectedCategoryId(id);
                        if (window.innerWidth < 768) setIsSidebarOpen(false);
                    }}
                    onAddCategory={handleAddCategory}
                    onDeleteCategory={(id) => setCategoryToDelete(id)}
                    isLoggedIn={isLoggedIn}
                />
            </div>

            <main className="flex-1 flex flex-col h-full overflow-hidden relative w-full">
                <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 px-4 md:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0 z-10 w-full">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden text-slate-500">
                            <FaBars />
                        </button>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">

                        {isLoggedIn ? (
                            <button
                                onClick={() => setIsProfileOpen(true)}
                                className="w-9 h-9 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer capitalize"
                                title="My Profile"
                            >
                                {authUser?.first_name?.charAt(0) || <FaUser />}
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsSignInOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-primary-content hover:bg-primary/10 rounded-full transition-all text-sm font-semibold whitespace-nowrap cursor-pointer"
                            >
                                <FaUser size={12} /> Sign In
                            </button>
                        )}

                        <button
                            onClick={handleAddClick}
                            title={"Add New Bookmark"}
                            disabled={!isLoggedIn}
                            className="flex items-center gap-2 px-4 py-2 bg-primary-content text-white rounded-full hover:bg-sky-700 shadow-md hover:shadow-lg active:scale-95 transition-all text-sm font-medium whitespace-nowrap cursor-pointer disabled:cursor-not-allowed disabled:active:scale-100"
                        >
                            <FaPlus size={12} /> Add New BookMark
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-1.5 md:gap-2.5 pb-20">
                            {data?.[selectedCategoryId]?.map((item: any) => (
                                <BookmarkCard
                                    key={item.id}
                                    {...item}
                                    onDelete={() => handleDeleteRequest(item.id)}
                                    onEdit={handleEditBookmark}
                                />
                            ))}

                            <button
                                onClick={handleAddClick}
                                disabled={!isLoggedIn}
                                className="group flex gap-2 py-2 items-center justify-center bg-white/40 border-2 border-dashed border-slate-300 rounded-xl hover:border-primary transition-all cursor-pointer disabled:cursor-not-allowed"
                            >
                                <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-white flex items-center justify-center text-slate-400 group-hover:text-primary-content group-hover:shadow-md transition-all">
                                    <FaPlus size={16} />
                                </div>
                                <span className="text-sm text-slate-500 group-hover:text-primary-content font-medium">Add Bookmark</span>
                            </button>
                        </div>

                        {(data?.[selectedCategoryId] || []).length === 0 && (
                            <div className="text-center py-20">
                                <p className="text-slate-400 text-sm">No bookmarks found.</p>
                            </div>
                        )}
                    </div>
                </div>

            </main>

            <AddBookmarkModal
                isOpen={isBookmarkModalOpened}
                onClose={() => { setIsBookmarkModalOpened(false); setEditingBookmark(null); }}
                onSave={handleSaveBookmark}
                categories={categories}
                initialCategoryId={selectedCategoryId}
                initialData={editingBookmark}
            />

            <ConfirmModal
                isOpen={!!bookmarkToDelete}
                title={"Delete Bookmark?"}
                message={"Are you sure you want to delete this bookmark? This action cannot be undone."}
                isDangerous={true}
                confirmText={"Delete"}
                onClose={() => setBookmarkToDelete(0)}
                onConfirm={confirmDeleteAction}
            />

            <ConfirmModal
                isOpen={!!categoryToDelete}
                title="Delete Category?"
                message="This will permanently delete this category and all bookmarks inside it. This action cannot be undone."
                isDangerous={true}
                confirmText="Delete Category"
                onClose={() => setCategoryToDelete(0)}
                onConfirm={() => {
                    if (categoryToDelete) {
                        handleDeleteCategory(categoryToDelete);
                        setCategoryToDelete(0);
                    }
                }}
            />

            <SignInModal
                isOpen={isSignInOpen}
                onClose={() => setIsSignInOpen(false)}
                onLoginSuccess={() => {
                    setIsSignInOpen(false);
                }}
            />

            <ProfileModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                onLogout={() => {
                    logout();
                    toast.success("Logged out successfully");
                    setIsProfileOpen(false);
                }}
            />
        </div>
    )
}

export default Main;
