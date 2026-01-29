// API Endpoints
export const API_CONFIG = {
    BASE_URL: "https://697754f95b9c0aed1e86249e.mockapi.io/api/v1",
    ENDPOINTS: {
        PRODUCTS: "/Products",
    },
};

// LocalStorage Keys
export const STORAGE_KEYS = {
    CART: "cart",
    THEME: "ba-theme",
};

// Alert Types
export const ALERT_TYPES = {
    SUCCESS: "success",
    ERROR: "error",
    WARNING: "warning",
    INFO: "info",
};

// Alert Messages
export const MESSAGES = {
    CART_EMPTY: {
        title: "Giỏ hàng trống",
        message: "Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.",
    },
    CHECKOUT_SUCCESS: {
        title: "Thanh toán thành công!",
        message:
            "Cảm ơn bạn đã mua hàng. Đơn hàng của bạn sẽ được xử lý sớm nhất.",
    },
    FETCH_ERROR: {
        title: "Lỗi tải dữ liệu",
        message: "Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.",
    },
};

// Alert Icons
export const ALERT_ICONS = {
    success: "check_circle",
    error: "cancel",
    warning: "warning",
    info: "info",
};
