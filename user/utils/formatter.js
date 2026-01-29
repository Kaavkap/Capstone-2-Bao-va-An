// Format số thành tiền tệ Việt Nam
export const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "₫";
};

// Format số
export const formatNumber = (number) => {
    return new Intl.NumberFormat("vi-VN").format(number);
};
