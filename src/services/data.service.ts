import api from '../api/axios';

export const dataService = {
    // Categories
    getCategories: async () => {
        const response = await api.get('/categories');
        return response.data;
    },
    createCategory: async (name: string) => {
        const response = await api.post('/categories', { category_name: name });
        return response.data;
    },
    deleteCategory: async (id: number) => {
        const response = await api.delete(`/categories/${id}`);
        return response.data;
    },

    // Bookmarks
    getBookmarks: async () => {
        // Backend doesn't support filter by category in GET (it returns all for user based on scoping).
        // But implementation said "findAll(userId) -> find bookmarks where category.user.id = userId".
        // So fetch all bookmarks for the user.
        const response = await api.get('/bookmarks');
        return response.data;
    },
    createBookmark: async (data: any) => {
        // data needs category_id, label, url, etc.
        const response = await api.post('/bookmarks', data);
        return response.data;
    },
    updateBookmark: async (id: number, data: any) => {
        const response = await api.patch(`/bookmarks/${id}`, data);
        return response.data;
    },
    deleteBookmark: async (id: number) => {
        const response = await api.delete(`/bookmarks/${id}`);
        return response.data;
    },
};
