// ===== БАЗА ТОВАРОВ =====
const products = [
    { 
      id:1,
      name:"PlayStation 5",
      prices:[1100, 600, 600, 600, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500], 
      maxPeriod:14,
      minPeriod:1,              // Минимум 3 суток
      periodValue:1,
      period:"сутки",
      img:"images/ps5.jpg",
      category:"playstation",
      popular:true 
    },
    { 
      id:2,
      name:"Xbox Series X",
      prices:[1400, 600, 600, 600, 500],
      maxPeriod:14,
      minPeriod:1,              // Минимум 2 суток
      periodValue:1,
      period:"сутки",
      img:"images/xbox.jpg",
      category:"xbox",
      popular:true 
    },
    { 
      id:3,
      name:"Call Of Duty WW2",
      prices:[300, 100, 150],
      maxPeriod:14,
      minPeriod:3,              // Минимум 1 сутки
      periodValue:3,
      period:"сутки",
      img:"images/cdww2.png",
      category:"accounts",
      popular:true 
    }
];

// ===== LOCAL STORAGE =====
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

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
    }
}

// Загрузка избранного из localStorage
function loadFavoritesFromLocalStorage() {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
        favorites = JSON.parse(savedFavorites);
    }
}

// Функция изменения периода аренды

function changePeriod(id, delta) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    product.periodValue += delta;

    // Ограничиваем значения
    if (product.periodValue < product.minPeriod) product.periodValue = product.minPeriod; // Индивидуальное минимальное значение
    if (product.periodValue > product.maxPeriod) product.periodValue = product.maxPeriod;

    // Пересчитываем содержимое корзины
    renderCart();
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
            <div class="favorite-btn ${isFav ? 'active' : ''}" data-id="${product.id}" onclick="toggleFavorite(${product.id}, this)"></div>
            <img src="${product.img}" alt="${product.name}">
            <p>${product.name}</p>
            <span>${product.prices[0]} ₽ за ${formatDuration(product.periodValue)}</span>
            <button class="add-cart-btn" data-id="${product.id}" onclick="addToCart(${product.id}, this)">
                ${cart.includes(product.id) ? "В корзине" : "Добавить в корзину"}
            </button>
        `;
        container.appendChild(card);
    });
}

// ===== АНИМАЦИЯ ТОВАР ЛЕТИТ В КОРЗИНУ =====
function flyToCart(btnEl) {
    console.log("Запущена анимация:", btnEl); // Логирование для проверки наличия элемента

    const card = btnEl.closest(".card"); // Найти ближайшую родительскую карту
    const img = card ? card.querySelector("img") : null; // Найти картинку товара
    const cartIcon = document.querySelector(".cart-icon"); // Получить иконку корзины

    if (!img || !cartIcon) return;

    // Продолжаем стандартную реализацию анимируемого эффекта
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
    flyingImg.style.pointerEvents = "none"; // Сделать непрозрачным для кликов

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


function addToCart(id, btnEl) {
    if (cart.includes(id)) {
        // Удалить товар
        cart = cart.filter(item => item !== id);
    } else {
        // Добавить товар
        cart.push(id);

        if(btnEl){
            flyToCart(btnEl);
        }
    }

    saveCartToLocalStorage();
    updateCartCount();
    renderCart(); // Важно обновить корзину после добавления!
    renderFavorites();
    renderProducts("popularProducts", p => p.popular); // Обновляем отображение списка популярных товаров
}

function removeFromCart(id){
    cart = cart.filter(item => item !== id);

    const btn = document.querySelector(`.add-cart-btn[data-id="${id}"]`);
    if(btn){
        btn.classList.remove("in-cart");
        btn.innerText = "Добавить в корзину";
    }
    saveCartToLocalStorage();
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
        if (!product) return;

        const days = product.periodValue;
        const firstDayCost = product.prices[0];                // Цена за первый день
        const subsequentDaysCost = Math.max(days - 1, 0) * product.prices[1]; // Цена за доп. дни
        const totalProductCost = firstDayCost + subsequentDaysCost;           // Общая стоимость

        total += totalProductCost;

        const item = document.createElement("div");
        item.className = "fav-card";
        item.innerHTML = `
    <img src="${product.img}" alt="${product.name}">
    <p>${product.name}</p>
    <div class="period-controls">
        <button class="control-btn" onclick="changePeriod(${product.id}, -1)">−</button>
        <div class="period-center">
            <span class="period-label">${formatDuration(product.periodValue)}</span> <!-- Оставляем только корректное окончание -->
        </div>
        <button class="control-btn" onclick="changePeriod(${product.id}, 1)">+</button>
    </div>
    <span>Стоимость: ${totalProductCost} ₽</span>
    <button class="remove-btn" onclick="removeFromCart(${product.id})">✖️</button>
