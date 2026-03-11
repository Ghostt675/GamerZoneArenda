// ===== БАЗА ТОВАРОВ =====
const products = [
    { id: 1, name: "PlayStation 5", price: 1100, img: "images/ps5.jpg", category: "playstation", popular: true },
    { id: 2, name: "Xbox Series X", price: 1400, img: "images/xbox.jpg", category: "xbox", popular: true },
    { id: 3, name: "Call Of Duty WW2", price: 500, img: "images/cdww2.png", category: "accounts", popular: true }
];

// ===== LOCAL STORAGE =====
let cart = {}; // Объект для хранения товаров и их количеств
let favorites = []; // Массив избранных товаров

// Сохранение корзины в localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Сохранение избранного в localStorage
function saveFavoritesToLocalStorage() {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Загрузка корзины из localStorage
function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    } else {
        cart = {};
    }
}

// Загрузка избранного из localStorage
function loadFavoritesFromLocalStorage() {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
        favorites = JSON.parse(savedFavorites);
    } else {
        favorites = [];
    }
}

// ===== ГЕНЕРАЦИЯ КАРТОЧЕК =====
function renderProducts(containerId, filterFn) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";

    products.filter(filterFn).forEach(product => {
        const isFav = favorites.includes(product.id);
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <div class="favorite-btn ${isFav ? "active" : ""}" 
                 data-id="${product.id}" 
                 onclick="toggleFavorite(${product.id}, this)"></div>
            <img src="${product.img}" alt="${product.name}">
            <p>${product.name}</p>
            <span>${product.price} ₽</span>
            <button class="add-cart-btn" 
                data-id="${product.id}" 
                onclick="addToCart(${product.id}, this)">
                ${cart[product.id] ? "В корзине" : "Добавить в корзину"}
            </button>
        `;
        container.appendChild(card);
    });
}

// ===== АНИМАЦИЯ ТОВАР ЛЕТИТ В КОРЗИНУ =====
function flyToCart(btnEl) {
    const card = btnEl.closest(".card");
    const img = card ? card.querySelector("img") : null;
    const cartIcon = document.querySelector(".cart-icon");

    if (!img || !cartIcon) return;

    const imgRect = img.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    const flyingImg = img.cloneNode(true);

    flyingImg.style.position = "fixed";
    flyingImg.style.left = imgRect.left + "px";
    flyingImg.style.top = imgRect.top + "px";
    flyingImg.style.width = imgRect.width + "px";
    flyingImg.style.height = imgRect.height + "px";
    flyingImg.style.transition = "all 0.7s ease";
    flyingImg.style.zIndex = "9999";
    flyingImg.style.pointerEvents = "none";

    document.body.appendChild(flyingImg);

    setTimeout(() => {
        flyingImg.style.left = cartRect.left + "px";
        flyingImg.style.top = cartRect.top + "px";
        flyingImg.style.width = "30px";
        flyingImg.style.height = "30px";
        flyingImg.style.opacity = "0.2";
    }, 10);

    setTimeout(() => {
        flyingImg.remove();
    }, 700);
}

// Добавление товара в корзину
function addToCart(id, btnEl) {
    if (cart.hasOwnProperty(id)) {
        cart[id]++;
    } else {
        cart[id] = 1;
    }

    saveCartToLocalStorage();
    updateCartCount();
    renderCart();
    renderProducts("popularProducts", p => p.popular);

    if (btnEl) {
        flyToCart(btnEl);
    }
}

// Удаление товара из корзины
function removeFromCart(id) {
    if (cart.hasOwnProperty(id)) {
        if (cart[id] > 1) {
            cart[id]--;
        } else {
            delete cart[id];
        }
    }

    saveCartToLocalStorage();
    updateCartCount();
    renderCart();
}

// Обновление числа товаров в корзине
function updateCartCount() {
    const el = document.getElementById("cartCount");
    if (el) {
        const totalQuantity = Object.values(cart).reduce((sum, value) => sum + value, 0);
        el.innerText = totalQuantity;
    }
}

// Рендеринг корзины
function renderCart() {
    const container = document.getElementById("cartItems");
    container.innerHTML = "";

    if (Object.keys(cart).length === 0) {
        container.innerHTML = "<p class='empty-text'>Корзина пуста</p>";
        document.getElementById("total").innerText = "";
        return;
    }

    let total = 0;
    Object.keys(cart).forEach(id => {
        const product = products.find(p => p.id === parseInt(id));
        if (!product) return;
        const quantity = cart[id];
        total += product.price * quantity;

        const item = document.createElement("div");
        item.className = "fav-card";
        item.innerHTML = `
            <img src="${product.img}" alt="${product.name}">
            <p>${product.name} (${quantity} шт.)</p>
            <span>${product.price * quantity} ₽</span>
            <button class="remove-btn" onclick="removeFromCart(${id})">❌</button>
        `;
        container.appendChild(item);
    });
    document.getElementById("total").innerText = "Итого: " + total + " ₽";
}

// Рендеринг избранных товаров
function renderFavorites() {
    const container = document.getElementById("favoritesItems");
    container.innerHTML = "";

    if (!favorites.length) {
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
            <button class="add-cart-btn"
                onclick="addToCart(${product.id}, this)">
                ${cart[product.id] ? "В корзине" : "Добавить в корзину"}
            </button>
            <button class="remove-btn"
            onclick="toggleFavorite(${product.id})">❌</button>
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
    const overlay = document.getElementById("overlay");
    overlay.classList.add("show");
}

function hideOverlay() {
    const overlay = document.getElementById("overlay");
    overlay.classList.remove("show");
}

// ===== SIDEBAR =====
function toggleCatalog() {
    const sidebar = document.getElementById("sidebar");
    const navbar = document.querySelector(".navbar");
    if (!sidebar || !navbar) return;

    sidebar.classList.toggle("open");
    navbar.classList.toggle("shifted");
}

// Функционал избранного
function toggleFavorite(id, btnEl) {
    const idx = favorites.indexOf(id);
    if (idx === -1) {
        favorites.push(id);
    } else {
        favorites.splice(idx, 1);
    }

    if (!btnEl) {
        btnEl = document.querySelector(`.favorite-btn[data-id="${id}"]`);
    }
    if (btnEl) {
        btnEl.classList.toggle("active", favorites.includes(id));

        if (favorites.includes(id)) {
            btnEl.style.transform = "scale(1.3)";
            setTimeout(() => {
                btnEl.style.transform = "scale(1)";
            }, 200);
        }
    }

    saveFavoritesToLocalStorage();
    renderFavorites();
    renderProducts("popularProducts", p => p.popular);
}

// ===== ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener("DOMContentLoaded", () => {
    loadCartFromLocalStorage();
    loadFavoritesFromLocalStorage();
    renderProducts("popularProducts", p => p.popular);
    updateCartCount();

    const overlay = document.getElementById("overlay");
    overlay.addEventListener("click", () => {
        closeCart();
        closeFavorites();
    });
});
