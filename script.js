// ===== БАЗА ТОВАРОВ =====
const products = [
    { id: 1, name: "PlayStation 5", price: 1100, img: "images/ps5.jpg", category: "playstation", popular: true },
    { id: 2, name: "Xbox Series X", price: 1400, img: "images/xbox.jpg", category: "xbox", popular: true },
    { id: 3, name: "Call Of Duty WW2", price: 500, img: "images/cdww2.png", category: "accounts", popular: true }
];

// Хранение товаров в корзине и избранном
let cart = {};
let favorites = [];

// Получение данных из localStorage
function loadDataFromLocalStorage() {
    try {
        const storedCart = localStorage.getItem('cart');
        if(storedCart) cart = JSON.parse(storedCart);

        const storedFaves = localStorage.getItem('favorites');
        if(storedFaves) favorites = JSON.parse(storedFaves);
    } catch(e) {}
}

// Сохранение данных в localStorage
function saveDataToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Генерация HTML-контента для отображения товаров
function renderProducts(containerId, filterFn) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = ''; // очищаем контейнер

    products.filter(filterFn).forEach(product => {
        const isInCart = !!cart[product.id]; // проверка наличия товара в корзине
        const isFav = favorites.includes(product.id); // проверка наличия товара в избранном

        const card = document.createElement('div');
        card.className = 'card';

        card.innerHTML = `
            <div class="favorite-btn ${isFav ? 'active' : ''}"
                 data-id="${product.id}"
                 onclick="toggleFavorite(${product.id}, this)"></div>
            <img src="${product.img}" alt="${product.name}">
            <p>${product.name}</p>
            <span>${product.price} ₽</span>
            <button class="add-cart-btn"
                    data-id="${product.id}"
                    onclick="addToCart(${product.id}, this)"
            >${isInCart ? 'В корзине' : 'Добавить в корзину'}
            </button>
        `;

        container.appendChild(card);
    });
}
// Анимация полёта товара в корзину
function flyToCart(btnEl) {
    const card = btnEl.closest('.card');
    const img = card && card.querySelector('img');
    const cartIcon = document.querySelector('.cart-icon');

    console.log('Картинки:', img); // DEBUG: проверяем, нашли ли картинку
    console.log('Иконка корзины:', cartIcon); // DEBUG: проверяем, выбрали ли иконку

    if (!img || !cartIcon) return;

    const imgRect = img.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    const clone = img.cloneNode(true);
    clone.classList.add('fly-img');

    // Настройка начальной позиции
    clone.style.position = 'fixed';
    clone.style.left = `${imgRect.left}px`;
    clone.style.top = `${imgRect.top}px`;
    clone.style.width = `${imgRect.width}px`;
    clone.style.height = `${imgRect.height}px`;
    clone.style.opacity = '1';
    clone.style.zIndex = '9999';

    document.body.appendChild(clone);

    // Запуск анимации
    requestAnimationFrame(() => {
        clone.style.left = `${cartRect.left}px`;
        clone.style.top = `${cartRect.top}px`;
        clone.style.width = '30px';
        clone.style.height = '30px';
        clone.style.opacity = '0.7';
    });

    // Удаляем элемент после завершения анимации
    clone.addEventListener('transitionend', () => {
        clone.remove();
        cartIcon.classList.add('shake');
        setTimeout(() => cartIcon.classList.remove('shake'), 400);
    });
}

// Добавление товара в корзину
function addToCart(id, btnEl) {
    if (cart.hasOwnProperty(id)) {
        delete cart[id]; // Если товар уже в корзине, удаляем его
    } else {
        cart[id] = 1; // Иначе добавляем
    }

    saveDataToLocalStorage();
    updateCartCount();
    renderCart();
    renderProducts('popularProducts', p => p.popular);

    if (btnEl) {
        // Меняем текст кнопки в зависимости от состояния товара
        btnEl.textContent = cart.hasOwnProperty(id) ? 'В корзине' : 'Добавить в корзину';
    }

    // Если кнопка доступна, выполняем анимацию
    if (btnEl) flyToCart(btnEl);
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

    saveDataToLocalStorage();
    updateCartCount();
    renderCart();
}