`;
        container.appendChild(item);
    });
    document.getElementById("total").innerText = "Итого: " + total + " ₽";
}

function renderFavorites() {
    const container = document.getElementById("favoritesItems");
    container.innerHTML = "";

    if (!favorites.length) {
        container.innerHTML = "<p class='empty-text'>Здесь пока ничего нет.</p>";
        return;
    }

    favorites.forEach(id => {
        const product = products.find(p => p.id === id);
        if (!product) return;

        const card = document.createElement("div");
        card.className = "fav-card";
        card.innerHTML = `
            <img src="${product.img}" alt="${product.name}">
            <h3>${product.name}</h3>
            <span>Цена: ${product.prices[0]} ₽</span>
            <div class="actions">
                <button class="add-cart-btn" onclick="addToCart(${product.id}, this)">
                    ${cart.includes(product.id) ? "В корзине" : "Добавить в корзину"}
                </button>
                <button class="remove-btn" onclick="toggleFavorite(${product.id})">❌</button>
            </div>
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

//функция прыжка сердца избранного
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

        // Эффект «прыжка»
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


// Функция для правильного написания окончания
function formatDuration(value) {
    let remainder = value % 100;
    if ((remainder >= 5 && remainder <= 20) || (value % 10 >= 5 || value % 10 === 0)) {
        return `${value} суток`;
    } else if (value % 10 === 1) {
        return `${value} сутки`;
    } else if (value % 10 >= 2 && value % 10 <= 4) {
        return `${value} суток`;
    } else {
        return `${value} суток`;
    }
}

// ===== МОДАЛКИ =====
function openCheckout() {
    if (cart.length === 0) { alert("Корзина пуста"); return; }
    document.getElementById("checkoutModal").classList.add("open");
}
function closeCheckout() { document.getElementById("checkoutModal").classList.remove("open"); }
function openConfirm() { document.getElementById("confirmModal").classList.add("open"); }
function closeConfirm() { document.getElementById("confirmModal").classList.remove("open"); }

// ===== ИНДИКАТОР ЗАГРУЗКИ =====
function showLoader() { document.getElementById("loadingOverlay").classList.add("show"); }
function hideLoader() { document.getElementById("loadingOverlay").classList.remove("show"); }

// ===== ПРЕВЬЮ ЗАКАЗА =====
document.getElementById("checkOrderBtn").addEventListener("click", () => {
    const fio = document.getElementById("fio").value.trim();
    const birth = document.getElementById("birth").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();
    const deliveryTime = document.getElementById("deliveryTime").value.trim();
    const comment = document.getElementById("comment").value.trim() || "Нет пожеланий";
    const agree = document.getElementById("agree").checked;

    if (!fio || !birth || !phone || !address || !deliveryTime) { alert("Заполните все обязательные поля"); return; }
    if (!agree) { alert("Нужно согласие на обработку данных"); return; }

    const preview = `
        <p><strong>ФИО:</strong> ${fio}</p>
        <p><strong>Дата рождения:</strong> ${birth}</p>
        <p><strong>Телефон:</strong> ${phone}</p>
        <p><strong>Адрес:</strong> ${address}</p>
        <p><strong>Доставка:</strong> ${deliveryTime}</p>
        <p><strong>Пожелания:</strong> ${comment}</p>
        <p><strong>Товары:</strong></p>
        <ul>
            ${cart.map(id => {
                const p = products.find(pr => pr.id === id);
                const days = p.periodValue;
                const price = p.prices[0] + Math.max(days - 1, 0) * p.prices[1];
                return `<li>${p.name} — ${days} суток — ${price} ₽</li>`;
            }).join("")}
        </ul>
    `;
    document.getElementById("orderPreview").innerHTML = preview;
    closeCheckout();
    openConfirm();
});

// ===== ОТПРАВКА ЗАКАЗА =====
async function sendOrder() {
    const fio = document.getElementById("fio").value.trim();
    const birth = document.getElementById("birth").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();
    const deliveryTime = document.getElementById("deliveryTime").value.trim();
    const comment = document.getElementById("comment").value.trim() || "Нет пожеланий";

    if (!fio || !birth || !phone || !address || !deliveryTime) {
        alert("Заполните все обязательные поля"); return;
    }

    const cartItems = cart.map(id => {
        const p = products.find(pr => pr.id === id);
        return { name: p.name, days: p.periodValue, price: p.prices[0] + Math.max(p.periodValue - 1, 0) * p.prices[1] };
    });

    const order = { user: { fio, birth, phone, address }, cart: cartItems, deliveryTime, comment };
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbypFLjWz9e7_aDlBx5__AGGScMV8nHfC4lWh3t7h5T7aSsz40EOI4uwZ0Sl51H2yNJPgQ/exec";

    try {
        showLoader();
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(order)
        });

        if (!response.ok) throw new Error("Сервер вернул ошибку: " + response.status);
        const result = await response.json();
        if (result.status !== "ok") throw new Error(result.message || "Ошибка сервера");

        alert("Заказ успешно отправлен!");
        cart = [];
        localStorage.setItem("cart", "[]");
        renderCart(); updateCartCount(); renderProducts("popularProducts", p => p.popular); renderFavorites();
        closeConfirm();

    } catch (e) {
        console.error("Ошибка:", e);
        alert("Ошибка отправки: " + e.message);
    } finally { hideLoader(); }
}

// Привязка кнопки
document.getElementById("sendOrderBtn").addEventListener("click", sendOrder); 

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
