// =======================
// ===== СОСТОЯНИЕ =======
// =======================
let cart = [];
let favorites = [];

// =======================
// ===== КАТАЛОГ =========
// =======================
function toggleCatalog() {
    document.getElementById("sidebar").classList.toggle("open");
}

// =======================
// ===== КОРЗИНА =========
// =======================
function addToCart(name, price) {

    // нельзя добавить один и тот же товар дважды
    if (cart.find(item => item.name === name)) return;

    cart.push({ name, price });
    updateCart();
}

function updateCart() {
    document.getElementById("cartCount").innerText = cart.length;
}

function openCart() {

    const modal = document.getElementById("cartModal");
    const items = document.getElementById("cartItems");

    items.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {

        items.innerHTML += `
            <p>
                ${item.name} — ${item.price} ₽
                <button onclick="removeFromCart(${index})">❌</button>
            </p>
        `;

        total += item.price;
    });

    document.getElementById("total").innerText =
        "Итого: " + total + " ₽";

    modal.classList.add("open");

    createOverlay(closeCart);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
    openCart();
}

function closeCart() {
    document.getElementById("cartModal").classList.remove("open");
    removeOverlay();
}

// =======================
// ===== ИЗБРАННОЕ =======
// =======================
function toggleFavorite(name, price, img) {

    const index = favorites.findIndex(item => item.name === name);

    if (index === -1) {
        favorites.push({ name, price, img });
    } else {
        favorites.splice(index, 1);
    }

    renderFavorites();
}

function renderFavorites() {

    const container = document.getElementById("favoritesItems");
    container.innerHTML = "";

    if (favorites.length === 0) {
        container.innerHTML =
            '<p class="empty-text">Здесь будут ваши избранные товары</p>';
        return;
    }

    favorites.forEach((item, index) => {

        const card = document.createElement("div");
        card.className = "fav-card";

        card.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <p>${item.name}</p>
            <span>${item.price} ₽</span>

            <button class="add-cart-btn"
                onclick="addToCart('${item.name}', ${item.price})">
                Добавить в корзину
            </button>

            <button onclick="removeFromFavorites(${index})">
                ❌
            </button>
        `;

        container.appendChild(card);
    });
}

function removeFromFavorites(index) {
    favorites.splice(index, 1);
    renderFavorites();
}

function openFavorites() {
    document.getElementById("favoritesModal").classList.add("open");
    createOverlay(closeFavorites);
}

function closeFavorites() {
    document.getElementById("favoritesModal").classList.remove("open");
    removeOverlay();
}

// =======================
// ===== OVERLAY =========
// =======================
function createOverlay(closeFunction) {

    let overlay = document.querySelector(".overlay");

    if (!overlay) {
        overlay = document.createElement("div");
        overlay.classList.add("overlay");
        document.body.appendChild(overlay);
    }

    overlay.classList.add("show");
    overlay.onclick = closeFunction;
}

function removeOverlay() {
    const overlay = document.querySelector(".overlay");
    if (overlay) overlay.classList.remove("show");
}

// =======================
// ===== ОФОРМЛЕНИЕ ======
// =======================
document.addEventListener("DOMContentLoaded", () => {

    const orderBtn = document.querySelector(".orderBtn");

    if (orderBtn) {
        orderBtn.addEventListener("click", () => {

            if (cart.length === 0) {
                alert("Корзина пуста!");
                return;
            }

            alert("Заказ оформлен!");
            cart = [];
            updateCart();
            closeCart();
        });
    }

    updateCart();
});