// Обновление счётачика товаров в корзине
function updateCartCount() {
    const count = Object.values(cart).reduce((sum, val) => sum + val, 0);
    const counter = document.getElementById('cartCount');
    if(counter) counter.textContent = count.toString();
}

// Рендеринг содержимого корзины
function renderCart() {
    const container = document.getElementById('cartItems');
    if (!container) return;

    container.innerHTML = '';

    if(Object.keys(cart).length === 0) {
        container.innerHTML = '<p class="empty-text">Корзина пуста</p>';
        document.getElementById('total').innerText = '';
        return;
    }

    let totalSum = 0;

    Object.entries(cart).forEach(([id, qty]) => {
        const product = products.find(p => p.id === Number(id));
        if (!product) return;

        const subTotal = product.price * qty;
        totalSum += subTotal;

        const item = document.createElement('div');
        item.className = 'fav-card';
        item.innerHTML = `
            <img src="${product.img}" alt="${product.name}">
            <p>${product.name}<br>(количество: ${qty})</p>
            <span>Цена: ${subTotal} ₽</span>
            <button class="remove-btn" onclick="removeFromCart(${id})">❌</button>
        `;
        container.appendChild(item);
    });

    document.getElementById('total').innerText = `Итого: ${totalSum} ₽`;
}

// Рендеринг избранных товаров
function renderFavorites() {
    const container = document.getElementById('favoritesItems');
    if (!container) return;

    container.innerHTML = '';

    if (favorites.length === 0) {
        container.innerHTML = '<p class="empty-text">Нет избранных товаров.</p>';
        return;
    }

    favorites.forEach(id => {
        const product = products.find(p => p.id === id);
        if (!product) return;

        const card = document.createElement('div');
        card.className = 'fav-card';
        card.innerHTML = `
            <img src="${product.img}" alt="${product.name}">
            <p>${product.name}</p>
            <span>${product.price} ₽</span>
            <button class="add-cart-btn"
                    onclick="addToCart(${id}, this)"
            >${cart[id] ? 'В корзине' : 'Добавить в корзину'}
            </button>
            <button class="remove-btn"
                    onclick="toggleFavorite(${id})"
            >❌</button>
        `;
        container.appendChild(card);
    });
}

// Открыть корзину
function openCart() {
    const modal = document.getElementById('cartModal');
    if(modal) modal.classList.add('open');
    renderCart();
    showOverlay();
}

// Закрыть корзину
function closeCart() {
    const modal = document.getElementById('cartModal');
    if(modal) modal.classList.remove('open');
    hideOverlay();
}

// Открыть избранное
function openFavorites() {
    const modal = document.getElementById('favoritesModal');
    if(modal) modal.classList.add('open');
    renderFavorites();
    showOverlay();
}

// Закрыть избранное
function closeFavorites() {
    const modal = document.getElementById('favoritesModal');
    if(modal) modal.classList.remove('open');
    hideOverlay();
}

// Показать полупрозрачный оверлей
function showOverlay() {
    const overlay = document.getElementById('overlay');
    if(overlay) overlay.classList.add('show');
}

// Скрыть полупрозрачный оверлей
function hideOverlay() {
    const overlay = document.getElementById('overlay');
    if(overlay) overlay.classList.remove('show');
}

// Переключение каталога
function toggleCatalog() {
    const sidebar = document.getElementById('sidebar');
    const navbar = document.querySelector('.navbar');
    if(sidebar && navbar) {
        sidebar.classList.toggle('open');
        navbar.classList.toggle('shifted');
    }
}

// Управление избранным
function toggleFavorite(id, btnEl) {
    const index = favorites.indexOf(id);
    if(index === -1) {
        favorites.push(id);
    } else {
        favorites.splice(index, 1);
    }

    if(btnEl) {
        btnEl.classList.toggle('active', favorites.includes(id));
    }

    saveDataToLocalStorage();
    renderFavorites();
    renderProducts('popularProducts', p => p.popular);
}

// Главная загрузочная функция
document.addEventListener('DOMContentLoaded', () => {
    loadDataFromLocalStorage();
    renderProducts('popularProducts', p => p.popular);
    updateCartCount();

    const overlay = document.getElementById('overlay');
    if(overlay) {
        overlay.addEventListener('click', () => {
            closeCart();
            closeFavorites();
        });
    }
});
