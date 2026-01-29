import ProductController from "./controllers/ProductController.js";
import UIController from "./controllers/UIController.js";
import Alert from "./utils/alert.js";

// Khởi tạo ứng dụng admin
const init = async () => {
    try {
        // Khởi tạo Alert
        Alert.init();

        // Khởi tạo UI
        UIController.init();

        // Khởi tạo Product Controller
        ProductController.init();

        // Load danh sách sản phẩm
        await ProductController.loadProducts();
    } catch (error) {
        console.error("Lỗi khởi tạo app:", error);
    }
};

// Chạy ứng dụng khi DOM đã sẵn sàng
document.addEventListener("DOMContentLoaded", init);
