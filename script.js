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

    // создать overlay если его нет
    if (!document.querySelector(".overlay")) {
        const overlay = document.createElement("div");
        overlay.classList.add("overlay");
        overlay.addEventListener("click", closeCart);
        document.body.appendChild(overlay);
    }
    document.querySelector(".overlay").classList.add("show");
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
