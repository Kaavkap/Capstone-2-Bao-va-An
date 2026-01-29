import Product from "../model/Product.js";
import CartItem from "../model/CartItem.js";

const API_URL = "https://697754f95b9c0aed1e86249e.mockapi.io/api/v1/Products";

let allProducts = [];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Load products
const fetchProducts = async () => {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();

        allProducts = data.map(
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

        renderProducts(allProducts);
        renderCart(); // Load cart UI on page load
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
    }
};

// Render products
const renderProducts = (products) => {
    const container = document.getElementById("productList");
    container.innerHTML = "";

    if (products.length === 0) {
        document.getElementById("emptyState").style.display = "block";
        return;
    } else {
        document.getElementById("emptyState").style.display = "none";
    }

    products.forEach((p) => {
        const div = document.createElement("div");
        div.className = "product-card";

        div.innerHTML = `
       <div class="product-card__media">
                            <span class="product-badge product-badge--type"
                                >${p.type}</span
                            >
                            <span class="product-badge product-badge--new"
                                >New</span
                            >
                            <img
                                alt="${p.name}"
                                class="product-card__img"
                                data-alt="Phone"
                                src="${p.img}"
                            />
                        </div>
                        <div class="product-card__body">
                            <h3 class="product-card__name">${p.name}</h3>

                            <div class="product-card__meta">
                                <span class="product-card__price">${p.price.toLocaleString()}₫</span>
                                <div class="product-card__rating">
                                    <span class="material-symbols-outlined"
                                        >star</span
                                    >
                                    4.9
                                </div>
                            </div>

                            <p class="product-card__desc">
                                ${p.desc}
                            </p>

                            <div class="product-card__actions">
                                <button
                                    class="product-card__btn product-card__btn--outline btn-detail"
                                    type="button"
                                    data-id="${p.id}"
                                    onclick="openProductDetail(${p.id})"
                                >
                                    Chi tiết
                                </button>
                                <button
                                    class="product-card__btn product-card__btn--primary"
                                    type="button"
                                    onclick="addToCart('${p.id}')"
                                >
                                    <span class="material-symbols-outlined">add_shopping_cart</span>
                                    Thêm
                                </button>
                            </div>
    `;

        container.appendChild(div);
    });
};

// Filter products
window.handleFilter = (selectedType, isAddActive = false) => {
    const sortValue = document.getElementById("sortPrice").value;
    let filteredProducts = [];

    if (selectedType === "all") {
        filteredProducts = allProducts;
    } else {
        filteredProducts = allProducts.filter(
            (p) => p.type.toLowerCase() === selectedType.toLowerCase(),
        );
    }
    if (sortValue === "0") {
        //tang dan
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortValue === "1") {
        //giam dan
        filteredProducts.sort((a, b) => b.price - a.price);
    }
    renderProducts(filteredProducts);

    if (isAddActive) {
        const buttons = document.querySelectorAll(".btn-filter");
        buttons.forEach((btn) => btn.classList.remove("btn-active"));
        const activeButton = Array.from(buttons).find(
            (btn) =>
                btn.textContent.trim().toLowerCase() ===
                selectedType.toLowerCase(),
        );
        if (activeButton) {
            activeButton.classList.add("btn-active");
        }
    }
};

document.querySelectorAll(".btn-filter").forEach((button) => {
    button.addEventListener("click", () => {
        const selectedType = button.getAttribute("data");
        handleFilter(selectedType, true);
    });
});

window.sortByPrice = () => {
    document.querySelector(".btn-filter.btn-active").click();
};

// Add to cart
window.addToCart = (productId) => {
    // add 1 to cartCount
    const cartCount = document.getElementById("cartCount");
    cartCount.innerText = parseInt(cartCount.innerText) + 1;

    const product = allProducts.find((p) => p.id === productId);
    if (!product) return;

    const existingItem = cart.find((item) => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        const newItem = new CartItem(
            product.id,
            product.name,
            product.price,
            product.img,
            1,
        );
        cart.push(newItem);
    }

    saveCart();
    renderCart();
};

// Increase quantity
window.increaseQty = (id) => {
    const item = cart.find((i) => i.id === id);
    if (item) {
        item.quantity += 1;
        saveCart();
        renderCart();
    }
};

// Decrease quantity
window.decreaseQty = (id) => {
    const item = cart.find((i) => i.id === id);
    if (item && item.quantity > 1) {
        item.quantity -= 1;
    } else {
        cart = cart.filter((i) => i.id !== id);
    }
    saveCart();
    renderCart();
};

// Remove product
window.removeFromCart = (id) => {
    cart = cart.filter((item) => item.id !== id);
    saveCart();
    renderCart();
};

