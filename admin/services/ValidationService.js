import { VALIDATION_RULES } from "../utils/constants.js";

// Validate tên sản phẩm
const validateName = (name) => {
    const errors = [];

    if (VALIDATION_RULES.NAME.REQUIRED && (!name || name.trim() === "")) {
        errors.push("Tên sản phẩm không được để trống");
    } else if (name.trim().length < VALIDATION_RULES.NAME.MIN_LENGTH) {
        errors.push(
            `Tên sản phẩm phải có ít nhất ${VALIDATION_RULES.NAME.MIN_LENGTH} ký tự`,
        );
    } else if (name.trim().length > VALIDATION_RULES.NAME.MAX_LENGTH) {
        errors.push(
            `Tên sản phẩm không được vượt quá ${VALIDATION_RULES.NAME.MAX_LENGTH} ký tự`,
        );
    }

    return errors;
};

// Validate giá
const validatePrice = (price) => {
    const errors = [];

    if (VALIDATION_RULES.PRICE.REQUIRED && (!price || price === "")) {
        errors.push("Giá không được để trống");
    } else if (isNaN(price)) {
        errors.push("Giá phải là số");
    } else if (parseFloat(price) <= VALIDATION_RULES.PRICE.MIN) {
        errors.push(`Giá phải lớn hơn ${VALIDATION_RULES.PRICE.MIN}`);
    }

    return errors;
};

// Validate loại sản phẩm
const validateType = (type) => {
    const errors = [];

    if (VALIDATION_RULES.TYPE.REQUIRED && (!type || type.trim() === "")) {
        errors.push("Vui lòng chọn loại sản phẩm");
    } else if (!VALIDATION_RULES.TYPE.ALLOWED_VALUES.includes(type)) {
        errors.push("Loại sản phẩm không hợp lệ");
    }

    return errors;
};

// Validate URL hình ảnh
const validateImage = (url) => {
    const errors = [];

    if (VALIDATION_RULES.IMAGE.REQUIRED && (!url || url.trim() === "")) {
        errors.push("URL hình ảnh không được để trống");
    } else if (!VALIDATION_RULES.IMAGE.URL_PATTERN.test(url)) {
        errors.push("URL hình ảnh không hợp lệ");
    }

    return errors;
};

// Validate mô tả
const validateDescription = (desc) => {
    const errors = [];

    if (VALIDATION_RULES.DESC.REQUIRED && (!desc || desc.trim() === "")) {
        errors.push("Mô tả không được để trống");
    } else if (desc.trim().length < VALIDATION_RULES.DESC.MIN_LENGTH) {
        errors.push(
            `Mô tả phải có ít nhất ${VALIDATION_RULES.DESC.MIN_LENGTH} ký tự`,
        );
    } else if (desc.trim().length > VALIDATION_RULES.DESC.MAX_LENGTH) {
        errors.push(
            `Mô tả không được vượt quá ${VALIDATION_RULES.DESC.MAX_LENGTH} ký tự`,
        );
    }

    return errors;
};

// Validate toàn bộ form sản phẩm
const validateProduct = (data) => {
    const errors = {};

    const nameErrors = validateName(data.name);
    if (nameErrors.length > 0) errors.name = nameErrors;

    const priceErrors = validatePrice(data.price);
    if (priceErrors.length > 0) errors.price = priceErrors;

    const typeErrors = validateType(data.type);
    if (typeErrors.length > 0) errors.type = typeErrors;

    const imageErrors = validateImage(data.img);
    if (imageErrors.length > 0) errors.img = imageErrors;

    const descErrors = validateDescription(data.desc);
    if (descErrors.length > 0) errors.desc = descErrors;

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

export default {
    validateName,
    validatePrice,
    validateType,
    validateImage,
    validateDescription,
    validateProduct,
};
