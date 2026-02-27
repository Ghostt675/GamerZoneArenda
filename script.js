document.addEventListener("DOMContentLoaded", () => {

    // ===== CART & SIDEBAR =====
    let cart = [];

    // открыть/закрыть sidebar по кнопке "Каталог"
    function toggleCatalog() {
        const sidebar = document.getElementById("sidebar");
        sidebar.classList.toggle("open");
    }

    // добавить товар в корзину
    window.addToCart = function(name, price) {
        cart.push({ name, price });
        updateCart();
    }

    // обновить счетчик корзины
    function updateCart() {
        document.getElementById("cartCount").innerText = cart.length;
    }

    // открыть модальное окно корзины
    window.openCart = function() {
        const modal = document.getElementById("cartModal");
        const items = document.getElementById("cartItems");
        items.innerHTML = "";
        let total = 0;

        cart.forEach((i, index) => {
            items.innerHTML += <p>${i.name} — ${i.price} ₽ <button onclick="removeFromCart(${index})">❌</button></p>;
            total += i.price;
        });

        document.getElementById("total").innerText = "Итого: " + total + " ₽";
        modal.classList.add("open");

        // показать overlay
        document.querySelector(".overlay").classList.add("show");
    }

    // удалить товар из корзины по индексу
    window.removeFromCart = function(index) {
        cart.splice(index, 1);
        updateCart();
        openCart(); // обновить окно корзины
    }

    // закрыть корзину
    window.closeCart = function() {
        const modal = document.getElementById("cartModal");
        modal.classList.remove("open");
        document.querySelector(".overlay").classList.remove("show");
    }

    // оформить заказ
    document.querySelector(".orderBtn").addEventListener("click", function () {
        if (cart.length === 0) {
            alert("Корзина пуста!");
            return;
        }

        alert("Заказ оформлен! Уведомление придет вам.");

        // сброс корзины
        cart = [];
        updateCart();
        closeCart();
    });

    // закрытие корзины при клике на overlay
    document.querySelector(".overlay").addEventListener("click", closeCart);

    // прикрепляем toggleCatalog к кнопке "Каталог"
    document.querySelector(".products-btn").addEventListener("click", toggleCatalog);

});
