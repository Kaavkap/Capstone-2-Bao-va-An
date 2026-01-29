import ProductService from "../services/ProductService.js";
import { formatPrice } from "../utils/formatter.js";

let allProducts = [];
let currentFilter = "all";
let currentSort = "";
let currentSearchTerm = "";

// Khởi tạo products
const init = (products) => {
    allProducts = products;
    render(products);
    attachFilterListeners();
    attachSortListener();
    attachSearchListener();
};

// Render danh sách sản phẩm
const render = (products) => {
    const container = document.getElementById("productList");
    const emptyState = document.getElementById("emptyState");

    container.innerHTML = "";

    if (products.length === 0) {
        emptyState.style.display = "block";
        return;
    } else {
        emptyState.style.display = "none";
    }

    products.forEach((p) => {
        const div = document.createElement("div");
        div.className = "product-card";

        div.innerHTML = `
            <div class="product-card__media">
                <span class="product-badge product-badge--type">${p.type}</span>
                <span class="product-badge product-badge--new">New</span>
                <img
                    alt="${p.name}"
                    class="product-card__img"
                    src="${p.img}"
                />
            </div>
            <div class="product-card__body">
                <h3 class="product-card__name">${p.name}</h3>

                <div class="product-card__meta">
                    <span class="product-card__price">${formatPrice(p.price)}</span>
                    <div class="product-card__rating">
                        <span class="material-symbols-outlined">star</span>
                        4.9
                    </div>
                </div>

                <p class="product-card__desc">${p.desc}</p>

                <div class="product-card__actions">
                    <button
                        class="product-card__btn product-card__btn--outline btn-detail"
                        type="button"
                        data-id="${p.id}"
                    >
                        Chi tiết
                    </button>
                    <button
                        class="product-card__btn product-card__btn--primary btn-add-cart"
                        type="button"
                        data-id="${p.id}"
                    >
                        <span class="material-symbols-outlined">add_shopping_cart</span>
                        Thêm
                    </button>
                </div>
            </div>
        `;

        container.appendChild(div);
    });

    attachProductButtonListeners();
};

// Gắn event listeners cho các nút trong product card
const attachProductButtonListeners = () => {
    // Nút Chi tiết
    document.querySelectorAll(".btn-detail").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const productId = e.currentTarget.getAttribute("data-id");
            window.dispatchEvent(
                new CustomEvent("openProductDetail", { detail: productId }),
            );
        });
    });

    // Nút Thêm vào giỏ
    document.querySelectorAll(".btn-add-cart").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const productId = e.currentTarget.getAttribute("data-id");
            window.dispatchEvent(
                new CustomEvent("addToCart", { detail: productId }),
            );
        });
    });
};

// Gắn event listeners cho nút filter
const attachFilterListeners = () => {
    document.querySelectorAll(".btn-filter").forEach((button) => {
        button.addEventListener("click", (e) => {
            const selectedType = e.currentTarget.getAttribute("data");
            handleFilter(selectedType);

            // Update active state
            document
                .querySelectorAll(".btn-filter")
                .forEach((btn) => btn.classList.remove("btn-active"));
            e.currentTarget.classList.add("btn-active");
        });
    });
};

// Gắn event listener cho dropdown sort
const attachSortListener = () => {
    const sortSelect = document.getElementById("sortPrice");
    if (sortSelect) {
        sortSelect.addEventListener("change", (e) => {
            currentSort = e.target.value;
            applyFilterAndSort();
        });
    }
};

// Gắn event listener cho search input
const attachSearchListener = () => {
    const searchInput = document.querySelector(".search-bar input");
    if (!searchInput) return;

    let debounceTimer;
    searchInput.addEventListener("input", (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            currentSearchTerm = e.target.value.trim();
            applyFilterAndSort();
        }, 300); // Debounce 300ms
    });
};

// Xử lý filter
const handleFilter = (type) => {
    currentFilter = type;
    applyFilterAndSort();
};

// Áp dụng filter và sort
const applyFilterAndSort = () => {
    let filtered = [...allProducts];

    // 1. Search by name (tìm trong TẤT CẢ sản phẩm trước)
    if (currentSearchTerm) {
        filtered = filtered.filter((p) =>
            p.name.toLowerCase().includes(currentSearchTerm.toLowerCase()),
        );
    }

    // 2. Filter by type (áp dụng lên kết quả search)
    filtered = ProductService.filterByType(filtered, currentFilter);

    // 3. Sort by price (áp dụng lên kết quả cuối)
    if (currentSort) {
        filtered = ProductService.sortByPrice(filtered, currentSort);
    }

    render(filtered);
};

// Lấy sản phẩm theo ID
const getProductById = (id) => {
    return ProductService.findById(id, allProducts);
};

export default {
    init,
    render,
    getProductById,
};
