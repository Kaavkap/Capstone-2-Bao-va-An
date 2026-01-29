import { API_CONFIG } from "../utils/constants.js";
import Product from "../model/Product.js";

const apiUrl = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.PRODUCTS;

// Lấy tất cả sản phẩm từ API dùng axios
const fetchAll = async () => {
    try {
        const response = await axios.get(apiUrl);
        const data = response.data;
        return data.map(
            (p) =>
                new Product(
                    p.id,
                    p.name,
                    p.price,
                    p.screen,
                    p.backCamera,
                    p.frontCamera,
                    p.img,
                    p.desc,
                    p.type,
                ),
        );
    } catch (error) {
        console.error("Lỗi fetch products với axios:", error);
    }
};

// Tìm sản phẩm theo ID
const findById = (id, products) => {
    return products.find((p) => String(p.id) === String(id)) || null;
};

// Lọc sản phẩm theo loại
const filterByType = (products, type) => {
    if (type === "all") {
        return products;
    }
    return products.filter((p) => p.type.toLowerCase() === type.toLowerCase());
};

// Sắp xếp theo giá
const sortByPrice = (products, order) => {
    const sorted = [...products];
    if (order === "0") {
        // Tăng dần
        return sorted.sort((a, b) => a.price - b.price);
    } else if (order === "1") {
        // Giảm dần
        return sorted.sort((a, b) => b.price - a.price);
    }
    return sorted;
};

export default {
    fetchAll,
    findById,
    filterByType,
    sortByPrice,
};
