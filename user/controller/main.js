import Product from "../model/Product.js";
import CartItem from "../model/CartItem.js";

const API_URL = "https://697826fe5b9c0aed1e882570.mockapi.io/api/v1/Products";

let allProducts = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Load products
async function fetchProducts() {
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
}

// Render products
function renderProducts(products) {
  const container = document.getElementById("productList");
  container.innerHTML = "";

  products.forEach((p) => {
    const div = document.createElement("div");
    div.className =
      "bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col";

    div.innerHTML = `
      <div class="h-48 w-full flex items-center justify-center bg-gray-100 overflow-hidden">
        <img src="${p.img}" alt="${p.name}" class="h-full w-full object-contain" />
      </div>

      <div class="p-4 flex flex-col flex-1">
        <h3 class="text-lg font-semibold mb-1">${p.name}</h3>
        <p class="text-sm text-gray-600">Màn hình: ${p.screen}</p>
        <p class="text-sm text-gray-600">Camera sau: ${p.backCamera}</p>
        <p class="text-sm text-gray-600">Camera trước: ${p.frontCamera}</p>

        <p class="text-red-500 font-bold text-lg mt-2">${p.price}$</p>
        <p class="text-sm mt-1 flex-1">${p.desc}</p>

        <button onclick="addToCart('${p.id}')"
          class="mt-4 bg-green-500 hover:bg-green-600 text-white py-2 rounded">
          Thêm vào giỏ hàng
        </button>
      </div>
    `;

    container.appendChild(div);
  });
}

// Filter dropdown
window.handleFilter = function () {
  const selectedType = document.getElementById("filterSelect").value;

  if (selectedType === "all") {
    renderProducts(allProducts);
  } else {
    const filtered = allProducts.filter(
      (p) => p.type.toLowerCase() === selectedType.toLowerCase(),
    );
    renderProducts(filtered);
  }
};

// Add to cart
window.addToCart = function (productId) {
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
window.increaseQty = function (id) {
  const item = cart.find((i) => i.id === id);
  if (item) {
    item.quantity += 1;
    saveCart();
    renderCart();
  }
};

// Decrease quantity
window.decreaseQty = function (id) {
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
window.removeFromCart = function (id) {
  cart = cart.filter((item) => item.id !== id);
  saveCart();
  renderCart();
};

// Render cart
function renderCart() {
  const tbody = document.getElementById("cartBody");
  tbody.innerHTML = "";

  let total = 0;

  cart.forEach((item) => {
    total += item.price * item.quantity;

    const tr = document.createElement("tr");

    tr.innerHTML = `
            <td class="border p-2 text-center">
                <img src="${item.img}" class="w-16 mx-auto">
            </td>
            <td class="border p-2">${item.name}</td>
            <td class="border p-2">${item.price}$</td>
            <td class="border p-2 text-center">
                <button onclick="decreaseQty('${item.id}')" class="px-2 bg-gray-300 rounded">-</button>
                <span class="mx-2">${item.quantity}</span>
                <button onclick="increaseQty('${item.id}')" class="px-2 bg-gray-300 rounded">+</button>
            </td>
            <td class="border p-2">${item.price * item.quantity}$</td>
            <td class="border p-2 text-center">
                <button onclick="removeFromCart('${item.id}')" class="bg-red-500 text-white px-3 py-1 rounded">
                    Xóa
                </button>
            </td>
        `;

    tbody.appendChild(tr);
  });

  document.getElementById("totalPrice").innerText = total;
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Checkout
window.checkout = function () {
  if (cart.length === 0) {
    alert("Giỏ hàng trống!");
    return;
  }

  if (confirm("Bạn có chắc muốn thanh toán?")) {
    cart = [];
    saveCart();
    renderCart();
    alert("Thanh toán thành công!");
  }
};

fetchProducts();
