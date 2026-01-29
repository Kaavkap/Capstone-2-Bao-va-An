import { STORAGE_KEYS } from "../utils/constants.js";

// Khởi tạo UI
const init = () => {
    initTheme();
    initMobileNav();
};

// Khởi tạo theme
const initTheme = () => {
    const html = document.documentElement;
    const toggleBtn = document.getElementById("theme-toggle");
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);

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
            html.classList.toggle("dark");
            const newTheme = html.classList.contains("dark") ? "dark" : "light";
            updateThemeIcon(newTheme === "dark");
            localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
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
            setTimeout(closeMobileNav, 100);
        });
    });
};

export default {
    init,
};
