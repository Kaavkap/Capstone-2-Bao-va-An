// Debounce function để giảm số lần gọi hàm
const debounce = (func, delay = 300) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
};

// Tìm kiếm sản phẩm theo tên
const searchProducts = (products, keyword) => {
    if (!keyword || keyword.trim() === "") {
        return products;
    }

    const searchTerm = keyword.toLowerCase().trim();
    return products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm),
    );
};

// Sắp xếp sản phẩm theo giá
const sortProductsByPrice = (products, order = "asc") => {
    if (!order || order === "") {
        return products;
    }

    const sorted = [...products].sort((a, b) => {
        return order === "asc" ? a.price - b.price : b.price - a.price;
    });

    return sorted;
};

// Scroll đến element
const scrollToElement = (elementId, offset = 0) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition =
        elementPosition + window.pageYOffset - remToPx(offset);

    window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
    });
};

// Convert rem to px
const remToPx = (rem) => {
    return (
        rem * parseFloat(getComputedStyle(document.documentElement).fontSize)
    );
};

export default {
    debounce,
    searchProducts,
    sortProductsByPrice,
    scrollToElement,
    remToPx,
};
