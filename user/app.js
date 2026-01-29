import ProductService from "./services/ProductService.js";
import ProductController from "./controllers/ProductController.js";
import CartController from "./controllers/CartController.js";
import UIController from "./controllers/UIController.js";
import Alert from "./utils/alert.js";
import { MESSAGES, ALERT_TYPES } from "./utils/constants.js";

let allProducts = [];

// Khởi tạo ứng dụng
const init = async () => {
    try {
        // Khởi tạo Alert trước tiên
        Alert.init();

        // Khởi tạo UI
        UIController.init();

        // Khởi tạo giỏ hàng
        CartController.init();

        // Load sản phẩm từ API
        await loadProducts();

        // Setup các event listeners
        setupEventListeners();
    } catch (error) {
        console.error("Lỗi khởi tạo app:", error);
        Alert.show(
            ALERT_TYPES.ERROR,
            MESSAGES.FETCH_ERROR.title,
            MESSAGES.FETCH_ERROR.message,
        );
    }
};

// Hàm thêm vào giỏ hàng
const handleAddToCart = (productId) => {
    const product = ProductController.getProductById(productId);
    if (product) {
        CartController.addProduct(product);
    }
};

// Load sản phẩm từ API
const loadProducts = async () => {
    try {
        allProducts = await ProductService.fetchAll();
        ProductController.init(allProducts);
    } catch (error) {
        console.error("Lỗi load products:", error);
        throw error;
    }
};

// Setup các event listeners cho toàn app
const setupEventListeners = () => {
    // Thêm vào giỏ hàng (từ product card)
    window.addEventListener("addToCart", (e) => {
        const productId = e.detail;
        handleAddToCart(productId);
    });

    // Lấy sản phẩm theo ID (dùng cho product detail)
    window.addEventListener("getProductById", (e) => {
        const productId = e.detail;
        const product = ProductController.getProductById(productId);
        if (product) {
            UIController.openProductDetail(product);
        }
    });
};

// Chạy app khi DOM đã sẵn sàng
document.addEventListener("DOMContentLoaded", () => {
    init();
});
