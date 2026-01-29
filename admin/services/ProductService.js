import { API_CONFIG } from "../utils/constants.js";
import Product from "../models/Product.js";

// Lấy tất cả sản phẩm
const fetchAll = async () => {
    try {
        const response = await axios.get(API_CONFIG.BASE_URL, {
            timeout: API_CONFIG.TIMEOUT,
        });

        return response.data.map(
            (item) =>
                new Product(
                    item.id,
                    item.name,
                    item.price,
                    item.screen,
                    item.backCamera,
                    item.frontCamera,
                    item.img,
                    item.desc,
                    item.type,
                ),
        );
    } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        throw error;
    }
};

// Tạo sản phẩm mới
const create = async (productData) => {
    try {
        const response = await axios.post(API_CONFIG.BASE_URL, productData, {
            timeout: API_CONFIG.TIMEOUT,
        });

        const item = response.data;
        return new Product(
            item.id,
            item.name,
            item.price,
            item.screen,
            item.backCamera,
            item.frontCamera,
            item.img,
            item.desc,
            item.type,
        );
    } catch (error) {
        console.error("Lỗi khi tạo sản phẩm:", error);
        throw error;
    }
};

// Cập nhật sản phẩm
const update = async (id, productData) => {
    try {
        const response = await axios.put(
            `${API_CONFIG.BASE_URL}/${id}`,
            productData,
            {
                timeout: API_CONFIG.TIMEOUT,
            },
        );

        const item = response.data;
        return new Product(
            item.id,
            item.name,
            item.price,
            item.screen,
            item.backCamera,
            item.frontCamera,
            item.img,
            item.desc,
            item.type,
        );
    } catch (error) {
        console.error("Lỗi khi cập nhật sản phẩm:", error);
        throw error;
    }
};

// Xóa sản phẩm
const remove = async (id) => {
    try {
        await axios.delete(`${API_CONFIG.BASE_URL}/${id}`, {
            timeout: API_CONFIG.TIMEOUT,
        });
        return true;
    } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
        throw error;
    }
};

// Tìm sản phẩm theo ID
const findById = async (id) => {
    try {
        const response = await axios.get(`${API_CONFIG.BASE_URL}/${id}`, {
            timeout: API_CONFIG.TIMEOUT,
        });

        const item = response.data;
        return new Product(
            item.id,
            item.name,
            item.price,
            item.screen,
            item.backCamera,
            item.frontCamera,
            item.img,
            item.desc,
            item.type,
        );
    } catch (error) {
        console.error("Lỗi khi tìm sản phẩm:", error);
        throw error;
    }
};

export default {
    fetchAll,
    create,
    update,
    remove,
    findById,
};