// Render cart
const renderCart = () => {
    const cartBody = document.getElementById("cartBody");
    const cartCount = document.getElementById("cartCount");
    cartBody.innerHTML = "";

    let total = 0;
    let totalItems = 0;

    if (cart.length === 0) {
        cartBody.innerHTML = `
            <div class="cart-empty">
                <div class="cart-empty__icon">
                    <span class="material-symbols-outlined">shopping_cart</span>
                </div>
                <h3 class="cart-empty__title">Giỏ hàng trống</h3>
                <p class="cart-empty__desc">Chưa có sản phẩm nào trong giỏ hàng của bạn</p>
            </div>
        `;
        cartCount.textContent = "0";
        document.getElementById("totalPrice").textContent = "0₫";
        return;
    }

    cart.forEach((item) => {
        total += item.price * item.quantity;
        totalItems += item.quantity;

        const div = document.createElement("div");
        div.className = "cart-item";

        div.innerHTML = `
            <div class="cart-item__image">
                <img src="${item.img}" alt="${item.name}">
            </div>
            <div class="cart-item__info">
                <h4 class="cart-item__name">${item.name}</h4>
                <p class="cart-item__price">${new Intl.NumberFormat("vi-VN").format(item.price)}₫</p>
                <div class="cart-item__controls">
                    <div class="cart-item__qty">
                        <button class="cart-item__qty-btn" onclick="decreaseQty('${item.id}')" type="button">
                            <span class="material-symbols-outlined">remove</span>
                        </button>
                        <span class="cart-item__qty-value">${item.quantity}</span>
                        <button class="cart-item__qty-btn" onclick="increaseQty('${item.id}')" type="button">
                            <span class="material-symbols-outlined">add</span>
                        </button>
                    </div>
                    <button class="cart-item__remove" onclick="removeFromCart('${item.id}')" type="button">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </div>
            </div>
        `;

        cartBody.appendChild(div);
    });

    cartCount.textContent = totalItems;
    document.getElementById("totalPrice").textContent =
        new Intl.NumberFormat("vi-VN").format(total) + "₫";
};

// Save cart to localStorage
const saveCart = () => {
    localStorage.setItem("cart", JSON.stringify(cart));
};

// Checkout
window.checkout = () => {
    if (cart.length === 0) {
        showAlert(
            "warning",
            "Giỏ hàng trống",
            "Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.",
        );
        return;
    }

    cart = [];
    saveCart();
    renderCart();
    closeCart();
    showAlert(
        "success",
        "Thanh toán thành công!",
        "Cảm ơn bạn đã mua hàng. Đơn hàng của bạn sẽ được xử lý sớm nhất.",
    );
};

// Custom Alert Functions
window.showAlert = (type = "success", title = "Thành công!", message = "") => {
    const alertModal = document.getElementById("customAlert");
    const alertIcon = document.getElementById("alertIcon");
    const alertTitle = document.getElementById("alertTitle");
    const alertMessage = document.getElementById("alertMessage");

    // Set icon based on type
    const icons = {
        success: "check_circle",
        error: "cancel",
        warning: "warning",
        info: "info",
    };

    alertIcon.innerHTML = `<span class="material-symbols-outlined">${icons[type] || icons.success}</span>`;
    alertIcon.className = `custom-alert-icon custom-alert-icon--${type}`;
    alertTitle.textContent = title;
    alertMessage.textContent = message;

    alertModal.classList.add("active");
    document.body.style.overflow = "hidden";
};

window.closeAlert = () => {
    const alertModal = document.getElementById("customAlert");
    alertModal.classList.remove("active");
    document.body.style.overflow = "";
};

// go to product
document.getElementById("banner").addEventListener("click", () => {
    const el = document.getElementById("productSection");
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const offset = 5 * rem;

    const y = el.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top: y, behavior: "smooth" });
});

// Product Detail Functions
window.openProductDetail = (id) => {
    const sidebar = document.getElementById("productDetailSidebar");
    sidebar.classList.add("active");
    document.body.style.overflow = "hidden";

    const product = allProducts.find((p) => String(p.id) === String(id));
    if (!product) return;

    // Populate data
    document.getElementById("detailImg").src = product.img;
    document.getElementById("detailType").textContent = product.type;
    document.getElementById("detailName").textContent = product.name;
    document.getElementById("detailPrice").textContent =
        new Intl.NumberFormat("vi-VN").format(product.price) + "₫";
    document.getElementById("detailDesc").textContent =
        product.desc || "Không có mô tả";
    document.getElementById("detailScreen").textContent = product.screen;
    document.getElementById("detailBackCamera").textContent =
        product.backCamera;
    document.getElementById("detailFrontCamera").textContent =
        product.frontCamera;

    // Add to cart from detail sidebar
    const addToCartBtn = document.querySelector(".product-detail-btn--cart");
    const buyNowBtn = document.querySelector(".product-detail-btn--buy");

    addToCartBtn.onclick = () => {
        addToCart(product.id);
        closeProductDetail();
    };

    buyNowBtn.onclick = () => {
        addToCart(product.id);
        closeProductDetail();
        // Scroll to cart
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
};

window.closeProductDetail = () => {
    const sidebar = document.getElementById("productDetailSidebar");
    sidebar.classList.remove("active");
    document.body.style.overflow = "";
};

// Cart Sidebar Functions
window.openCart = () => {
    const sidebar = document.getElementById("cartSidebar");
    sidebar.classList.add("active");
    document.body.style.overflow = "hidden";
};

window.closeCart = () => {
    const sidebar = document.getElementById("cartSidebar");
    sidebar.classList.remove("active");
    document.body.style.overflow = "";
};

fetchProducts();
