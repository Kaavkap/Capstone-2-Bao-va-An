import { ALERT_ICONS } from "./constants.js";

let alertModal = null;
let confirmCallback = null;

// Khởi tạo alert modal
const init = () => {
    alertModal = document.getElementById("customAlert");
    attachListeners();
};

// Hiển thị alert
const show = (
    type = "success",
    title = "Thành công!",
    message = "",
    onConfirm = null,
) => {
    if (!alertModal) {
        console.error("Alert modal chưa được khởi tạo!");
        return;
    }

    const alertIcon = document.getElementById("alertIcon");
    const alertTitle = document.getElementById("alertTitle");
    const alertMessage = document.getElementById("alertMessage");
    const singleBtn = document.getElementById("alertSingleBtn");
    const confirmBtns = document.getElementById("alertConfirmBtns");

    alertIcon.innerHTML = `<span class="material-symbols-outlined">${ALERT_ICONS[type] || ALERT_ICONS.success}</span>`;
    alertIcon.className = `custom-alert-icon custom-alert-icon--${type}`;
    alertTitle.textContent = title;
    alertMessage.textContent = message;

    // Nếu có callback -> hiển thị 2 nút (Cancel/Confirm)
    if (onConfirm && typeof onConfirm === "function") {
        confirmCallback = onConfirm;
        singleBtn.style.display = "none";
        confirmBtns.style.display = "flex";
    } else {
        confirmCallback = null;
        singleBtn.style.display = "block";
        confirmBtns.style.display = "none";
    }

    alertModal.classList.add("active");
};

// Đóng alert
const close = () => {
    if (alertModal) {
        alertModal.classList.remove("active");
        confirmCallback = null;
    }
};

// Xác nhận (cho confirm dialog)
const confirm = () => {
    if (confirmCallback) {
        confirmCallback();
    }
    close();
};

// Hủy (cho confirm dialog)
const cancel = () => {
    close();
};

// Gắn event listeners
const attachListeners = () => {
    // Nút đóng alert (single button)
    const singleBtn = document.getElementById("alertSingleBtn");
    if (singleBtn) {
        singleBtn.onclick = () => close();
    }

    // Nút Cancel (confirm dialog)
    const cancelBtn = document.getElementById("alertCancelBtn");
    if (cancelBtn) {
        cancelBtn.onclick = () => cancel();
    }

    // Nút Confirm (confirm dialog)
    const confirmBtn = document.getElementById("alertConfirmBtn");
    if (confirmBtn) {
        confirmBtn.onclick = () => confirm();
    }

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
