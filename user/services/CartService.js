import CartItem from "../model/CartItem.js";
import StorageService from "./StorageService.js";

let cart = StorageService.getCart();

// Lấy tất cả items trong giỏ
const getAll = () => {
    return cart;
};

// Lấy item theo product ID
const getItem = (productId) => {
    return cart.find((item) => item.id === productId);
};

// Thêm sản phẩm vào giỏ
const addItem = (product) => {
    const existingItem = getItem(product.id);

    if (existingItem) {
        existingItem.quantity += 1;
        save();
        return existingItem;
    } else {
        const newItem = new CartItem(
            product.id,
            product.name,
            product.price,
            product.img,
            1,
        );
        cart.push(newItem);
        save();
        return newItem;
    }
};

// Tăng số lượng
const increaseQuantity = (productId) => {
    const item = getItem(productId);
    if (item) {
        item.quantity += 1;
        save();
    }
};

// Giảm số lượng
const decreaseQuantity = (productId) => {
    const item = getItem(productId);
    if (item) {
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            removeItem(productId);
        }
        save();
    }
};

// Xóa sản phẩm khỏi giỏ
const removeItem = (productId) => {
    cart = cart.filter((item) => item.id !== productId);
    save();
};

// Xóa toàn bộ giỏ hàng
const clear = () => {
    cart = [];
    save();
};

// Tính tổng tiền
const getTotal = () => {
    return cart.reduce((total, item) => {
        return total + item.price * item.quantity;
    }, 0);
};

// Tính tổng số lượng sản phẩm
const getTotalItems = () => {
    return cart.reduce((total, item) => {
        return total + item.quantity;
    }, 0);
};

// Kiểm tra giỏ hàng có rỗng không
const isEmpty = () => {
    return cart.length === 0;
};

// Lưu giỏ hàng vào localStorage
const save = () => {
    StorageService.setCart(cart);
};

export default {
    getAll,
    getItem,
    addItem,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    clear,
    getTotal,
    getTotalItems,
    isEmpty,
    save,
};
