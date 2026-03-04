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


let favorites = [];

// открыть Избранное
function openFavorites() {
    const modal = document.getElementById("favoritesModal");
    const items = document.getElementById("favoriteItems");
    items.innerHTML = "";

    if (favorites.length === 0) {
        items.innerHTML = "<p>Здесь будут ваши избранные товары</p>";
    } else {
        favorites.forEach((item, index) => {
            items.innerHTML += `
                <div class="favorite-card">
                    <img src="${item.img}" alt="${item.name}" width="60">
                    <p>${item.name} — ${item.price} ₽</p>
                    <button onclick="removeFromFavorites(${index})">❌</button>
                </div>
            `;
        });
    }

    modal.classList.add("open");
    document.querySelector(".overlay").classList.add("show");

    // съезжает navbar как у sidebar
    document.querySelector(".navbar").style.marginLeft = "220px";
}

// добавить в Избранное
function addToFavorites(name, price, img) {
    favorites.push({ name, price, img });
    openFavorites();
}

// удалить из Избранного
function removeFromFavorites(index) {
    favorites.splice(index, 1);
    openFavorites();
}

// закрыть Избранное
function closeFavorites() {
    const modal = document.getElementById("favoritesModal");
    modal.classList.remove("open");
    document.querySelector(".overlay").classList.remove("show");
    document.querySelector(".navbar").style.marginLeft = "70px";
}
