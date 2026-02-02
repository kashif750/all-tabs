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
    // ---- DATA MIGRATION & INIT ----
    const [categories, setCategories] = useState<any[]>(() => {
        const saved = localStorage.getItem('portal_data');
        let initialData = [];
        if (saved) {
            initialData = JSON.parse(saved);
        } else {
            // Migration
            const oldBookmarks = localStorage.getItem('portal_bookmarks');
            if (oldBookmarks) {
                const parsedOld = JSON.parse(oldBookmarks);
                initialData = [{
                    id: 'default',
                    name: 'General',
                    bookmarks: parsedOld,
                }];
            } else {
                // Fresh Start
                initialData = [{
                    id: 'default',
                    name: 'General',
                    bookmarks: [
                        {
                            id: '1',
                            label: 'Google',
                            url: 'https://www.google.com',
                            username: '',
                            password: '',
                            isStarred: true,
                        }
                    ]
                }];
            }
        }

        if (!initialData.find((c: any) => c.id === 'dashboard')) {
            initialData.push({
                id: 'dashboard',
                name: 'Dashboard',
                bookmarks: []
            });
        }
        return initialData;
    });

    const [selectedCategoryId, setSelectedCategoryId] = useState<string>('dashboard');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSignInOpen, setIsSignInOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [bookmarkToDelete, setBookmarkToDelete] = useState<string | null>(null);
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
    const [editingBookmark, setEditingBookmark] = useState<any | null>(null);

    // Sync to local storage
    useEffect(() => {
        localStorage.setItem('portal_data', JSON.stringify(categories));
    }, [categories]);

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

    let activeCategoryTitle = "";
    let activeCategoryBookmarks: any[] = [];
    let isDashboardView = selectedCategoryId === 'dashboard';

    if (isDashboardView) {
        activeCategoryTitle = "Dashboard";
        const dashboardCat = categories.find(c => c.id === 'dashboard');
        const dashboardItems = dashboardCat ? dashboardCat.bookmarks.map((b: any) => ({ ...b, _categoryId: 'dashboard' })) : [];

        const otherCats = categories.filter(c => c.id !== 'dashboard');
        const starredItems = otherCats.flatMap(cat =>
            cat.bookmarks.filter((b: any) => b.isStarred).map((b: any) => ({ ...b, _categoryId: cat.id }))
        );

        activeCategoryBookmarks = [...dashboardItems, ...starredItems];

    } else {
        const cat = categories.find(c => c.id === selectedCategoryId);
        if (cat) {
            activeCategoryTitle = cat.name;
            activeCategoryBookmarks = cat.bookmarks.map((b: any) => ({ ...b, _categoryId: cat.id }));
        } else if (categories.length > 0) {
            setSelectedCategoryId('dashboard');
        }
    }

    // Filter by search
    let displayedBookmarks = activeCategoryBookmarks.filter((item: any) =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.url.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // SORTING: 
    // In Dashboard: Auto-sort (Starred first, A-Z)
    // In Categories: MANUAL ORDER (DnD, so no auto-sort)

    if (isDashboardView) {
        displayedBookmarks.sort((a: any, b: any) => {
            const aImportant = a.isStarred || a._categoryId === 'dashboard';
            const bImportant = b.isStarred || b._categoryId === 'dashboard';
            if (aImportant !== bImportant) {
                return aImportant ? -1 : 1;
            }
            return a.label.localeCompare(b.label);
        });
    }

    // ---- ACTIONS ----

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (isDashboardView || searchQuery) return;

        if (active.id !== over?.id) {
            setCategories((prev) => {
                return prev.map(cat => {
                    if (cat.id === selectedCategoryId) {
                        const oldIndex = cat.bookmarks.findIndex((b: any) => b.id === active.id);
                        const newIndex = cat.bookmarks.findIndex((b: any) => b.id === over?.id);

                        if (oldIndex !== -1 && newIndex !== -1) {
                            return {
                                ...cat,
                                bookmarks: arrayMove(cat.bookmarks, oldIndex, newIndex)
                            };
                        }
                    }
                    return cat;
                });
            });
        }
    };

    const handleSaveBookmark = (data: any, targetCategoryId: string) => {
        if (editingBookmark) {
            // --- UPDATE EXISTING ---
            setCategories(prev => {
                const updatedBookmark = { ...editingBookmark, ...data }; // Merge new data

                // Find where it lives currently
                const currentCat = prev.find(c => c.bookmarks.some((b: any) => b.id === editingBookmark.id));
                const currentCatId = currentCat?.id;

                if (!currentCatId) return prev;

                if (currentCatId === targetCategoryId) {
                    // Update in place (preserve order)
                    return prev.map(cat => {
                        if (cat.id === currentCatId) {
                            return {
                                ...cat,
                                bookmarks: cat.bookmarks.map((b: any) => b.id === editingBookmark.id ? updatedBookmark : b)
                            };
                        }
                        return cat;
                    });
                } else {
                    // Move Category
                    // 1. Remove from Old
                    const tempState = prev.map(cat => {
                        if (cat.id === currentCatId) {
                            return { ...cat, bookmarks: cat.bookmarks.filter((b: any) => b.id !== editingBookmark.id) };
                        }
                        return cat;
                    });

                    // 2. Add to New (End of list)
                    return tempState.map(cat => {
                        if (cat.id === targetCategoryId) {
                            return { ...cat, bookmarks: [...cat.bookmarks, updatedBookmark] };
                        }
                        return cat;
                    });
                }
            });
            setEditingBookmark(null);

        } else {
            // --- CREATE NEW ---
            const newBookmark = {
                ...data,
                id: Date.now().toString(),
                isStarred: false
            };

            setCategories(prev => prev.map(cat => {
                if (cat.id === targetCategoryId) {
                    return { ...cat, bookmarks: [...cat.bookmarks, newBookmark] };
                }
                return cat;
            }));
        }
        setIsModalOpen(false);
    };

    const handleEditBookmark = (data: any) => {
        setEditingBookmark(data);
        setIsModalOpen(true);
    };

    const handleAddClick = () => {
        setEditingBookmark(null); // Clear edit mode
        setIsModalOpen(true);
    }

    const handleToggleStar = (bookmarkId: string) => {
        setCategories(prev => prev.map(cat => ({
            ...cat,
            bookmarks: cat.bookmarks.map((b: any) => {
                if (b.id === bookmarkId) {
                    return { ...b, isStarred: !b.isStarred };
                }
                return b;
            })
        })));
    };

    const handleDeleteRequest = (id: string) => {
        setBookmarkToDelete(id);
    };

    const confirmDeleteAction = () => {
        if (!bookmarkToDelete) return;

        const ownerCat = categories.find(c => c.bookmarks.some((b: any) => b.id === bookmarkToDelete));
        if (!ownerCat) {
            setBookmarkToDelete(null);
            return;
        }

        if (ownerCat.id === 'dashboard') {
            setCategories(prev => prev.map(cat => {
                if (cat.id === 'dashboard') {
                    return { ...cat, bookmarks: cat.bookmarks.filter((b: any) => b.id !== bookmarkToDelete) };
                }
                return cat;
            }));
        } else {
            if (isDashboardView) {
                handleToggleStar(bookmarkToDelete);
            } else {
                setCategories(prev => prev.map(cat => {
                    if (cat.id === ownerCat.id) {
                        return { ...cat, bookmarks: cat.bookmarks.filter((b: any) => b.id !== bookmarkToDelete) };
                    }
                    return cat;
                }));
            }
        }
        setBookmarkToDelete(null);
    };


    const handleAddCategory = (name: string) => {
        const newCat = {
            id: Date.now().toString(),
            name,
            bookmarks: []
        };
        setCategories(prev => [...prev, newCat]);
        setSelectedCategoryId(newCat.id);
    };

    const handleDeleteCategory = (id: string) => {
        if (id === 'dashboard') return;

        if (categories.filter(c => c.id !== 'dashboard').length <= 1) {
            alert("You must have at least one user category.");
            return;
        }
        setCategories(prev => prev.filter(c => c.id !== id));
        if (selectedCategoryId === id) setSelectedCategoryId('dashboard');
    };

    const sidebarCategories = categories.filter(c => c.id !== 'dashboard');
    const modalCategories = categories;

    // DnD is enabled only if NOT dashboard and NO search query
    const isDndEnabled = !isDashboardView && !searchQuery;

    // Calculate initial category for Modal
    let modalInitialCategory = selectedCategoryId;
    if (editingBookmark) {
        const found = categories.find(c => c.bookmarks.some((b: any) => b.id === editingBookmark.id));
        if (found) modalInitialCategory = found.id;
    } else if (selectedCategoryId === 'dashboard') {
        // If Adding new in Dashboard, default to Dashboard category
        modalInitialCategory = 'dashboard';
    }

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
                    categories={sidebarCategories}
                    selectedCategoryId={selectedCategoryId}
                    onSelectCategory={(id) => {
                        setSelectedCategoryId(id);
                        if (window.innerWidth < 768) setIsSidebarOpen(false); // Close on selection on mobile
                    }}
                    onAddCategory={handleAddCategory}
                    onDeleteCategory={(id) => setCategoryToDelete(id)}
                />
            </div>

            <main className="flex-1 flex flex-col h-full overflow-hidden relative w-full">
                <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 px-4 md:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0 z-10 w-full">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden text-slate-500">
                            <FaBars />
                        </button>
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">{activeCategoryTitle}</h1>
                            <p className="text-xs text-slate-400">
                                {activeCategoryBookmarks.length || 0} bookmarks
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative group w-full md:w-64">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-content transition-colors" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {isLoggedIn ? (
                            <button
                                onClick={() => setIsProfileOpen(true)}
                                className="w-9 h-9 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold text-sm shadow-md hover:shadow-lg transition-all"
                                title="My Profile"
                            >
                                JD
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsSignInOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-primary-content hover:bg-primary/10 rounded-full transition-all text-sm font-semibold whitespace-nowrap"
                            >
                                <FaUser size={12} /> Sign In
                            </button>
                        )}

                        <button
                            onClick={handleAddClick}
                            className="flex items-center gap-2 px-4 py-2 bg-primary-content text-white rounded-full hover:bg-sky-700 shadow-md hover:shadow-lg active:scale-95 transition-all text-sm font-medium whitespace-nowrap"
                        >
                            <FaPlus size={12} /> Add New
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-7xl mx-auto">

                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={displayedBookmarks.map((b: any) => b.id)}
                                strategy={rectSortingStrategy}
                                disabled={!isDndEnabled}
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-1.5 md:gap-2.5 pb-20">
                                    {displayedBookmarks.map((item: any) => (
                                        <SortableBookmarkItem
                                            key={item.id}
                                            {...item}
                                            onDelete={() => handleDeleteRequest(item.id)}
                                            onToggleStar={handleToggleStar}
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
                            </SortableContext>
                        </DndContext>

                        {displayedBookmarks.length === 0 && (
                            <div className="text-center py-20">
                                <p className="text-slate-400 text-sm">No bookmarks found.</p>
                            </div>
                        )}
                    </div>
                </div>

            </main>

            <AddBookmarkModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingBookmark(null); }}
                onSave={handleSaveBookmark}
                categories={modalCategories}
                initialCategoryId={modalInitialCategory}
                initialData={editingBookmark}
            />

            <ConfirmModal
                isOpen={!!bookmarkToDelete}
                title={isDashboardView && categories.find(c => c.bookmarks.some((b: any) => b.id === bookmarkToDelete))?.id !== 'dashboard'
                    ? "Remove from Dashboard?"
                    : "Delete Bookmark?"
                }
                message={isDashboardView && categories.find(c => c.bookmarks.some((b: any) => b.id === bookmarkToDelete))?.id !== 'dashboard'
                    ? "This will remove the bookmark from the Dashboard view. It will remain in its original category."
                    : "Are you sure you want to delete this bookmark? This action cannot be undone."
                }
                isDangerous={true}
                confirmText={isDashboardView && categories.find(c => c.bookmarks.some((b: any) => b.id === bookmarkToDelete))?.id !== 'dashboard'
                    ? "Remove"
                    : "Delete"
                }
                onClose={() => setBookmarkToDelete(null)}
                onConfirm={confirmDeleteAction}
            />

            <ConfirmModal
                isOpen={!!categoryToDelete}
                title="Delete Category?"
                message="This will permanently delete this category and all bookmarks inside it. This action cannot be undone."
                isDangerous={true}
                confirmText="Delete Category"
                onClose={() => setCategoryToDelete(null)}
                onConfirm={() => {
                    if (categoryToDelete) {
                        handleDeleteCategory(categoryToDelete);
                        setCategoryToDelete(null);
                    }
                }}
            />

            <SignInModal
                isOpen={isSignInOpen}
                onClose={() => setIsSignInOpen(false)}
                onLoginSuccess={() => {
                    setIsLoggedIn(true);
                }}
            />

            <ProfileModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                onLogout={() => {
                    setIsLoggedIn(false);
                    toast.success("Logged out successfully");
                }}
            />
        </div>
    )
}

export default Main;
