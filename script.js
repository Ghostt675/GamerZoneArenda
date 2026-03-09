/ ===== БАЗА ТОВАРОВ =====
const products = [
 { id:1,name:"PlayStation 5",price:1500,img:"images/ps5.jpg",popular:true },
 { id:2,name:"Xbox Series X",price:1400,img:"images/xbox.jpg",popular:true }
];

let cart=[];
let favorites=[];


// ===== КАРТОЧКИ =====
function renderProducts(containerId,filter){

 const container=document.getElementById(containerId);
 if(!container) return;

 container.innerHTML="";

 products.filter(filter).forEach(product=>{

  const isFav=favorites.includes(product.id);

  const card=document.createElement("div");
  card.className="card";

  card.innerHTML=`

  <div class="favorite-btn ${isFav?"active":""}"
       onclick="toggleFavorite(${product.id},this)">
       ❤️
  </div>

  <img src="${product.img}">
  <p>${product.name}</p>
  <span>${product.price} ₽</span>

  <button class="add-cart-btn"
  onclick="addToCart(${product.id})">
  Добавить в корзину
  </button>

  `;

  container.appendChild(card);

 });

}


// ===== КОРЗИНА =====

function addToCart(id){

 if(!cart.includes(id)) cart.push(id);

 updateCartCount();
 renderCart();
}

function removeFromCart(id){

 cart=cart.filter(i=>i!==id);

 updateCartCount();
 renderCart();
}


function updateCartCount(){

 const el=document.getElementById("cartCount");
 if(el) el.innerText=cart.length;

}


function renderCart(){

 const container=document.getElementById("cartItems");
 container.innerHTML="";

 if(!cart.length){
  container.innerHTML="<p class='empty-text'>Корзина пуста</p>";
  return;
 }

 let total=0;

 cart.forEach(id=>{

  const p=products.find(x=>x.id===id);

  total+=p.price;

  const item=document.createElement("div");
  item.className="fav-card";

  item.innerHTML=`
  <img src="${p.img}">
  <p>${p.name}</p>
  <span>${p.price} ₽</span>
  <button onclick="removeFromCart(${p.id})">❌</button>
  `;

  container.appendChild(item);

 });

 document.getElementById("total").innerText="Итого: "+total+" ₽";

}



// ===== ИЗБРАННОЕ =====

function toggleFavorite(id,btn){

 if(favorites.includes(id)){
  favorites=favorites.filter(i=>i!==id);
 }else{
  favorites.push(id);
 }

 btn.classList.toggle("active");

 renderFavorites();

}


function renderFavorites(){

 const container=document.getElementById("favoritesItems");
 container.innerHTML="";

 if(!favorites.length){
  container.innerHTML="<p class='empty-text'>Здесь будут ваши избранные товары</p>";
  return;
 }

 favorites.forEach(id=>{

  const p=products.find(x=>x.id===id);

  const card=document.createElement("div");
  card.className="fav-card";

  card.innerHTML=`

  <img src="${p.img}">
  <p>${p.name}</p>
  <span>${p.price} ₽</span>

  <button class="add-cart-btn"
  onclick="addToCart(${p.id})">
  Добавить в корзину
  </button>

  <button onclick="toggleFavorite(${p.id})">❌</button>

  `;

  container.appendChild(card);

 });

}


// ===== МОДАЛКИ =====

function openCart(){

 document.getElementById("cartModal").classList.add("open");
 renderCart();
 showOverlay();

}

function closeCart(){

 document.getElementById("cartModal").classList.remove("open");
 hideOverlay();

}


function openFavorites(){

 document.getElementById("favoritesModal").classList.add("open");
 renderFavorites();
 showOverlay();

}

function closeFavorites(){

 document.getElementById("favoritesModal").classList.remove("open");
 hideOverlay();

}


// ===== OVERLAY =====

function showOverlay(){

 const overlay=document.getElementById("overlay");
 if(overlay) overlay.classList.add("show");

}

function hideOverlay(){

 const overlay=document.getElementById("overlay");
 if(overlay) overlay.classList.remove("show");

}


// ===== SIDEBAR =====

function toggleCatalog(){

 document.getElementById("sidebar").classList.toggle("open");

}


// ===== ЗАПУСК =====

document.addEventListener("DOMContentLoaded",()=>{

 renderProducts("popularProducts",p=>p.popular);

 updateCartCount();

 document.querySelectorAll(".products-btn,.nav-btn")
 .forEach(btn=>{
  btn.addEventListener("click",()=>{
   closeCart();
   closeFavorites();
  });
 });

});
