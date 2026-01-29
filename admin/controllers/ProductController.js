import ProductService from "../services/ProductService.js";
import ValidationService from "../services/ValidationService.js";
import Alert from "../utils/alert.js";
import formatter from "../utils/formatter.js";
import helpers from "../utils/helpers.js";
import { MESSAGES, ALERT_TYPES } from "../utils/constants.js";

let allProducts = [];
let filteredProducts = [];
let currentEditId = null;

// Form elements
let productModal = null;
let productForm = null;
let modalTitle = null;
let confirmModal = null;
let deleteProductId = null;

// Khởi tạo controller
const init = () => {
    productModal = document.getElementById("productModal");
    productForm = document.getElementById("productForm");
    modalTitle = document.getElementById("modalTitle");
    confirmModal = document.getElementById("confirmModal");

    attachEventListeners();
};

// Gắn event listeners
const attachEventListeners = () => {
    // Nút thêm sản phẩm
    const btnAdd = document.getElementById("btnAddProduct");
    if (btnAdd) {
        btnAdd.addEventListener("click", () => showAddForm());
    }

    // Nút đóng modal
    const btnClose = document.getElementById("btnCloseModal");
    if (btnClose) {
        btnClose.addEventListener("click", () => closeModal());
    }

    // Nút hủy form
    const btnCancel = document.getElementById("btnCancelForm");
    if (btnCancel) {
        btnCancel.addEventListener("click", () => closeModal());
    }

    // Submit form
    if (productForm) {
        productForm.addEventListener("submit", (e) => {
            e.preventDefault();
            handleSubmit();
        });
    }

    // Click overlay đóng modal
    if (productModal) {
        const overlay = productModal.querySelector(".modal-overlay");
        if (overlay) {
            overlay.addEventListener("click", () => closeModal());
        }
    }

    // Search input
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", (e) =>
            handleSearch(e.target.value),
        );
    }

    // Sort select
    const sortSelect = document.getElementById("sortPrice");
    if (sortSelect) {
        sortSelect.addEventListener("change", (e) =>
            handleSort(e.target.value),
        );
    }

    // Confirm delete
    const btnConfirmDelete = document.getElementById("btnConfirmDelete");
    if (btnConfirmDelete) {
        btnConfirmDelete.addEventListener("click", () => confirmDelete());
    }

    // Cancel delete
    const btnCancelDelete = document.getElementById("btnCancelDelete");
    if (btnCancelDelete) {
        btnCancelDelete.addEventListener("click", () => closeConfirmModal());
    }

    // Confirm modal overlay
    if (confirmModal) {
        const overlay = confirmModal.querySelector(".modal-overlay");
        if (overlay) {
            overlay.addEventListener("click", () => closeConfirmModal());
        }
    }

    // Realtime validation
    attachValidationListeners();
};

// Gắn realtime validation
const attachValidationListeners = () => {
    const nameInput = document.getElementById("productName");
    const priceInput = document.getElementById("productPrice");
    const typeSelect = document.getElementById("productType");
    const imageInput = document.getElementById("productImage");
    const descInput = document.getElementById("productDesc");

    if (nameInput) {
        nameInput.addEventListener("blur", () => {
            validateField("name", nameInput.value);
        });
    }

    if (priceInput) {
        priceInput.addEventListener("blur", () => {
            validateField("price", priceInput.value);
        });
    }

    if (typeSelect) {
        typeSelect.addEventListener("change", () => {
            validateField("type", typeSelect.value);
        });
    }

    if (imageInput) {
        imageInput.addEventListener("blur", () => {
            validateField("img", imageInput.value);
        });
    }

    if (descInput) {
        descInput.addEventListener("blur", () => {
            validateField("desc", descInput.value);
        });
    }
};

