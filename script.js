// ===== БАЗА ТОВАРОВ =====
const products = [
    { id: 1, name: "PlayStation 5", price: 1500, img: "images/ps5.jpg", category: "playstation", popular: true },
    { id: 2, name: "Xbox Series X", price: 1400, img: "images/xbox.jpg", category: "xbox", popular: true }
];

// ===== СОСТОЯНИЕ =====
let cart = [];       // хранит id товаров
let favorites = [];  // хранит id товаров

// ===== ГЕНЕРАЦИЯ КАРТОЧЕК =====
function renderProducts(containerId, filterFn) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";

    const filtered = products.filter(filterFn);

    filtered.forEach(product => {
        const isFav = favorites.includes(product.id);

        const card = document.createElement("div");
        card.className = "card";

        // favorite-btn получает data-id для поиска кнопки из других функций
        card.innerHTML = `
            <div class="favorite-btn ${isFav ? "active" : ""}" data-id="${product.id}"
                 onclick="toggleFavorite(${product.id}, this)">
                <!-- используем простой символ сердца -->
                ♡
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
    if (!cart.includes(id)) {
        cart.push(id);
        updateCartCount();
        renderCart();
    }
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
        if (!product) return;
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
// btnEl — элемент кнопки в карточке (this). Если не передали, находим кнопку по data-id.
function toggleFavorite(id, btnEl) {
    const idx = favorites.indexOf(id);
    if (idx === -1) {
        favorites.push(id);
    } else {
        favorites.splice(idx, 1);
    }

    // Обновить вид кнопки (если есть)
    if (!btnEl) {
        btnEl = document.querySelector(`.favorite-btn[data-id="${id}"]`);
    }
    if (btnEl) {
        btnEl.classList.toggle("active", favorites.includes(id));
    }

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

    favorites.forEach(id => {
        const product = products.find(p => p.id === id);
        if (!product) return;

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
    const m = document.getElementById("cartModal");
    if (!m) return;
    m.classList.add("open");
    renderCart();
    showOverlay();
}

function closeCart() {
    const m = document.getElementById("cartModal");
    if (!m) return;
    m.classList.remove("open");
    hideOverlay();
}

function openFavorites() {
    const f = document.getElementById("favoritesModal");
    if (!f) return;
    f.classList.add("open");
    renderFavorites();
    showOverlay();
}

function closeFavorites() {
    const f = document.getElementById("favoritesModal");
    if (!f) return;
    f.classList.remove("open");
    hideOverlay();
}

// ===== OVERLAY =====
function showOverlay() {
    const overlay = document.getElementById("overlay");
    if (!overlay) return;
    overlay.classList.add("show");
}

function hideOverlay() {
    const overlay = document.getElementById("overlay");
    if (!overlay) return;
    overlay.classList.remove("show");
}

// ===== SIDEBAR (каталог) =====
function toggleCatalog() {
    const sidebar = document.getElementById("sidebar");
    if (!sidebar) return;
    sidebar.classList.toggle("open");
}

// ===== ИНИЦИАЛИЗАЦИЯ и привязки событий =====
document.addEventListener("DOMContentLoaded", () => {
    // отрисовать популярные
    renderProducts("popularProducts", p => p.popular === true);

    // обновить счётчик корзины
    updateCartCount();

    // overlay клик закрывает модалки (если overlay элемент есть в HTML)
    const overlay = document.getElementById("overlay");
    if (overlay) {
        overlay.addEventListener("click", () => {
            closeCart();
            closeFavorites();
        });
    }

    // закрывать модалки при клике по главным кнопкам (например, чтобы не было наложения)
    document.querySelectorAll(".products-btn, .nav-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            closeCart();
            closeFavorites();
        });
    });
});
