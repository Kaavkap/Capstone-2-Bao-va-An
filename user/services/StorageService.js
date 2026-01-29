import { STORAGE_KEYS } from "../utils/constants.js";

// Lấy data từ localStorage
const get = (key, defaultValue = null) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Lỗi đọc localStorage (${key}):`, error);
        return defaultValue;
    }
};

// Lưu data vào localStorage
const set = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Lỗi ghi localStorage (${key}):`, error);
    }
};

// Xóa item khỏi localStorage
const remove = (key) => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error(`Lỗi xóa localStorage (${key}):`, error);
    }
};

// Lấy giỏ hàng
const getCart = () => {
    return get(STORAGE_KEYS.CART, []);
};

// Lưu giỏ hàng
const setCart = (cart) => {
    set(STORAGE_KEYS.CART, cart);
};

// Lấy theme
const getTheme = () => {
    return get(STORAGE_KEYS.THEME, null);
};

// Lưu theme
const setTheme = (theme) => {
    set(STORAGE_KEYS.THEME, theme);
};

export default {
    get,
    set,
    remove,
    getCart,
    setCart,
    getTheme,
    setTheme,
};
