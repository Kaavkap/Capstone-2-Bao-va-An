// Toggle Dark/Light theme cho B&A Design System
const THEME_KEY = "ba-theme";
const html = document.documentElement;
const toggleBtn = document.getElementById("theme-toggle");

// Hàm áp dụng theme
const applyTheme = (theme) => {
  if (theme === "dark") {
    html.classList.add("dark");
  } else {
    html.classList.remove("dark");
  }
};

// Lấy theme hiện tại từ localStorage hoặc hệ thống
const getCurrentTheme = () => {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) return saved;
};

// Khởi tạo theme lúc load trang
const currentTheme = getCurrentTheme();
if (currentTheme) applyTheme(currentTheme);

// Toggle khi click button
toggleBtn.addEventListener("click", () => {
  const isDark = html.classList.contains("dark");
  const newTheme = isDark ? "light" : "dark";

  applyTheme(newTheme);
  localStorage.setItem(THEME_KEY, newTheme);
});
