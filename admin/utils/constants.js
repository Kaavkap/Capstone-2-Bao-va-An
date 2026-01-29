// API Configuration
export const API_CONFIG = {
    BASE_URL: "https://697754f95b9c0aed1e86249e.mockapi.io/api/v1/Products",
    TIMEOUT: 10000,
};

// Storage Keys
export const STORAGE_KEYS = {
    THEME: "theme",
};

// Alert Types
export const ALERT_TYPES = {
    SUCCESS: "success",
    ERROR: "error",
    WARNING: "warning",
    INFO: "info",
};

// Alert Icons
export const ALERT_ICONS = {
    success: "check_circle",
    error: "error",
    warning: "warning",
    info: "info",
};

// Messages
export const MESSAGES = {
    FETCH_ERROR: {
        title: "Lỗi tải dữ liệu",
        message: "Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.",
    },
    ADD_SUCCESS: {
        title: "Thêm thành công!",
        message: "Sản phẩm đã được thêm vào hệ thống.",
    },
    ADD_ERROR: {
        title: "Thêm thất bại",
        message: "Không thể thêm sản phẩm. Vui lòng thử lại.",
    },
    UPDATE_SUCCESS: {
        title: "Cập nhật thành công!",
        message: "Sản phẩm đã được cập nhật.",
    },
    UPDATE_ERROR: {
        title: "Cập nhật thất bại",
        message: "Không thể cập nhật sản phẩm. Vui lòng thử lại.",
    },
    DELETE_SUCCESS: {
        title: "Xóa thành công!",
        message: "Sản phẩm đã được xóa khỏi hệ thống.",
    },
    DELETE_ERROR: {
        title: "Xóa thất bại",
        message: "Không thể xóa sản phẩm. Vui lòng thử lại.",
    },
    VALIDATION_ERROR: {
        title: "Dữ liệu không hợp lệ",
        message: "Vui lòng kiểm tra lại thông tin đã nhập.",
    },
};

// Product Types
export const PRODUCT_TYPES = ["iPhone", "Samsung"];

// Validation Rules
export const VALIDATION_RULES = {
    NAME: {
        MIN_LENGTH: 3,
        MAX_LENGTH: 100,
        REQUIRED: true,
    },
    PRICE: {
        MIN: 0,
        REQUIRED: true,
    },
    TYPE: {
        REQUIRED: true,
        ALLOWED_VALUES: PRODUCT_TYPES,
    },
    IMAGE: {
        REQUIRED: true,
        URL_PATTERN: /^https?:\/\/.+/i,
    },
    DESC: {
        MIN_LENGTH: 10,
        MAX_LENGTH: 500,
        REQUIRED: true,
    },
};

export default {
    API_CONFIG,
    STORAGE_KEYS,
    ALERT_TYPES,
    ALERT_ICONS,
    MESSAGES,
    PRODUCT_TYPES,
    VALIDATION_RULES,
};
