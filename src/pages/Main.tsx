import { useState, useEffect } from "react";
import { FaPlus, FaSearch, FaBars, FaUser } from "react-icons/fa";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import toast from "react-hot-toast";

import BookmarkCard from "../components/BookmarkCard";
import AddBookmarkModal from "../components/AddBookmarkModal";
import Sidebar from "../components/Sidebar";
import ConfirmModal from "../components/ConfirmModal";
import SignInModal from "../components/SignInModal";
import ProfileModal from "../components/ProfileModal";

import { useAuthStore } from "../store/useAuthStore";
import { dataService } from "../services/data.service";

// --- Sortable Wrapper ---
const SortableBookmarkItem = (props: any) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: props.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        touchAction: 'none'
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="h-full">
            <BookmarkCard {...props} />
        </div>
    );
};


const Main = () => {
    const { token, user: authUser, logout } = useAuthStore();
    const isLoggedIn = !!token;

    // ---- STATE ----
    const [categories, setCategories] = useState<any[]>([]);
    // const [bookmarks, setBookmarks] = useState<any>({}); // Store raw API bookmarks
    const [data, setData]=useState<any>({});
    const [selectedBookmarks, setSelectedBookmarks]=useState<any[]>([]);

    // Helper to build hierarchy locally for views
    // const buildCategoryTree = (cats: any[], bks: any[]) => {
    //     // Map backend categories to frontend structure
    //     // { id, name, bookmarks: [] }
    //     // Backend Category: { id, category_name }
    //     // Backend Bookmark: { id, label, url, category: { id } }

    //     const mappedCats = cats.map(c => ({
    //         id: c.id.toString(),
    //         name: c.category_name,
    //         bookmarks: bks.filter(b => b.category?.id === c.id || b.category_id === c.id).map(b => ({
    //             ...b,
    //             id: b.id.toString(),
    //             isStarred: b.isHighlighted, // Map isHighlighted -> isStarred
    //             url: b.url || '', // Safety
    //         }))
    //     }));

    //     // Add Dashboard concept
    //     // Dashboard is a virtual view, not a category in DB usually, but frontend treats it as one
    //     // Or we can just have 'Dashboard' as id='dashboard'.

    //     // Ensure Dashboard exists in list? 
    //     // Frontend logic expects 'dashboard' in categories list for Sidebar?
    //     // Yes, logic at line 89 checks format.

    //     const dashboardCat = {
    //         id: 'dashboard',
    //         name: 'Dashboard',
    //         bookmarks: [] // Populated by logic later in render
    //     };

    //     return [dashboardCat, ...mappedCats];
    // };


    const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
    const [isBookmarkModalOpened, setIsBookmarkModalOpened] = useState(false);
    const [isSignInOpen, setIsSignInOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    // const [isLoggedIn, setIsLoggedIn] = useState(false); // REPLACED by Store
    const [searchQuery, setSearchQuery] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [bookmarkToDelete, setBookmarkToDelete] = useState<number>(0);
    const [categoryToDelete, setCategoryToDelete] = useState<number>(0);
    const [editingBookmark, setEditingBookmark] = useState<any | null>(null);
    console.log("editingBookmark:: ", editingBookmark);

    // Sync to local storage -> DISABLED or Modified to only sync if guest?
    // For now disabling legacy Sync
    /*
    useEffect(() => {
        localStorage.setItem('portal_data', JSON.stringify(categories));
    }, [categories]);
    */

    // DnD Sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Require movement before drag starts
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );


    // ---- COMPUTED VIEWS ----

    // let activeCategoryTitle = "";
    // let activeCategoryBookmarks: any[] = [];
    // let isDashboardView = selectedCategoryId === 'dashboard';

    // if (isDashboardView) {
    //     activeCategoryTitle = "Dashboard";
    //     const dashboardCat = categories.find(c => c.id === 'dashboard');
    //     const dashboardItems = dashboardCat ? dashboardCat.bookmarks.map((b: any) => ({ ...b, _categoryId: 'dashboard' })) : [];

    //     const otherCats = categories.filter(c => c.id !== 'dashboard');
    //     const starredItems = otherCats.flatMap(cat =>
    //         cat.bookmarks.filter((b: any) => b.isStarred).map((b: any) => ({ ...b, _categoryId: cat.id }))
    //     );

    //     activeCategoryBookmarks = [...dashboardItems, ...starredItems];

    // } else {
    //     const cat = categories.find(c => c.id === selectedCategoryId);
    //     if (cat) {
    //         activeCategoryTitle = cat.name;
    //         activeCategoryBookmarks = cat.bookmarks.map((b: any) => ({ ...b, _categoryId: cat.id }));
    //     } else if (categories.length > 0) {
    //         setSelectedCategoryId('dashboard');
    //     }
    // }

    // Filter by search
    // let displayedBookmarks = activeCategoryBookmarks.filter((item: any) =>
    //     item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //     item.url.toLowerCase().includes(searchQuery.toLowerCase())
    // );

    // SORTING: 
    // In Dashboard: Auto-sort (Starred first, A-Z)
    // In Categories: MANUAL ORDER (DnD, so no auto-sort)

    // if (isDashboardView) {
    //     displayedBookmarks.sort((a: any, b: any) => {
    //         const aImportant = a.isStarred || a._categoryId === 'dashboard';
    //         const bImportant = b.isStarred || b._categoryId === 'dashboard';
    //         if (aImportant !== bImportant) {
    //             return aImportant ? -1 : 1;
    //         }
    //         return a.label.localeCompare(b.label);
    //     });
    // }

    // ---- ACTIONS ----

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        // if (isDashboardView || searchQuery) return;

        // if (active.id !== over?.id) {
        //     setCategories((prev) => {
        //         return prev.map(cat => {
        //             if (cat.id === selectedCategoryId) {
        //                 const oldIndex = cat.bookmarks.findIndex((b: any) => b.id === active.id);
        //                 const newIndex = cat.bookmarks.findIndex((b: any) => b.id === over?.id);

        //                 if (oldIndex !== -1 && newIndex !== -1) {
        //                     return {
        //                         ...cat,
        //                         bookmarks: arrayMove(cat.bookmarks, oldIndex, newIndex)
        //                     };
        //                 }
        //             }
        //             return cat;
        //         });
        //     });
        // }
    };

    const handleEditBookmark = (data: any) => {
        setEditingBookmark(data);
        setIsBookmarkModalOpened(true);
    };

    const handleAddClick = () => {
        setEditingBookmark(null); // Clear edit mode
        setIsBookmarkModalOpened(true);
    }

    // const handleToggleStar = async (bookmarkId: string) => {
    //     // Find current state
    //     let currentStatus = false;
    //     categories.forEach(c => {
    //         const b = c.bookmarks.find((bk: any) => bk.id === bookmarkId);
    //         if (b) currentStatus = b.isStarred;
    //     });

    //     try {
    //         await dataService.updateBookmark(parseInt(bookmarkId), { isHighlighted: !currentStatus });
    //         // Optimistic update or fetch? fetch for now easiest
    //         fetchData();
    //     } catch (e) {
    //         toast.error("Failed to update");
    //     }
    // };

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
            // await fetchData();
            // setSelectedCategoryId(newCat.id.toString());
        } catch (e) {
            toast.error("Failed to create category");
        }
    };

    const handleDeleteCategory = async (id: number) => {
        // if (id === 'dashboard') return;

        // if (categories.filter(c => c.id !== 'dashboard').length <= 1) {
        //     // alert("You must have at least one user category.");
        //     // Actually let's allow deleting even if last, or keep restricted.
        // }

        try {
            await dataService.deleteCategory(id);
            toast.success("Category deleted");
            setCategories((prev)=>prev?.filter((itm)=>itm.value!==id));
            // await fetchData();
            // if (selectedCategoryId === id) setSelectedCategoryId('dashboard');
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
            // setCategories(response || []);
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
                // isHighlighted: false,
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
        if (!bookmarkToDelete) return;

        // const ownerCat = categories.find(c => c.bookmarks.some((b: any) => b.id === bookmarkToDelete));
        // if (!ownerCat) {
        //     setBookmarkToDelete(0);
        //     return;
        // }

        // if (ownerCat.id === 'dashboard') {
        //     // Dashboard delete logic is purely frontend view usually, but here 
        //     // the user might mean "unstar" if it's there via Star.
        //     // If it's a DIRECT dashboard bookmark (not implemented in backend yet, assume all have categories),
        //     // then it's just removing from view?

        //     // Backend architecture: Bookmarks MUST belong to a Category. 
        //     // So "Deleting from Dashboard" usually means "Unstar" if it's there because of star.
        //     // Or if we have a "Dashboard" category in DB.

        //     // For now, simpler logic: If it's starred, unstar.
        //     await handleToggleStar(bookmarkToDelete);

        // } else {
        //     // Permanently delete
            try {
                await dataService.deleteBookmark(bookmarkToDelete);
                toast.success("Bookmark deleted");
                getUserBookmarks();
                // fetchData();
            } catch (e) {
                toast.error("Failed to delete");
            }
        // }
        // setBookmarkToDelete(0);
    };

    // const sidebarCategories = categories.filter(c => c.id !== 'dashboard');
    // const modalCategories = categories.filter(c => c.id !== 'dashboard'); // Hide Dashboard from add modal

    // DnD is enabled only if NOT dashboard and NO search query
    // NOTE: Backend doesn't support reordering yet.
    // So DnD will visually work but not persist order to backend unless we add 'order' field.
    // Disabling DnD for now or just keeping it local-only (useless on refresh).
    // const isDndEnabled = false; // !isDashboardView && !searchQuery;

    // Calculate initial category for Modal
    // let modalInitialCategory = selectedCategoryId;
    // if (editingBookmark) {
    //     const found = categories.find(c => c.bookmarks.some((b: any) => b.id === editingBookmark.id));
    //     if (found) modalInitialCategory = found.id;
    // } else if (selectedCategoryId === 'dashboard') {
    //     // If Adding new in Dashboard, default to first category?
    //     // or let modal handle it.
    //     if (modalCategories.length > 0) modalInitialCategory = modalCategories[0].id;
    // }
    
    useEffect(() => {
        if(isLoggedIn){
            getCategoryDropdowns();
            getUserBookmarks();
        }
    }, [isLoggedIn]);
    return (
        <div className="flex h-screen bg-secondary font-sans overflow-hidden relative">
            {/* Mobile Sidebar Overlay Backdrop */}
            {isSidebarOpen && (
                <div
                    className="absolute inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
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
                        if (window.innerWidth < 768) setIsSidebarOpen(false); // Close on selection on mobile
                    }}
                    onAddCategory={handleAddCategory}
                    onDeleteCategory={(id) => setCategoryToDelete(id)}
                    // onDeleteCategory={(id) => handleDeleteCategory(id)}
                />
            </div>

            <main className="flex-1 flex flex-col h-full overflow-hidden relative w-full">
                <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 px-4 md:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0 z-10 w-full">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden text-slate-500">
                            <FaBars />
                        </button>
                        {/* <div>
                            <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">{activeCategoryTitle}</h1>
                            <p className="text-xs text-slate-400">
                                {activeCategoryBookmarks.length || 0} bookmarks
                            </p>
                        </div> */}
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        {/* <div className="relative group w-full md:w-64">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-content transition-colors" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div> */}

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
                            className="flex items-center gap-2 px-4 py-2 bg-primary-content text-white rounded-full hover:bg-sky-700 shadow-md hover:shadow-lg active:scale-95 transition-all text-sm font-medium whitespace-nowrap cursor-pointer"
                        >
                            <FaPlus size={12} /> Add New BookMark
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-7xl mx-auto">

                        {/* <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={displayedBookmarks.map((b: any) => b.id)}
                                strategy={rectSortingStrategy}
                                disabled={!isDndEnabled}
                            > */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-1.5 md:gap-2.5 pb-20">
                                    {/* {displayedBookmarks.map((item: any) => (
                                        <SortableBookmarkItem
                                            key={item.id}
                                            {...item}
                                            onDelete={() => handleDeleteRequest(item.id)}
                                            onToggleStar={handleToggleStar}
                                            onEdit={handleEditBookmark}
                                        />
                                    ))} */}
                                    {data?.[selectedCategoryId]?.map((item: any) => (
                                        <BookmarkCard
                                            key={item.id}
                                            {...item}
                                            onDelete={() => handleDeleteRequest(item.id)}
                                            // onToggleStar={handleToggleStar}
                                            onEdit={handleEditBookmark}
                                        />
                                    ))}

                                    <button
                                        onClick={handleAddClick}
                                        className="group flex gap-2 py-2 items-center justify-center bg-white/40 border-2 border-dashed border-slate-300 rounded-xl hover:border-primary transition-all cursor-pointer"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-white flex items-center justify-center text-slate-400 group-hover:text-primary-content group-hover:shadow-md transition-all">
                                            <FaPlus size={16} />
                                        </div>
                                        <span className="text-sm text-slate-500 group-hover:text-primary-content font-medium">Add Bookmark</span>
                                    </button>
                                </div>
                            {/* </SortableContext>
                        </DndContext> */}

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
                    // setIsLoggedIn(true); // Handled by Store now
                    // Just force fetch
                    // fetch will run because token changed (useEffect dependency needs to be updated or reload)
                    // useEffect depends on isLoggedIn = !!token. So it will run.
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
