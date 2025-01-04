const API_BASE_URL = 'http://127.0.0.1:8000/api';

const endpoints = {
    authenticate: `${API_BASE_URL}/authenticate`,
    refreshToken: `${API_BASE_URL}/refresh-token`,
    logout: `${API_BASE_URL}/logout`,
    user: `${API_BASE_URL}/user`,
    dashboard: `${API_BASE_URL}/dashboard`,
    updateProfile: `${API_BASE_URL}/users`,

    // Kategori
    category: `${API_BASE_URL}/kategori`,
    categoryExport: `${API_BASE_URL}/kategori-export`,

    // Produk
    product: `${API_BASE_URL}/produk`,
    productExport: `${API_BASE_URL}/produk-export`,

    // Sale
    sale: `${API_BASE_URL}/penjualan`,
    saleExport: `${API_BASE_URL}/penjualan-export`,
    getSalesPurchases: `${API_BASE_URL}/sales-purchases`,
};

export default endpoints;
