import CartService from "../services/CartService.js";
import { formatPrice } from "../utils/formatter.js";
import Alert from "../utils/alert.js";

let cartBadge = null;

// Khởi tạo
const init = () => {
    cartBadge = document.getElementById("cartCount");
    render();
    attachListeners();
};

// Render giỏ hàng
const render = () => {
    const cartBody = document.getElementById("cartBody");
    const totalPriceEl = document.getElementById("totalPrice");

    cartBody.innerHTML = "";

    if (CartService.isEmpty()) {
        cartBody.innerHTML = `
            <div class="cart-empty">
                <div class="cart-empty__icon">
                    <span class="material-symbols-outlined">shopping_cart</span>
                </div>
                <h3 class="cart-empty__title">Giỏ hàng trống</h3>
                <p class="cart-empty__desc">Chưa có sản phẩm nào trong giỏ hàng của bạn</p>
            </div>
        `;
        updateBadge(0);
        totalPriceEl.textContent = "0₫";
        return;
    }

    const cart = CartService.getAll();
    cart.forEach((item) => {
        const div = document.createElement("div");
        div.className = "cart-item";

        div.innerHTML = `
            <div class="cart-item__image">
                <img src="${item.img}" alt="${item.name}">
            </div>
            <div class="cart-item__info">
                <h4 class="cart-item__name">${item.name}</h4>
                <p class="cart-item__price">${formatPrice(item.price)}</p>
                <div class="cart-item__controls">
                    <div class="cart-item__qty">
                        <button class="cart-item__qty-btn btn-decrease" data-id="${item.id}" type="button">
                            <span class="material-symbols-outlined">remove</span>
                        </button>
                        <span class="cart-item__qty-value">${item.quantity}</span>
                        <button class="cart-item__qty-btn btn-increase" data-id="${item.id}" type="button">
                            <span class="material-symbols-outlined">add</span>
                        </button>
                    </div>
                    <button class="cart-item__remove btn-remove" data-id="${item.id}" type="button">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </div>
            </div>
        `;

        cartBody.appendChild(div);
    });

    updateBadge(CartService.getTotalItems());
    totalPriceEl.textContent = formatPrice(CartService.getTotal());

    attachCartItemListeners();
};

// Gắn event listeners cho các nút trong cart item
const attachCartItemListeners = () => {
    // Nút tăng số lượng
    document.querySelectorAll(".btn-increase").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const id = e.currentTarget.getAttribute("data-id");
            CartService.increaseQuantity(id);
            render();
        });
    });

    // Nút giảm số lượng
    document.querySelectorAll(".btn-decrease").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const id = e.currentTarget.getAttribute("data-id");
            CartService.decreaseQuantity(id);
            render();
        });
    });

    // Nút xóa
    document.querySelectorAll(".btn-remove").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const id = e.currentTarget.getAttribute("data-id");
            CartService.removeItem(id);
            render();
        });
    });
};

// Gắn các event listeners chính
const attachListeners = () => {
    // Nút mở giỏ hàng
    const openCartBtn = document.querySelector('[onclick="openCart()"]');
    if (openCartBtn) {
        openCartBtn.onclick = () => open();
    }

    // Nút đóng giỏ hàng
    document.querySelectorAll('[onclick="closeCart()"]').forEach((btn) => {
        btn.onclick = () => close();
    });

    // Nút thanh toán
    const checkoutBtn = document.querySelector('[onclick="checkout()"]');
    if (checkoutBtn) {
        checkoutBtn.onclick = () => checkout();
    }

    // Nút xóa tất cả
    const clearCartBtn = document.getElementById("clearCartBtn");
    if (clearCartBtn) {
        clearCartBtn.addEventListener("click", clearAll);
    }
};

// Thêm sản phẩm vào giỏ
const addProduct = (product) => {
    CartService.addItem(product);
    render();
};

// Thanh toán
const checkout = () => {
    if (CartService.isEmpty()) {
        Alert.show(
            "warning",
            "Giỏ hàng trống",
            "Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.",
        );
        return;
    }

    CartService.clear();
    render();
    close();

    Alert.show(
        "success",
        "Thanh toán thành công!",
        "Cảm ơn bạn đã mua hàng. Đơn hàng của bạn sẽ được xử lý sớm nhất.",
    );
};

// Xóa toàn bộ giỏ hàng
const clearAll = () => {
    if (CartService.isEmpty()) {
        Alert.show("info", "Giỏ hàng trống", "Không có sản phẩm nào để xóa");
        return;
    }

    Alert.show(
        "warning",
        "Xác nhận xóa",
        "Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng?",
        () => {
            CartService.clear();
            render();
            Alert.show(
                "success",
                "Đã xóa",
                "Đã xóa tất cả sản phẩm khỏi giỏ hàng",
            );
        },
    );
};

// Mở sidebar giỏ hàng
const open = () => {
    const sidebar = document.getElementById("cartSidebar");
    sidebar.classList.add("active");
};

// Đóng sidebar giỏ hàng
const close = () => {
    const sidebar = document.getElementById("cartSidebar");
    sidebar.classList.remove("active");
};

// Cập nhật badge số lượng
const updateBadge = (count) => {
    if (cartBadge) {
        cartBadge.textContent = count;
    }
};

export default {
    init,
    render,
    addProduct,
    open,
    close,
};
