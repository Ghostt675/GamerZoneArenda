// =========================
// ===== БАЗА ТОВАРОВ ======
// =========================
const products = [
    { id: 1, name: "PlayStation 5", price: 1500, img: "images/ps5.jpg", category: "playstation", popular: true },
    { id: 2, name: "Xbox Series X", price: 1400, img: "images/xbox.jpg", category: "xbox", popular: true }
];

// =========================
// ===== СОСТОЯНИЕ =========
// =========================
let cart = [];
let favorites = [];

// =========================
// ===== ГЕНЕРАЦИЯ КАРТОЧЕК
// =========================
function renderProducts(containerId, filterFn) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";

    const filtered = products.filter(filterFn);

    filtered.forEach(product => {
        const isFav = favorites.some(f => f.id === product.id);

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <div class="favorite-btn ${isFav ? "active" : ""}" onclick="toggleFavorite(${product.id})">❤️</div>
            <img src="${product.img}" alt="${product.name}">
            <p>${product.name}</p>
            <span>${product.price} ₽</span>
            <button class="add-cart-btn" onclick="addToCart(${product.id})">Добавить в корзину</button>
        `;

        container.appendChild(card);
    });
}

// =========================
// ===== КОРЗИНА ===========
// =========================
function addToCart(id) {
    if (!cart.includes(id)) cart.push(id);
    updateCartCount();
    renderCart();
}

function removeFromCart(id) {
    cart = cart.filter(item => item !== id);
    updateCartCount();
    renderCart();
}

function updateCartCount() {
    const el = document.getElementById("cartCount");
    if (el) el.innerText = cart.length;
}

function renderCart() {
    const container = document.getElementById("cartItems");
    if (!container) return;
    container.innerHTML = "";

    if (cart.length === 0) {
        container.innerHTML = "<p class='empty-text'>Корзина пуста</p>";
        document.getElementById("total").innerText = "";
        return;
    }

    let total = 0;
    cart.forEach(id => {
        const product = products.find(p => p.id === id);
        total += product.price;

        const item = document.createElement("div");
        item.className = "fav-card";

        item.innerHTML = `
            <img src="${product.img}">
            <p>${product.name}</p>
            <span>${product.price} ₽</span>
            <button class="remove-btn" onclick="removeFromCart(${product.id})">❌</button>
        `;
        container.appendChild(item);
    });

    document.getElementById("total").innerText = "Итого: " + total + " ₽";
}

// =========================
// ===== ИЗБРАННОЕ =========
// =========================
function toggleFavorite(id) {
    const index = favorites.findIndex(item => item.id === id);
    if (index === -1) {
        const product = products.find(p => p.id === id);
        favorites.push(product);
    } else {
        favorites.splice(index, 1);
    }
    refreshCards();
    renderFavorites();
}

function renderFavorites() {
    const container = document.getElementById("favoritesItems");
    if (!container) return;
    container.innerHTML = "";

    if (favorites.length === 0) {
        container.innerHTML = "<p class='empty-text'>Здесь будут ваши избранные товары</p>";
        return;
    }

    favorites.forEach(product => {
        const card = document.createElement("div");
        card.className = "fav-card";

        card.innerHTML = `
            <img src="${product.img}" alt="${product.name}">
            <p>${product.name}</p>
            <span>${product.price} ₽</span>
            <button class="add-cart-btn" onclick="addToCart(${product.id})">Добавить в корзину</button>
            <button class="remove-btn" onclick="toggleFavorite(${product.id})">❌</button>
        `;

        container.appendChild(card);
    });
}

// обновление состояния сердечек в каталоге
function refreshCards() {
    document.querySelectorAll(".favorite-btn").forEach(btn => {
        const id = Number(btn.getAttribute("onclick").match(/\d+/)[0]);
        btn.classList.toggle("active", favorites.some(f => f.id === id));
    });
}

// =========================
// ===== МОДАЛКИ ===========
// =========================
function openCart() {
    document.getElementById("cartModal").classList.add("open");
    renderCart();
    showOverlay();
}

function closeCart() {
    document.getElementById("cartModal").classList.remove("open");
    hideOverlay();
}

function openFavorites() {
    document.getElementById("favoritesModal").classList.add("open");
    renderFavorites();
    showOverlay();
}

function closeFavorites() {
    document.getElementById("favoritesModal").classList.remove("open");
    hideOverlay();
}

// =========================
// ===== OVERLAY ============
// =========================
function showOverlay() {
    let overlay = document.querySelector(".overlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.className = "overlay";
        overlay.addEventListener("click", () => {
            closeCart();
            closeFavorites();
        });
        document.body.appendChild(overlay);
    }
    overlay.classList.add("show");
}

function hideOverlay() {
    const overlay = document.querySelector(".overlay");
    if (overlay) overlay.classList.remove("show");
}

// закрытие модалок при клике на главное меню
document.querySelectorAll(".products-btn, .nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        closeCart();
        closeFavorites();
    });
});

// =========================
// ===== ЗАПУСК ============
// =========================
document.addEventListener("DOMContentLoaded", () => {
    renderProducts("popularProducts", p => p.popular === true);
    updateCartCount();
});
