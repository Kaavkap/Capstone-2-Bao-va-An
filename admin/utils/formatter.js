// Format giá tiền VNĐ
const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(price);
};

// Format số
const formatNumber = (num) => {
    return new Intl.NumberFormat("vi-VN").format(num);
};

// Cắt ngắn text
const truncateText = (text, maxLength = 100) => {
    if (!text) return "";
    return text.length > maxLength
        ? text.substring(0, maxLength) + "..."
        : text;
};

// Format ngày giờ
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
};

export default {
    formatPrice,
    formatNumber,
    truncateText,
    formatDate,
};
