// ===== CART & SIDEBAR =====
let cart = [];

// открыть/закрыть sidebar по кнопке "Каталог"
function toggleCatalog() {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("open");
}

// добавить товар в корзину
function addToCart(name, price) {
    cart.push({ name, price });
    updateCart();
}

// обновить счетчик корзины
function updateCart() {
    document.getElementById("cartCount").innerText = cart.length;
}

// открыть модальное окно корзины
function openCart() {
    const modal = document.getElementById("cartModal");
    const items = document.getElementById("cartItems");
    items.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        items.innerHTML += `<p>${item.name} — ${item.price} ₽ <button onclick="removeFromCart(${index})">❌</button></p>`;
        total += item.price;
    });

    document.getElementById("total").innerText = "Итого: " + total + " ₽";
    modal.classList.add("open");

    // overlay
    let overlay = document.querySelector(".overlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.classList.add("overlay");
        overlay.addEventListener("click", closeCart);
        document.body.appendChild(overlay);
    }
    overlay.classList.add("show");
}

// удалить товар из корзины
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
    openCart(); // обновить корзину
}

// закрыть корзину
function closeCart() {
    const modal = document.getElementById("cartModal");
    modal.classList.remove("open");
    const overlay = document.querySelector(".overlay");
    if (overlay) overlay.classList.remove("show");
}

// оформить заказ
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
});


// ===== FAVORITES =====
let favorites = [];

// Открыть модальное окно избранного
function openFavorites() {
    const modal = document.getElementById("favoritesModal");
    const container = document.getElementById("favoritesItems");
    container.innerHTML = "";

    if(favorites.length === 0){
        container.innerHTML = '<p class="empty-text">Здесь будут ваши избранные товары</p>';
    } else {
        favorites.forEach((item, index) => {
            const div = document.createElement("div");
            div.classList.add("fav-card");
            div.innerHTML = `
                <img src="${item.img}" alt="${item.name}">
                <p>${item.name}</p>
                <span>${item.price} ₽</span>
                <button onclick="removeFromFavorites(${index})">❌</button>
            `;
            container.appendChild(div);
        });
    }

    modal.classList.add("open");
}

// Закрыть модальное окно избранного
function closeFavorites() {
    const modal = document.getElementById("favoritesModal");
    modal.classList.remove("open");
}

// Добавить товар в избранное
function addToFavorites(name, price, img) {
    // Проверяем, есть ли уже такой товар
    const exists = favorites.some(item => item.name === name);
    if(exists){
        alert("Этот товар уже в избранном!");
        return;
    }

    favorites.push({name, price, img});
    openFavorites(); // Обновляем окно сразу после добавления
}

// Удалить товар из избранного
function removeFromFavorites(index){
    favorites.splice(index, 1);
    openFavorites();
}
