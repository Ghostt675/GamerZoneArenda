// ===== БАЗА ТОВАРОВ =====
const products = [
{
    id:1,
    name:"PlayStation 5",
    price:1100,          
    dailyPrice:[1100, 1000, 950], // цена за 1-й, 2-й, 3-й день и далее по умолчанию price
    maxDays:30,          
    startDays:1,         
    img:"images/ps5.jpg",
    category:"playstation",
    popular:true
},

{
    id:2,
    name:"Xbox Series X",
    price:1400,
    dailyPrice:[1400,1350,1300],
    maxDays:20,
    startDays:1,
    img:"images/xbox.jpg",
    category:"xbox",
    popular:true
},

{
    id:3,
    name:"Call Of Duty WW2",
    price:500,
    dailyPrice:[500,450,400],
    maxDays:7,
    startDays:1,
    img:"images/cdww2.png",
    category:"accounts",
    popular:true
}
];

// ===== LOCAL STORAGE =====
let cart = JSON.parse(localStorage.getItem("cart")) || {};
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// ===== LOCAL STORAGE FUNCTIONS =====
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}
function saveFavoritesToLocalStorage() {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}
function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) cart = JSON.parse(savedCart);
}
function loadFavoritesFromLocalStorage() {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) favorites = JSON.parse(savedFavorites);
}

// ===== HELPER FUNCTION =====
function getSubtotal(product, days){
    let subtotal = 0;
    for(let i=0;i<days;i++){
        if(product.dailyPrice && product.dailyPrice[i] != null){
            subtotal += product.dailyPrice[i];
        } else {
            subtotal += product.price;
        }
    }
    return subtotal;
}

