// ===== БАЗА ТОВАРОВ =====
const products = [
    { id: 1, name: "PlayStation 5", price: 1500, img: "images/ps5.jpg", category: "playstation", popular: true },
    { id: 2, name: "Xbox Series X", price: 1400, img: "images/xbox.jpg", category: "xbox", popular: true }
];

let cart = [];
let favorites = [];

// ===== ГЕНЕРАЦИЯ КАРТОЧЕК =====
function renderProducts(containerId, filterFn) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";

    products.filter(filterFn).forEach(product => {
        const isFav = favorites.some(f => f.id === product.id);

        const card = document.createElement("div");
        card.className = "card";

        // Сердце через SVG, пустое по умолчанию, заполняется при добавлении
        card.innerHTML = `
            <div class="favorite-btn ${isFav ? "active" : ""}" onclick="toggleFavorite(${product.id}, this)">
                <svg viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 
                    4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 
                    19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z">
                    </path>
                </svg>
            </div>
            <img src="${product.img}" alt="${product.name}">
            <p>${product.name}</p>
            <span>${product.price} ₽</span>
            <button class="add-cart-btn" onclick="addToCart(${product.id})">Добавить в корзину</button>
        `;
        container.appendChild(card);
    });
}

// ===== КОРЗИНА =====
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
    container.innerHTML = "";

    if (!cart.length) {
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
            <img src="${product.img}" alt="${product.name}">
            <p>${product.name}</p>
            <span>${product.price} ₽</span>
            <button class="remove-btn" onclick="removeFromCart(${product.id})">❌</button>
        `;
        container.appendChild(item);
    });
    document.getElementById("total").innerText = "Итого: " + total + " ₽";
}

// ===== ИЗБРАННОЕ =====
function toggleFavorite(id, btnEl) {
    const index = favorites.findIndex(item => item.id === id);
    if (index === -1) favorites.push(products.find(p => p.id === id));
    else favorites.splice(index, 1);

    renderFavorites();

    // Обновляем состояние сердца
    if (btnEl) btnEl.classList.toggle("active");
}

function renderFavorites() {
    const container = document.getElementById("favoritesItems");
    container.innerHTML = "";

    if (!favorites.length) {
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

// ===== МОДАЛКИ =====
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

// ===== OVERLAY =====
function showOverlay() {
    let overlay = document.querySelector(".overlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.className = "overlay";
        overlay.addEventListener("click", () => { closeCart(); closeFavorites(); });
        document.body.appendChild(overlay);
    }
    overlay.classList.add("show");
}

function hideOverlay() {
    const overlay = document.querySelector(".overlay");
    if (overlay) overlay.classList.remove("show");
}

// ===== SIDEBAR =====
function toggleCatalog() { document.getElementById("sidebar").classList.toggle("open"); }

// Закрытие модалок при клике на главное меню
document.querySelectorAll(".products-btn, .nav-btn").forEach(btn => {
    btn.addEventListener("click", () => { closeCart(); closeFavorites(); });
});

// ===== ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener("DOMContentLoaded", () => {
    renderProducts("popularProducts", p => p.popular);
    updateCartCount();
});
