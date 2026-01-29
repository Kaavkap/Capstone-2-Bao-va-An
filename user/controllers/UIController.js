import { formatPrice } from "../utils/formatter.js";
import { scrollToElement } from "../utils/helpers.js";
import StorageService from "../services/StorageService.js";
import Alert from "../utils/alert.js";

let productDetailSidebar = null;
let currentProductId = null;

// Khởi tạo UI
const init = () => {
    productDetailSidebar = document.getElementById("productDetailSidebar");

    initTheme();
    initMobileNav();
    attachBannerListener();
    attachProductDetailListeners();
};

// Khởi tạo theme
const initTheme = () => {
    const html = document.documentElement;
    const toggleBtn = document.getElementById("theme-toggle");
    const savedTheme = StorageService.getTheme();

    // Hàm update icon
    const updateThemeIcon = (isDark) => {
        if (toggleBtn) {
            const icon = toggleBtn.querySelector("i");
            if (icon) {
                // Light mode -> moon icon, Dark mode -> sun icon
                icon.className = isDark ? "fa fa-sun" : "fa fa-moon";
                toggleBtn.title = isDark
                    ? "Toggle Light Mode"
                    : "Toggle Dark Mode";
            }
        }
    };

    // Áp dụng theme đã lưu
    if (savedTheme === "dark") {
        html.classList.add("dark");
        updateThemeIcon(true);
    } else {
        updateThemeIcon(false);
    }

    // Toggle theme khi click
    if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            const isDark = html.classList.contains("dark");
            const newTheme = isDark ? "light" : "dark";

            if (newTheme === "dark") {
                html.classList.add("dark");
            } else {
                html.classList.remove("dark");
            }

            updateThemeIcon(newTheme === "dark");
            StorageService.setTheme(newTheme);
        });
    }
};

// Khởi tạo mobile navigation
const initMobileNav = () => {
    const mobileNav = document.getElementById("mobileNav");
    const mobileNavOverlay = document.getElementById("mobileNavOverlay");
    const mobileNavClose = document.getElementById("mobileNavClose");
    const mobileMenuBtn = document.querySelector(".mobile-menu-btn");

    if (!mobileNav || !mobileMenuBtn) return;

    // Mở mobile nav
    const openMobileNav = () => {
        mobileNav.classList.add("active");
        document.body.style.overflow = "hidden";
    };

    // Đóng mobile nav
    const closeMobileNav = () => {
        mobileNav.classList.remove("active");
        document.body.style.overflow = "";
    };

    // Event listeners
    mobileMenuBtn.addEventListener("click", openMobileNav);
    mobileNavClose?.addEventListener("click", closeMobileNav);
    mobileNavOverlay?.addEventListener("click", closeMobileNav);

    // Đóng khi click vào link
    document.querySelectorAll(".mobile-nav__link").forEach((link) => {
        link.addEventListener("click", () => {
            // Delay để navigation hoàn thành trước khi đóng
            setTimeout(closeMobileNav, 100);
        });
    });
};

// Gắn event listener cho banner
const attachBannerListener = () => {
    const banner = document.getElementById("banner");
    if (banner) {
        banner.addEventListener("click", () => {
            scrollToElement("productSection", 5);
        });
    }
};

// Mở popup chi tiết sản phẩm
const openProductDetail = (product) => {
    if (!product) return;

    productDetailSidebar.classList.add("active");
    document.body.style.overflow = "hidden";

    // Điền dữ liệu vào popup
    document.getElementById("detailImg").src = product.img;
    document.getElementById("detailType").textContent = product.type;
    document.getElementById("detailName").textContent = product.name;
    document.getElementById("detailPrice").textContent = formatPrice(
        product.price,
    );
    document.getElementById("detailDesc").textContent =
        product.desc || "Không có mô tả";
    document.getElementById("detailScreen").textContent = product.screen;
    document.getElementById("detailBackCamera").textContent =
        product.backCamera;
    document.getElementById("detailFrontCamera").textContent =
        product.frontCamera;

    currentProductId = product.id;
};

// Đóng popup chi tiết sản phẩm
const closeProductDetail = () => {
    productDetailSidebar.classList.remove("active");
    document.body.style.overflow = "";
};

// Gắn event listeners cho product detail
const attachProductDetailListeners = () => {
    // Nút đóng
    document
        .querySelectorAll('[onclick="closeProductDetail()"]')
        .forEach((btn) => {
            btn.onclick = () => closeProductDetail();
        });

    // Click vào overlay để đóng
    if (productDetailSidebar) {
        productDetailSidebar.addEventListener("click", (e) => {
            if (e.target === productDetailSidebar) {
                closeProductDetail();
            }
        });
    }

    // Nút Thêm vào giỏ
    const addToCartBtn = document.querySelector(".product-detail-btn--cart");
    if (addToCartBtn) {
        addToCartBtn.addEventListener("click", () => {
            // Dispatch event để app.js xử lý
            window.dispatchEvent(
                new CustomEvent("addToCart", { detail: currentProductId }),
            );
            closeProductDetail();
        });
    }

    // Nút Mua ngay
    const buyNowBtn = document.querySelector(".product-detail-btn--buy");
    if (buyNowBtn) {
        buyNowBtn.addEventListener("click", () => {
            // Dispatch event để app.js xử lý
            window.dispatchEvent(
                new CustomEvent("addToCart", { detail: currentProductId }),
            );
            closeProductDetail();

            // Mở giỏ hàng luôn (thao tác DOM trực tiếp)
            setTimeout(() => {
                const cartSidebar = document.getElementById("cartSidebar");
                if (cartSidebar) {
                    cartSidebar.classList.add("active");
                }
            }, 300);
        });
    }

    // Lắng nghe event mở product detail
    window.addEventListener("openProductDetail", (e) => {
        const productId = e.detail;
        window.dispatchEvent(
            new CustomEvent("getProductById", { detail: productId }),
        );
    });
};

export default {
    init,
    openProductDetail,
    closeProductDetail,
};