// ===== RENDER PRODUCTS =====
function renderProducts(containerId, filterFn){
    const container = document.getElementById(containerId);
    if(!container) return;
    container.innerHTML = "";

    products.filter(filterFn).forEach(product => {
        const isFav = favorites.includes(product.id);
        const inCart = cart[product.id] != null;
        const days = inCart ? cart[product.id].days : product.startDays;
        const subtotal = getSubtotal(product, days);

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <div class="favorite-btn ${isFav ? "active" : ""}" 
                 data-id="${product.id}" 
                 onclick="toggleFavorite(${product.id}, this)"></div>
            <img src="${product.img}" alt="${product.name}">
            <p>${product.name}</p>
            <span>${subtotal} ₽ / ${days} ${days>1?'суток':'сутки'}</span>
            <button class="add-cart-btn" 
                data-id="${product.id}" 
                onclick="addToCart(${product.id}, this)">
                ${inCart ? "В корзине" : "Добавить в корзину"}
            </button>
        `;
        container.appendChild(card);
    });
}

// ===== ANIMATION =====
function flyToCart(btnEl){
    const card = btnEl.closest(".card");
    const img = card ? card.querySelector("img") : null;
    const cartIcon = document.querySelector(".cart-icon");
    if(!img || !cartIcon) return;

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

    setTimeout(()=>{
        flyingImg.style.left = cartRect.left + "px";
        flyingImg.style.top = cartRect.top + "px";
        flyingImg.style.width = "30px";
        flyingImg.style.height = "30px";
        flyingImg.style.opacity = "0.2";
    },10);

    setTimeout(()=>flyingImg.remove(),700);
}

// =====FUNCTIONS =====
function addToCart(id, btnEl){
    const product = products.find(p=>p.id===id);
    if(!product) return;

    if(!cart[id]){
        cart[id] = {days: product.startDays};
        if(btnEl) flyToCart(btnEl);
    } else {
        delete cart[id];
    }
    saveCartToLocalStorage();
    updateCartCount();
    renderCart();
    renderProducts("popularProducts", p=>p.popular);
}

function removeFromCart(id){
    delete cart[id];
    const btn = document.querySelector(`.add-cart-btn[data-id="${id}"]`);
    if(btn){
        btn.classList.remove("in-cart");
        btn.innerText = "Добавить в корзину";
    }
    saveCartToLocalStorage();
    updateCartCount();
    renderCart();
}

function changeDays(id, delta){
    const product = products.find(p=>p.id===id);
    if(!product || !cart[id]) return;

    cart[id].days += delta;
    if(cart[id].days < 1) cart[id].days = 1;
    if(cart[id].days > product.maxDays) cart[id].days = product.maxDays;

    saveCartToLocalStorage();
    renderCart();
    updateCartCount();
}

function updateCartCount(){
    const el = document.getElementById("cartCount");
    if(el) el.innerText = Object.keys(cart).length;
}

function renderCart(){
    const container = document.getElementById("cartItems");
    container.innerHTML = "";
    const ids = Object.keys(cart);
    if(ids.length===0){
        container.innerHTML = "<p class='empty-text'>Корзина пуста</p>";
        document.getElementById("total").innerText = "";
        return;
    }

    let total=0;
    ids.forEach(id=>{
        const product = products.find(p=>p.id==parseInt(id));
        if(!product) return;
        const days = cart[id].days;
        const subtotal = getSubtotal(product, days);
        total+=subtotal;

        const item = document.createElement("div");
        item.className="fav-card";
        item.innerHTML=`
            <img src="${product.img}" alt="${product.name}">
            <div class="cart-info">
                <p>${product.name}</p>
                <span>${subtotal} ₽ / ${days} ${days>1?'суток':'сутки'}</span>
                <div class="day-controls">
                    <button onclick="changeDays(${id}, -1)">-</button>
                    <span>${days}</span>
                    <button onclick="changeDays(${id}, 1)">+</button>
                </div>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${id})">❌</button>
        `;
        container.appendChild(item);
    });

    document.getElementById("total").innerText = "Итого: "+total+" ₽";
}

// ===== FAVORITES =====
function renderFavorites(){
    const container = document.getElementById("favoritesItems");
    container.innerHTML="";
    if(!favorites.length){
        container.innerHTML="<p class='empty-text'>Здесь будут ваши избранные товары</p>";
        return;
    }
    favorites.forEach(id=>{
        const product = products.find(p=>p.id===id);
        if(!product) return;
        const card = document.createElement("div");
        card.className="fav-card";
        card.innerHTML=`
            <img src="${product.img}" alt="${product.name}">
            <p>${product.name}</p>
            <span>${product.price} ₽</span>
            <button class="add-cart-btn" onclick="addToCart(${product.id}, this)">
                ${cart[product.id]?"В корзине":"Добавить в корзину"}
            </button>
            <button class="remove-btn" onclick="toggleFavorite(${product.id})">❌</button>
        `;
        container.appendChild(card);
    });
}

// ===== MODALS =====
function openCart(){document.getElementById("cartModal").classList.add("open");renderCart();showOverlay();}
function closeCart(){document.getElementById("cartModal").classList.remove("open");hideOverlay();}
function openFavorites(){document.getElementById("favoritesModal").classList.add("open");renderFavorites();showOverlay();}
function closeFavorites(){document.getElementById("favoritesModal").classList.remove("open");hideOverlay();}

// ===== OVERLAY =====
function showOverlay(){document.getElementById("overlay").classList.add("show");}
function hideOverlay(){document.getElementById("overlay").classList.remove("show");}

// ===== SIDEBAR =====
function toggleCatalog(){
    const sidebar = document.getElementById("sidebar");
    const navbar = document.querySelector(".navbar");
    if(!sidebar || !navbar) return;
    sidebar.classList.toggle("open");
    navbar.classList.toggle("shifted");
}

// ===== FAVORITE BUTTON =====
function toggleFavorite(id, btnEl){
    const idx = favorites.indexOf(id);
    if(idx===-1) favorites.push(id);
    else favorites.splice(idx,1);

    if(!btnEl) btnEl=document.querySelector(`.favorite-btn[data-id="${id}"]`);
    if(btnEl){
        btnEl.classList.toggle("active", favorites.includes(id));
        if(favorites.includes(id)){
            btnEl.style.transform="scale(1.3)";
            setTimeout(()=>btnEl.style.transform="scale(1)",200);
        }
    }

    saveFavoritesToLocalStorage();
    renderFavorites();
    renderProducts("popularProducts",p=>p.popular);
}

// ===== INIT =====
document.addEventListener("DOMContentLoaded", ()=>{
    loadCartFromLocalStorage();
    loadFavoritesFromLocalStorage();
    renderProducts("popularProducts",p=>p.popular);
    updateCartCount();

    const overlay = document.getElementById("overlay");
    overlay.addEventListener("click",()=>{
        closeCart();
        closeFavorites();
    });
}); 
