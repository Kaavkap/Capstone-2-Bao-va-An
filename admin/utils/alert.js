import { ALERT_ICONS } from "./constants.js";

let alertModal = null;

// Khởi tạo alert modal
const init = () => {
    alertModal = document.getElementById("customAlert");

    // Nút đóng alert
    const btnClose = document.getElementById("btnCloseAlert");
    if (btnClose) {
        btnClose.onclick = () => close();
    }

    // Click vào overlay để đóng
    if (alertModal) {
        const overlay = alertModal.querySelector(".custom-alert-overlay");
        if (overlay) {
            overlay.addEventListener("click", () => close());
        }
    }
};

// Hiển thị alert
const show = (type = "success", title = "Thành công!", message = "") => {
    if (!alertModal) return;

    const alertIcon = document.getElementById("alertIcon");
    const alertTitle = document.getElementById("alertTitle");
    const alertMessage = document.getElementById("alertMessage");

    if (alertIcon) {
        alertIcon.innerHTML = `<span class="material-symbols-outlined">${ALERT_ICONS[type] || ALERT_ICONS.success}</span>`;
        alertIcon.className = `custom-alert-icon custom-alert-icon--${type}`;
    }

    if (alertTitle) alertTitle.textContent = title;
    if (alertMessage) alertMessage.textContent = message;

    alertModal.classList.add("active");
};

// Đóng alert
const close = () => {
    if (!alertModal) return;
    alertModal.classList.remove("active");
};

export default {
    init,
    show,
    close,
};
