const API_BASE_URL = 'http://127.0.0.1:8000/api';

const endpoints = {
    authenticate: `${API_BASE_URL}/authenticate`,
    refreshToken: `${API_BASE_URL}/refresh-token`,
    logout: `${API_BASE_URL}/logout`,
    user: `${API_BASE_URL}/user`,
    dashboard: `${API_BASE_URL}/dashboard`,
    updateProfile: `${API_BASE_URL}/users`,
    category: `${API_BASE_URL}/kategori`,
    categoryExport: `${API_BASE_URL}/kategori-export`,
    product: `${API_BASE_URL}/produk`,
    productExport: `${API_BASE_URL}/produk-export`,
};

export default endpoints;
