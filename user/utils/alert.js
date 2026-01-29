import { ALERT_ICONS } from "./constants.js";

let alertModal = null;

// Khởi tạo alert modal
const init = () => {
    alertModal = document.getElementById("customAlert");
    attachListeners();
};

// Hiển thị alert
const show = (type = "success", title = "Thành công!", message = "") => {
    if (!alertModal) {
        console.error("Alert modal chưa được khởi tạo!");
        return;
    }

    const alertIcon = document.getElementById("alertIcon");
    const alertTitle = document.getElementById("alertTitle");
    const alertMessage = document.getElementById("alertMessage");

    alertIcon.innerHTML = `<span class="material-symbols-outlined">${ALERT_ICONS[type] || ALERT_ICONS.success}</span>`;
    alertIcon.className = `custom-alert-icon custom-alert-icon--${type}`;
    alertTitle.textContent = title;
    alertMessage.textContent = message;

    alertModal.classList.add("active");
};

// Đóng alert
const close = () => {
    if (alertModal) {
        alertModal.classList.remove("active");
    }
};

// Gắn event listeners
const attachListeners = () => {
    // Nút đóng alert
    document.querySelectorAll('[onclick="closeAlert()"]').forEach((btn) => {
        btn.onclick = () => close();
    });

    // Click vào overlay để đóng
    if (alertModal) {
        alertModal.addEventListener("click", (e) => {
            if (e.target === alertModal) {
                close();
            }
        });
    }
};

export default {
    init,
    show,
    close,
};