// Validate một field
const validateField = (fieldName, value) => {
    let errors = [];

    switch (fieldName) {
        case "name":
            errors = ValidationService.validateName(value);
            showFieldError("errorName", errors);
            break;
        case "price":
            errors = ValidationService.validatePrice(value);
            showFieldError("errorPrice", errors);
            break;
        case "type":
            errors = ValidationService.validateType(value);
            showFieldError("errorType", errors);
            break;
        case "img":
            errors = ValidationService.validateImage(value);
            showFieldError("errorImage", errors);
            break;
        case "desc":
            errors = ValidationService.validateDescription(value);
            showFieldError("errorDesc", errors);
            break;
    }
};

// Hiển thị lỗi cho field
const showFieldError = (errorId, errors) => {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = errors.length > 0 ? errors[0] : "";
    }
};

// Load và hiển thị danh sách sản phẩm
const loadProducts = async () => {
    try {
        allProducts = await ProductService.fetchAll();
        filteredProducts = [...allProducts];
        renderTable(filteredProducts);
    } catch (error) {
        Alert.show(
            ALERT_TYPES.ERROR,
            MESSAGES.FETCH_ERROR.title,
            MESSAGES.FETCH_ERROR.message,
        );
    }
};

// Render bảng sản phẩm
const renderTable = (products) => {
    const tbody = document.getElementById("productTableBody");
    const emptyState = document.getElementById("emptyState");

    if (!tbody) return;

    tbody.innerHTML = "";

    if (products.length === 0) {
        if (emptyState) emptyState.style.display = "block";
        return;
    }

    if (emptyState) emptyState.style.display = "none";

    products.forEach((product) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${product.id}</td>
            <td>
                <img src="${product.img}" alt="${product.name}" class="product-img" />
            </td>
            <td>${product.name}</td>
            <td>${formatter.formatPrice(product.price)}</td>
            <td><span class="badge badge-${product.type.toLowerCase()}">${product.type}</span></td>
            <td>${product.screen || "Chưa cập nhật"}</td>
            <td>${product.backCamera || "Chưa cập nhật"}</td>
            <td>${product.frontCamera || "Chưa cập nhật"}</td>
            <td>${product.desc}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon btn-edit" data-id="${product.id}" title="Sửa">
                        <span class="material-symbols-outlined">edit</span>
                    </button>
                    <button class="btn-icon btn-delete" data-id="${product.id}" title="Xóa">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </div>
            </td>
        `;

        tbody.appendChild(row);
    });

    // Gắn event listeners cho các nút edit/delete
    attachTableButtons();
};

// Gắn event listeners cho các nút trong bảng
const attachTableButtons = () => {
    // Nút edit
    document.querySelectorAll(".btn-edit").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const id = e.currentTarget.getAttribute("data-id");
            showEditForm(id);
        });
    });

    // Nút delete
    document.querySelectorAll(".btn-delete").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const id = e.currentTarget.getAttribute("data-id");
            showConfirmDelete(id);
        });
    });
};

// Hiển thị form thêm sản phẩm
const showAddForm = () => {
    currentEditId = null;
    if (modalTitle) modalTitle.textContent = "Thêm sản phẩm mới";
    resetForm();
    openModal();
};

// Hiển thị form sửa sản phẩm
const showEditForm = (id) => {
    currentEditId = id;
    if (modalTitle) modalTitle.textContent = "Cập nhật sản phẩm";

    const product = allProducts.find((p) => p.id === id);
    if (product) {
        fillForm(product);
        openModal();
    }
};

// Điền dữ liệu vào form
const fillForm = (product) => {
    document.getElementById("productName").value = product.name || "";
    document.getElementById("productPrice").value = product.price || "";
    document.getElementById("productType").value = product.type || "";
    document.getElementById("productScreen").value = product.screen || "";
    document.getElementById("productBackCamera").value =
        product.backCamera || "";
    document.getElementById("productFrontCamera").value =
        product.frontCamera || "";
    document.getElementById("productImage").value = product.img || "";
    document.getElementById("productDesc").value = product.desc || "";
};

// Reset form
const resetForm = () => {
    if (productForm) productForm.reset();
    clearAllErrors();
};

// Xóa tất cả lỗi
const clearAllErrors = () => {
    [
        "errorName",
        "errorPrice",
        "errorType",
        "errorScreen",
        "errorBackCamera",
        "errorFrontCamera",
        "errorImage",
        "errorDesc",
    ].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.textContent = "";
    });
};

// Mở modal
const openModal = () => {
    if (productModal) productModal.classList.add("active");
};

// Đóng modal
const closeModal = () => {
    if (productModal) productModal.classList.remove("active");
    resetForm();
    currentEditId = null;
};

// Xử lý submit form
const handleSubmit = async () => {
    const formData = {
        name: document.getElementById("productName").value.trim(),
        price: parseFloat(document.getElementById("productPrice").value),
        type: document.getElementById("productType").value,
        screen: document.getElementById("productScreen").value.trim(),
        backCamera: document.getElementById("productBackCamera").value.trim(),
        frontCamera: document.getElementById("productFrontCamera").value.trim(),
        img: document.getElementById("productImage").value.trim(),
        desc: document.getElementById("productDesc").value.trim(),
    };

    // Validate
    const validation = ValidationService.validateProduct(formData);

    if (!validation.isValid) {
        // Hiển thị lỗi
        showFieldError("errorName", validation.errors.name || []);
        showFieldError("errorPrice", validation.errors.price || []);
        showFieldError("errorType", validation.errors.type || []);
        showFieldError("errorImage", validation.errors.img || []);
        showFieldError("errorDesc", validation.errors.desc || []);

        Alert.show(
            ALERT_TYPES.WARNING,
            MESSAGES.VALIDATION_ERROR.title,
            MESSAGES.VALIDATION_ERROR.message,
        );
        return;
    }

    try {
        if (currentEditId) {
            // Cập nhật
            await ProductService.update(currentEditId, formData);
            Alert.show(
                ALERT_TYPES.SUCCESS,
                MESSAGES.UPDATE_SUCCESS.title,
                MESSAGES.UPDATE_SUCCESS.message,
            );
        } else {
            // Thêm mới
            await ProductService.create(formData);
            Alert.show(
                ALERT_TYPES.SUCCESS,
                MESSAGES.ADD_SUCCESS.title,
                MESSAGES.ADD_SUCCESS.message,
            );
        }

        closeModal();
        await loadProducts();
    } catch (error) {
        const message = currentEditId
            ? MESSAGES.UPDATE_ERROR
            : MESSAGES.ADD_ERROR;
        Alert.show(ALERT_TYPES.ERROR, message.title, message.message);
    }
};

// Hiển thị modal xác nhận xóa
const showConfirmDelete = (id) => {
    deleteProductId = id;
    if (confirmModal) confirmModal.classList.add("active");
};

// Đóng modal xác nhận
const closeConfirmModal = () => {
    if (confirmModal) confirmModal.classList.remove("active");
    deleteProductId = null;
};

// Xác nhận xóa
const confirmDelete = async () => {
    if (!deleteProductId) return;

    try {
        await ProductService.remove(deleteProductId);
        Alert.show(
            ALERT_TYPES.SUCCESS,
            MESSAGES.DELETE_SUCCESS.title,
            MESSAGES.DELETE_SUCCESS.message,
        );
        closeConfirmModal();
        await loadProducts();
    } catch (error) {
        Alert.show(
            ALERT_TYPES.ERROR,
            MESSAGES.DELETE_ERROR.title,
            MESSAGES.DELETE_ERROR.message,
        );
    }
};

// Xử lý tìm kiếm
const handleSearch = (keyword) => {
    filteredProducts = helpers.searchProducts(allProducts, keyword);
    const sortOrder = document.getElementById("sortPrice")?.value || "";
    if (sortOrder) {
        filteredProducts = helpers.sortProductsByPrice(
            filteredProducts,
            sortOrder,
        );
    }
    renderTable(filteredProducts);
};

// Xử lý sắp xếp
const handleSort = (order) => {
    filteredProducts = helpers.sortProductsByPrice(filteredProducts, order);
    renderTable(filteredProducts);
};

export default {
    init,
    loadProducts,
};
